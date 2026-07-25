export const CATEGORIES = [
  'Fried Chicken',
  'Momos',
  'Sandwich',
  'Burger',
  'Pizza',
  'Drinks',
  'Fries',
]

export const LABELS = ['Veg', 'Non-Veg']

export const ORDER_STATUSES = {
  NEW: 'new',
  PREPARING: 'preparing',
  PACKED: 'packed',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const STATUS_LABELS = {
  new: 'New Order',
  preparing: 'Preparing',
  packed: 'Packed',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const STATUS_ACTIONS = {
  new: { label: 'Preparing', next: 'preparing' },
  preparing: { label: 'Packed', next: 'packed' },
  packed: { label: 'Delivered', next: 'delivered' },
}

export const PAYMENT_MODES = ['UPI', 'Card', 'Cash', 'Split']

export const SPLIT_PAYMENT_TYPES = ['Cash', 'UPI', 'Card']
