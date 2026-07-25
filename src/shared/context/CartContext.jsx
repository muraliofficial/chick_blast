import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerMobile, setCustomerMobile] = useState('')
  const [lastOrderId, setLastOrderId] = useState(null)

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.itemId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          itemId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          type: product.type || 'item',
          label: product.label || 'Non-Veg',
          imageUrl: product.imageUrl,
        },
      ]
    })
  }, [])

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.itemId !== itemId))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.itemId === itemId ? { ...i, quantity } : i))
      )
    }
  }, [])

  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCustomerName('')
    setCustomerMobile('')
  }, [])

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        customerName,
        customerMobile,
        lastOrderId,
        totalAmount,
        itemCount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        setCustomerName,
        setCustomerMobile,
        setLastOrderId,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
