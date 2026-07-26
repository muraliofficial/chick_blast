import { getDb, FieldValue } from '../../config/firebase.js'

// In-memory fallback items for development when Firebase credentials are not configured
const memoryItems = [
  {
    id: 'item-1',
    name: 'Classic Crispy Fried Chicken',
    unit: '2 pcs',
    category: 'Fried Chicken',
    label: 'Non-Veg',
    price: 199,
    description: 'Golden, crispy, and juicy fried chicken pieces marinated in signature spices.',
    imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-2',
    name: 'Spicy Zinger Burger',
    unit: '1 pc',
    category: 'Burger',
    label: 'Non-Veg',
    price: 149,
    description: 'Crispy chicken patty with spicy mayo, lettuce, and cheese inside a toasted bun.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-3',
    name: 'Steamed Chicken Momos',
    unit: '6 pcs',
    category: 'Momos',
    label: 'Non-Veg',
    price: 129,
    description: 'Soft steamed dumplings stuffed with juicy minced chicken and herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-4',
    name: 'Grilled Club Sandwich',
    unit: '1 pc',
    category: 'Sandwich',
    label: 'Veg',
    price: 119,
    description: 'Triple-decker sandwich loaded with fresh veggies, cheese, and special sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-5',
    name: 'Peri Peri Loaded Fries',
    unit: '1 plate',
    category: 'Fries',
    label: 'Veg',
    price: 99,
    description: 'Crispy French fries tossed in fiery Peri Peri spice mix with cheese dip.',
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-6',
    name: 'Chilled Mango Blast Soda',
    unit: '300 ml',
    category: 'Drinks',
    label: 'Veg',
    price: 69,
    description: 'Refreshing fizzy mango beverage with a splash of lime.',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'combo-1',
    name: 'Chicken Blast Solo Combo',
    unit: 'combo',
    category: 'Fried Chicken',
    label: 'Non-Veg',
    price: 299,
    description: '2 pcs Fried Chicken + Peri Peri Fries + Chilled Mango Soda',
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&auto=format&fit=crop&q=60',
    type: 'combo',
    comboItemIds: ['item-1', 'item-5', 'item-6'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function serializeDoc(doc) {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? (typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString()),
  }
}

export async function getNextItemId(db, itemType = 'item') {
  const prefix = itemType === 'combo' ? 'combo-' : 'item-'
  if (!db) {
    const matches = memoryItems
      .filter((i) => i.id && i.id.startsWith(prefix))
      .map((i) => parseInt(i.id.replace(prefix, ''), 10))
      .filter((n) => !isNaN(n))
    const max = matches.length > 0 ? Math.max(...matches) : 0
    return `${prefix}${max + 1}`
  }
  const snapshot = await db.collection('items').get()
  const matches = snapshot.docs
    .map((doc) => doc.id)
    .filter((id) => id.startsWith(prefix))
    .map((id) => parseInt(id.replace(prefix, ''), 10))
    .filter((n) => !isNaN(n))
  const max = matches.length > 0 ? Math.max(...matches) : 0
  return `${prefix}${max + 1}`
}

export async function fetchItems({ type, includeInactive } = {}) {
  const db = getDb()
  let items = []

  if (!db) {
    items = [...memoryItems]
  } else {
    let snapshot = await db.collection('items').get()
    if (snapshot.empty) {
      const batch = db.batch()
      memoryItems.forEach((item) => {
        const docRef = db.collection('items').doc(item.id)
        batch.set(docRef, {
          ...item,
          createdAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
          updatedAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
        })
      })
      await batch.commit()
      snapshot = await db.collection('items').get()
    }
    items = snapshot.docs.map(serializeDoc)
  }

  if (type) {
    items = items.filter((i) => i.type === type)
  }
  if (includeInactive !== 'true') {
    items = items.filter((i) => i.isActive !== false)
  }

  items.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  return items
}

export async function fetchAllItemsAdmin() {
  const db = getDb()
  let items = []

  if (!db) {
    items = [...memoryItems]
  } else {
    let snapshot = await db.collection('items').get()
    if (snapshot.empty) {
      const batch = db.batch()
      memoryItems.forEach((item) => {
        const docRef = db.collection('items').doc(item.id)
        batch.set(docRef, {
          ...item,
          createdAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
          updatedAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
        })
      })
      await batch.commit()
      snapshot = await db.collection('items').get()
    }
    items = snapshot.docs.map(serializeDoc)
  }

  items.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  return items
}

export async function createItemInDb(itemData) {
  const { name, unit, category, label, price, description, imageUrl, type, comboItemIds } = itemData
  const itemType = type || 'item'
  const db = getDb()
  const customId = await getNextItemId(db, itemType)

  if (!db) {
    const newItem = {
      id: customId,
      name,
      unit: unit || 'pc',
      category: category || 'Fried Chicken',
      label: label || 'Non-Veg',
      price: Number(price),
      description: description || '',
      imageUrl: imageUrl || '',
      type: itemType,
      comboItemIds: comboItemIds || [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    memoryItems.push(newItem)
    return newItem
  }

  const item = {
    name,
    unit: unit || 'pc',
    category: category || 'Fried Chicken',
    label: label || 'Non-Veg',
    price: Number(price),
    description: description || '',
    imageUrl: imageUrl || '',
    type: itemType,
    comboItemIds: comboItemIds || [],
    isActive: true,
    createdAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
    updatedAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
  }

  const docRef = db.collection('items').doc(customId)
  await docRef.set(item)
  const created = await docRef.get()
  return serializeDoc(created)
}

export async function updateItemInDb(id, updatePayload) {
  const db = getDb()

  if (!db) {
    const index = memoryItems.findIndex((i) => i.id === id)
    if (index === -1) return null

    const updates = { ...updatePayload, updatedAt: new Date().toISOString() }
    delete updates.id
    delete updates.createdAt

    memoryItems[index] = { ...memoryItems[index], ...updates }
    return memoryItems[index]
  }

  const docRef = db.collection('items').doc(id)
  const doc = await docRef.get()
  if (!doc.exists) return null

  const updates = {
    ...updatePayload,
    updatedAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
  }
  delete updates.id
  delete updates.createdAt

  await docRef.update(updates)
  const updated = await docRef.get()
  return serializeDoc(updated)
}

export async function deleteItemInDb(id) {
  const db = getDb()

  if (!db) {
    const index = memoryItems.findIndex((i) => i.id === id)
    if (index === -1) return false
    memoryItems.splice(index, 1)
    return true
  }

  const docRef = db.collection('items').doc(id)
  const doc = await docRef.get()
  if (!doc.exists) return false

  await docRef.delete()
  return true
}
