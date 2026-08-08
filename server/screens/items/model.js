import { getDb, FieldValue } from '../../config/firebase.js'

// In-memory fallback items for development when Firebase credentials are not configured
const memoryItems = [
  // --- Fried Chicken ---
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
    id: 'item-101',
    name: 'Smoky BBQ Wings',
    unit: '6 pcs',
    category: 'Fried Chicken',
    label: 'Non-Veg',
    price: 249,
    description: 'Tender chicken wings tossed in rich, smoky hickory BBQ glaze.',
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-102',
    name: 'Hot & Spicy Fried Drumsticks',
    unit: '3 pcs',
    category: 'Fried Chicken',
    label: 'Non-Veg',
    price: 279,
    description: 'Crispy fried drumsticks coated in extra hot cayenne pepper spice rub.',
    imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-103',
    name: 'Chick Blast Boneless Tenders',
    unit: '5 pcs',
    category: 'Fried Chicken',
    label: 'Non-Veg',
    price: 219,
    description: 'Succulent boneless chicken strips fried to crunchy perfection.',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- Burger ---
  {
    id: 'item-2',
    name: 'Spicy Zinger Burger',
    unit: '1 pc',
    category: 'Burger',
    label: 'Non-Veg',
    price: 149,
    description: 'Crispy chicken patty with spicy mayo, lettuce, and cheese inside a toasted sesame bun.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-401',
    name: 'Double Crunch Monster Burger',
    unit: '1 pc',
    category: 'Burger',
    label: 'Non-Veg',
    price: 229,
    description: 'Double crispy chicken patties layered with extra cheddar cheese and thousand island sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-402',
    name: 'Cheesy Veggie Delight Burger',
    unit: '1 pc',
    category: 'Burger',
    label: 'Veg',
    price: 119,
    description: 'Crispy herb potato patty with pickled jalapenos, fresh lettuce, and melting cheese.',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- Momos ---
  {
    id: 'item-3',
    name: 'Steamed Chicken Momos',
    unit: '6 pcs',
    category: 'Momos',
    label: 'Non-Veg',
    price: 129,
    description: 'Soft steamed dumplings stuffed with juicy minced chicken and Himalayan herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-201',
    name: 'Kurkure Crispy Chicken Momos',
    unit: '6 pcs',
    category: 'Momos',
    label: 'Non-Veg',
    price: 159,
    description: 'Crunchy fried momos coated with a crispy cornflake shell, served with spicy red dip.',
    imageUrl: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-202',
    name: 'Cheese Burst Corn Momos',
    unit: '6 pcs',
    category: 'Momos',
    label: 'Veg',
    price: 149,
    description: 'Steamed momos loaded with oozing mozzarella cheese and sweet corn kernel filling.',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- Sandwich ---
  {
    id: 'item-4',
    name: 'Grilled Club Sandwich',
    unit: '1 pc',
    category: 'Sandwich',
    label: 'Veg',
    price: 119,
    description: 'Triple-decker sandwich loaded with garden fresh veggies, cheese, and herb mayo.',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-301',
    name: 'Crispy Chicken Supreme Sandwich',
    unit: '1 pc',
    category: 'Sandwich',
    label: 'Non-Veg',
    price: 159,
    description: 'Juicy fried chicken breast fillet with melted cheddar and garlic mayonnaise.',
    imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-302',
    name: 'Paneer Tikka Mayo Sandwich',
    unit: '1 pc',
    category: 'Sandwich',
    label: 'Veg',
    price: 139,
    description: 'Tandoori marinated paneer cubes grilled between golden buttered sourdough bread.',
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- Pizza ---
  {
    id: 'item-501',
    name: 'Chick Blast Supreme Pizza',
    unit: '8 inch',
    category: 'Pizza',
    label: 'Non-Veg',
    price: 269,
    description: 'Hand-tossed pizza topped with crunchy fried chicken chunks, bell peppers, and mozzarella.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-502',
    name: 'Classic Margherita Pizza',
    unit: '8 inch',
    category: 'Pizza',
    label: 'Veg',
    price: 179,
    description: 'Rich San Marzano tomato sauce base loaded with 100% real mozzarella cheese.',
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-503',
    name: 'Spicy Paneer Peri Peri Pizza',
    unit: '8 inch',
    category: 'Pizza',
    label: 'Veg',
    price: 219,
    description: 'Peri peri spiced paneer, red paprika, jalapenos, and mozzarella on a crispy golden crust.',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- Fries ---
  {
    id: 'item-5',
    name: 'Peri Peri Loaded Fries',
    unit: '1 plate',
    category: 'Fries',
    label: 'Veg',
    price: 99,
    description: 'Crispy French fries tossed in fiery Peri Peri spice mix served with creamy cheese dip.',
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-701',
    name: 'Cheesy Chicken Loaded Fries',
    unit: '1 plate',
    category: 'Fries',
    label: 'Non-Veg',
    price: 159,
    description: 'Golden fries smothered with crispy chicken bites, liquid cheddar cheese, and herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-702',
    name: 'Classic Salted Crinkle Fries',
    unit: '1 plate',
    category: 'Fries',
    label: 'Veg',
    price: 79,
    description: 'Crispy crinkle-cut potato fries lightly seasoned with sea salt.',
    imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- Drinks ---
  {
    id: 'item-6',
    name: 'Chilled Mango Blast Soda',
    unit: '300 ml',
    category: 'Drinks',
    label: 'Veg',
    price: 69,
    description: 'Refreshing fizzy mango beverage infused with a splash of fresh lime.',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-601',
    name: 'Iced Cold Coffee with Ice Cream',
    unit: '350 ml',
    category: 'Drinks',
    label: 'Veg',
    price: 99,
    description: 'Rich espresso coffee blended with chilled milk and topped with a scoop of vanilla ice cream.',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-602',
    name: 'Fresh Lemon Mint Mojito',
    unit: '350 ml',
    category: 'Drinks',
    label: 'Veg',
    price: 79,
    description: 'Zesty mocktail with crushed mint leaves, key lime juice, and sparkling soda.',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60',
    type: 'item',
    comboItemIds: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- Combos ---
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

// In-memory cache for items collection
let cachedItems = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60 * 1000 // 1 minute TTL fallback, auto-invalidated on write

export function invalidateItemsCache() {
  cachedItems = null
  cacheTimestamp = 0
}

async function getAllItemsCached(db) {
  const now = Date.now()
  if (cachedItems && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedItems
  }

  if (!db) {
    cachedItems = [...memoryItems]
    cacheTimestamp = now
    return cachedItems
  }

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

  cachedItems = snapshot.docs.map(serializeDoc)
  cacheTimestamp = now
  return cachedItems
}

export async function getNextItemId(db) {
  if (db) {
    return db.collection('items').doc().id
  }
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `itm_${timestamp}_${randomStr}`
}

export async function fetchItems({ type, includeInactive } = {}) {
  const db = getDb()
  let items = await getAllItemsCached(db)

  if (type) {
    items = items.filter((i) => i.type === type)
  }
  if (includeInactive !== 'true') {
    items = items.filter((i) => i.isActive !== false)
  }

  return [...items].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
}

export async function fetchAllItemsAdmin() {
  const db = getDb()
  let items = await getAllItemsCached(db)
  return [...items].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
}

export async function createItemInDb(itemData) {
  const { name, unit, category, label, price, description, imageUrl, type, comboItemIds } = itemData
  const itemType = type || 'item'
  const db = getDb()
  const customId = await getNextItemId(db)
  const isoNow = new Date().toISOString()

  const newItem = {
    id: customId,
    did: customId,
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
    createdAt: isoNow,
    updatedAt: isoNow,
  }

  if (!db) {
    memoryItems.push(newItem)
  } else {
    const docRef = db.collection('items').doc(customId)
    await docRef.set({
      ...newItem,
      createdAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
      updatedAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
    })
  }

  invalidateItemsCache()
  return newItem
}

export async function updateItemInDb(id, updatePayload) {
  const db = getDb()
  const isoNow = new Date().toISOString()

  if (!db) {
    const index = memoryItems.findIndex((i) => i.id === id)
    if (index === -1) return null

    const updates = { ...updatePayload, updatedAt: isoNow }
    delete updates.id
    delete updates.createdAt

    memoryItems[index] = { ...memoryItems[index], ...updates }
    invalidateItemsCache()
    return memoryItems[index]
  }

  const docRef = db.collection('items').doc(id)
  const updates = {
    ...updatePayload,
    updatedAt: FieldValue?.serverTimestamp ? FieldValue.serverTimestamp() : new Date(),
  }
  delete updates.id
  delete updates.createdAt

  await docRef.update(updates)
  invalidateItemsCache()
  return { id, ...updatePayload, updatedAt: isoNow }
}

export async function deleteItemInDb(id) {
  const db = getDb()

  if (!db) {
    const index = memoryItems.findIndex((i) => i.id === id)
    if (index === -1) return false
    memoryItems.splice(index, 1)
    invalidateItemsCache()
    return true
  }

  const docRef = db.collection('items').doc(id)
  await docRef.delete()
  invalidateItemsCache()
  return true
}
