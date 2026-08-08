import { getDb, FieldValue } from '../../config/firebase.js'
import { appendOrderToCustomer } from '../customers/model.js'

export const ORDER_STATUSES = {
  NEW: 'new',
  PREPARING: 'preparing',
  PACKED: 'packed',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const ACTIVE_STATUSES = [
  ORDER_STATUSES.NEW,
  ORDER_STATUSES.PREPARING,
  ORDER_STATUSES.PACKED,
]

const STATUS_TRANSITIONS = {
  [ORDER_STATUSES.NEW]: [ORDER_STATUSES.PREPARING, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PREPARING]: [ORDER_STATUSES.PACKED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PACKED]: [ORDER_STATUSES.DELIVERED, ORDER_STATUSES.CANCELLED],
}

// In-memory fallback stores for development mode
const memoryOrders = []
const memoryOrderCounters = {}

export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

export function canTransition(from, to) {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false
}

function serializeDoc(doc) {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? (typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString()),
  }
}

export async function getNextOrderNo(db, orderDate) {
  if (!db) {
    memoryOrderCounters[orderDate] = (memoryOrderCounters[orderDate] || 0) + 1
    return memoryOrderCounters[orderDate]
  }

  const counterRef = db.collection('orderCounters').doc(orderDate)

  return db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef)
    let orderNo = 1

    if (counterDoc.exists) {
      orderNo = (counterDoc.data().lastOrderNo || 0) + 1
    }

    transaction.set(counterRef, { lastOrderNo: orderNo }, { merge: true })
    return orderNo
  })
}

export async function createOrderInDb(orderData) {
  const db = getDb()
  const orderDate = getTodayDate()
  const orderNo = await getNextOrderNo(db, orderDate)
  const isoNow = new Date().toISOString()
  const customId = `ord-${orderDate.replace(/-/g, '')}-${orderNo}`

  const cName = orderData.customerName || orderData.customerDetails?.name || ''
  const cMobile = orderData.customerMobile || orderData.customerDetails?.mobile || ''
  const cDid = orderData.customerDid || orderData.customerDetails?.customerDid || ''

  const customerDetails = {
    name: cName,
    mobile: cMobile,
    customerDid: cDid,
  }

  if (!db) {
    const order = {
      id: customId,
      orderNo,
      orderDate,
      customerName: cName,
      customerMobile: cMobile,
      customerDid: cDid,
      customerDetails,
      CustomerDetails: customerDetails,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: ORDER_STATUSES.NEW,
      payment: null,
      createdAt: isoNow,
      updatedAt: isoNow,
    }
    memoryOrders.unshift(order)
    appendOrderToCustomer(cDid || cMobile, order)
    return order
  }

  const now = FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date()
  const order = {
    orderNo,
    orderDate,
    customerName: cName,
    customerMobile: cMobile,
    customerDid: cDid,
    customerDetails,
    CustomerDetails: customerDetails,
    items: orderData.items,
    totalAmount: orderData.totalAmount,
    status: ORDER_STATUSES.NEW,
    payment: null,
    createdAt: now,
    updatedAt: now,
  }

  const docRef = db.collection('orders').doc(customId)
  await docRef.set(order)
  invalidateActiveOrdersCache()
  const created = await docRef.get()
  const serialized = serializeDoc(created)
  appendOrderToCustomer(cDid || cMobile, serialized)
  return serialized
}

let activeOrdersCache = null
let activeOrdersTimestamp = 0
const ACTIVE_ORDERS_TTL = 3000 // 3 seconds

export function invalidateActiveOrdersCache() {
  activeOrdersCache = null
  activeOrdersTimestamp = 0
}

export async function fetchActiveOrders() {
  const now = Date.now()
  if (activeOrdersCache && now - activeOrdersTimestamp < ACTIVE_ORDERS_TTL) {
    return activeOrdersCache
  }

  const db = getDb()

  if (!db) {
    activeOrdersCache = memoryOrders
      .filter((o) => ACTIVE_STATUSES.includes(o.status))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    activeOrdersTimestamp = now
    return activeOrdersCache
  }

  const snapshot = await db
    .collection('orders')
    .where('status', 'in', ACTIVE_STATUSES)
    .get()

  const orders = snapshot.docs.map(serializeDoc)
  activeOrdersCache = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  activeOrdersTimestamp = now
  return activeOrdersCache
}

export async function fetchOrders({ fromDate, toDate, status } = {}) {
  const db = getDb()

  if (!db) {
    let result = [...memoryOrders]
    if (fromDate) {
      result = result.filter((o) => o.orderDate >= fromDate)
    }
    if (toDate) {
      result = result.filter((o) => o.orderDate <= toDate)
    }
    if (status) {
      result = result.filter((o) => o.status === status)
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  let query = db.collection('orders')

  if (fromDate) {
    query = query.where('orderDate', '>=', fromDate)
  }
  if (toDate) {
    query = query.where('orderDate', '<=', toDate)
  }
  if (status) {
    query = query.where('status', '==', status)
  }

  const snapshot = await query.get()
  const orders = snapshot.docs.map(serializeDoc)
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function fetchOrderById(id) {
  const db = getDb()

  if (!db) {
    const order = memoryOrders.find((o) => o.id === id)
    return order || null
  }

  const doc = await db.collection('orders').doc(id).get()
  if (!doc.exists) return null
  return serializeDoc(doc)
}

export async function updateOrderStatusInDb(id, newStatus) {
  const db = getDb()

  if (!db) {
    const order = memoryOrders.find((o) => o.id === id)
    if (!order) throw new Error('Order not found')
    if (!canTransition(order.status, newStatus)) {
      throw new Error(`Cannot transition from ${order.status} to ${newStatus}`)
    }
    order.status = newStatus
    order.updatedAt = new Date().toISOString()
    return order
  }

  const docRef = db.collection('orders').doc(id)
  const doc = await docRef.get()
  if (!doc.exists) throw new Error('Order not found')

  const currentData = doc.data()
  if (!canTransition(currentData.status, newStatus)) {
    throw new Error(`Cannot transition from ${currentData.status} to ${newStatus}`)
  }

  const isoNow = new Date().toISOString()
  await docRef.update({
    status: newStatus,
    updatedAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
  })
  invalidateActiveOrdersCache()

  return {
    id: doc.id,
    ...currentData,
    status: newStatus,
    updatedAt: isoNow,
  }
}

export async function deliverOrderInDb(id, payment) {
  const db = getDb()

  if (!db) {
    const order = memoryOrders.find((o) => o.id === id)
    if (!order) throw new Error('Order not found')
    if (order.status !== ORDER_STATUSES.PACKED) {
      throw new Error('Order must be packed before delivery')
    }
    order.status = ORDER_STATUSES.DELIVERED
    order.payment = payment
    order.updatedAt = new Date().toISOString()
    invalidateActiveOrdersCache()
    return order
  }

  const docRef = db.collection('orders').doc(id)
  const doc = await docRef.get()
  if (!doc.exists) throw new Error('Order not found')

  const currentData = doc.data()
  if (currentData.status !== ORDER_STATUSES.PACKED) {
    throw new Error('Order must be packed before delivery')
  }

  const isoNow = new Date().toISOString()
  await docRef.update({
    status: ORDER_STATUSES.DELIVERED,
    payment,
    updatedAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
  })
  invalidateActiveOrdersCache()

  return {
    id: doc.id,
    ...currentData,
    status: ORDER_STATUSES.DELIVERED,
    payment,
    updatedAt: isoNow,
  }
}
