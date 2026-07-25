import { getDb, FieldValue } from '../config/firebase.js'

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

export async function createOrder(orderData) {
  const db = getDb()
  const orderDate = getTodayDate()
  const orderNo = await getNextOrderNo(db, orderDate)
  const isoNow = new Date().toISOString()
  const customId = `ord-${orderDate.replace(/-/g, '')}-${orderNo}`

  if (!db) {
    const order = {
      id: customId,
      orderNo,
      orderDate,
      customerName: orderData.customerName,
      customerMobile: orderData.customerMobile,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: ORDER_STATUSES.NEW,
      payment: null,
      createdAt: isoNow,
      updatedAt: isoNow,
    }
    memoryOrders.unshift(order)
    return order
  }

  const now = FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date()
  const order = {
    orderNo,
    orderDate,
    customerName: orderData.customerName,
    customerMobile: orderData.customerMobile,
    items: orderData.items,
    totalAmount: orderData.totalAmount,
    status: ORDER_STATUSES.NEW,
    payment: null,
    createdAt: now,
    updatedAt: now,
  }

  const docRef = db.collection('orders').doc(customId)
  await docRef.set(order)
  const created = await docRef.get()
  return serializeDoc(created)
}

export async function getActiveOrders() {
  const db = getDb()

  if (!db) {
    return memoryOrders
      .filter((o) => ACTIVE_STATUSES.includes(o.status))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const snapshot = await db
    .collection('orders')
    .where('status', 'in', ACTIVE_STATUSES)
    .get()

  const orders = snapshot.docs.map(serializeDoc)
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function getOrders({ fromDate, toDate, status } = {}) {
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

export async function getOrderById(id) {
  const db = getDb()

  if (!db) {
    const order = memoryOrders.find((o) => o.id === id)
    return order || null
  }

  const doc = await db.collection('orders').doc(id).get()
  if (!doc.exists) return null
  return serializeDoc(doc)
}

export async function updateOrderStatus(id, newStatus) {
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

  const currentStatus = doc.data().status
  if (!canTransition(currentStatus, newStatus)) {
    throw new Error(`Cannot transition from ${currentStatus} to ${newStatus}`)
  }

  await docRef.update({
    status: newStatus,
    updatedAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
  })

  const updated = await docRef.get()
  return serializeDoc(updated)
}

export async function deliverOrder(id, payment) {
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
    return order
  }

  const docRef = db.collection('orders').doc(id)
  const doc = await docRef.get()
  if (!doc.exists) throw new Error('Order not found')

  if (doc.data().status !== ORDER_STATUSES.PACKED) {
    throw new Error('Order must be packed before delivery')
  }

  await docRef.update({
    status: ORDER_STATUSES.DELIVERED,
    payment,
    updatedAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
  })

  const updated = await docRef.get()
  return serializeDoc(updated)
}

export async function getItemOrderCounts(date) {
  const db = getDb()
  const targetDate = date || getTodayDate()

  if (!db) {
    const counts = {}
    memoryOrders.forEach((order) => {
      if (order.orderDate !== targetDate) return
      if (order.status === ORDER_STATUSES.CANCELLED) return
      order.items?.forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity
      })
    })
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }

  const snapshot = await db
    .collection('orders')
    .where('orderDate', '==', targetDate)
    .get()

  const counts = {}
  snapshot.docs.forEach((doc) => {
    const order = doc.data()
    if (order.status === ORDER_STATUSES.CANCELLED) return
    order.items?.forEach((item) => {
      counts[item.name] = (counts[item.name] || 0) + item.quantity
    })
  })

  return Object.entries(counts).map(([name, count]) => ({ name, count }))
}

export async function getOrderGrowth(month, year) {
  const db = getDb()
  const targetMonth = month || new Date().getMonth() + 1
  const targetYear = year || new Date().getFullYear()
  const monthStr = String(targetMonth).padStart(2, '0')
  const fromDate = `${targetYear}-${monthStr}-01`
  const lastDay = new Date(targetYear, targetMonth, 0).getDate()
  const toDate = `${targetYear}-${monthStr}-${String(lastDay).padStart(2, '0')}`

  if (!db) {
    const dayCounts = {}
    memoryOrders.forEach((order) => {
      if (order.orderDate < fromDate || order.orderDate > toDate) return
      if (order.status === ORDER_STATUSES.CANCELLED) return
      dayCounts[order.orderDate] = (dayCounts[order.orderDate] || 0) + 1
    })
    const result = []
    for (let d = 1; d <= lastDay; d++) {
      const dateStr = `${targetYear}-${monthStr}-${String(d).padStart(2, '0')}`
      result.push({ date: dateStr, count: dayCounts[dateStr] || 0 })
    }
    return result
  }

  const snapshot = await db
    .collection('orders')
    .where('orderDate', '>=', fromDate)
    .where('orderDate', '<=', toDate)
    .get()

  const dayCounts = {}
  snapshot.docs.forEach((doc) => {
    const order = doc.data()
    if (order.status === ORDER_STATUSES.CANCELLED) return
    const day = order.orderDate
    dayCounts[day] = (dayCounts[day] || 0) + 1
  })

  const result = []
  for (let d = 1; d <= lastDay; d++) {
    const dateStr = `${targetYear}-${monthStr}-${String(d).padStart(2, '0')}`
    result.push({ date: dateStr, count: dayCounts[dateStr] || 0 })
  }

  return result
}
