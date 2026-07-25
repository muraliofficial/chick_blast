import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, User, Phone, ShoppingBag, ArrowLeft, Receipt } from 'lucide-react'
import { useCart } from '../../shared/context/CartContext'
import { ordersApi } from '../../shared/api'
import SwipeToConfirm from '../../shared/components/SwipeToConfirm'
import FssaiBadge from '../../shared/components/FssaiBadge'

export default function Cart() {
  const navigate = useNavigate()
  const {
    items,
    customerName,
    customerMobile,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
    setCustomerName,
    setCustomerMobile,
    setLastOrderId,
  } = useCart()

  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const canPlace =
    items.length > 0 &&
    customerName.trim() &&
    customerMobile.trim() &&
    customerMobile.length >= 10

  const handlePlaceOrder = async () => {
    if (!canPlace || placing) return
    setPlacing(true)
    setError('')

    try {
      const order = await ordersApi.create({
        customerName: customerName.trim(),
        customerMobile: customerMobile.trim(),
        items: items.map(({ itemId, name, price, quantity, type }) => ({
          itemId,
          name,
          price,
          quantity,
          type,
        })),
        totalAmount,
      })

      setLastOrderId(order.id)
      clearCart()
      navigate('/order-status', { state: { orderId: order.id } })
    } catch (err) {
      setError(err.message)
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm mb-6">Looks like you haven't added any items yet.</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary !px-6 !py-3 !rounded-2xl shadow-lg shadow-orange-500/20"
        >
          <ArrowLeft size={18} /> Explore Menu
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 m-0">Your Order</h2>
          <p className="text-xs text-gray-500 mt-1">Review items & enter contact info</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-500 hover:text-red-700 cursor-pointer border-none bg-transparent"
        >
          Clear All
        </button>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.itemId}
            className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm hover:shadow transition-all flex items-center gap-3"
          >
            <FssaiBadge isVeg={item.label === 'Veg'} size={18} />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-gray-900 truncate m-0">{item.name}</h4>
              <p className="text-xs text-orange-500 font-semibold m-0 mt-0.5">₹{item.price} each</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                  className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-gray-700 border-none cursor-pointer hover:bg-gray-200"
                >
                  <Minus size={12} />
                </button>
                <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                  className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-gray-700 border-none cursor-pointer hover:bg-gray-200"
                >
                  <Plus size={12} />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.itemId)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border-none cursor-pointer bg-transparent"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <span className="font-black text-sm text-gray-900 w-16 text-right">
              ₹{(item.price * item.quantity).toFixed(0)}
            </span>
          </div>
        ))}
      </div>

      {/* Bill Details Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Receipt size={18} className="text-orange-500" />
          <h3 className="text-sm font-bold text-gray-900 m-0">Bill Details</h3>
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>Items Subtotal</span>
          <span className="font-semibold text-gray-800">₹{totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>Delivery & Packaging</span>
          <span className="font-semibold text-emerald-600 uppercase">FREE</span>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="font-bold text-base text-gray-900">Grand Total</span>
          <span className="font-black text-xl text-orange-500">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Customer Info Form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 m-0">Customer Details</h3>

        <div className="relative">
          <User size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Your Full Name"
            value={customerName}
            onChange={(e) => {
              setError('')
              setCustomerName(e.target.value)
            }}
            className="input-field !pl-10"
          />
        </div>

        <div className="relative">
          <Phone size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="tel"
            placeholder="10-digit Mobile Number"
            value={customerMobile}
            onChange={(e) => {
              setError('')
              setCustomerMobile(e.target.value.replace(/\D/g, ''))
            }}
            className="input-field !pl-10"
            maxLength={10}
          />
        </div>
      </div>

      {!canPlace && (
        <p className="text-xs text-center text-orange-600 font-medium">
          {!customerName.trim()
            ? '⚠️ Please enter your name to complete order'
            : customerMobile.length < 10
            ? '⚠️ Please enter a valid 10-digit mobile number'
            : ''}
        </p>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center border border-red-100">
          {error}
        </div>
      )}

      {/* Swipe to Confirm Footer */}
      <div className="pt-2">
        <SwipeToConfirm
          onConfirm={handlePlaceOrder}
          disabled={!canPlace || placing}
          label={placing ? 'Placing Order...' : 'Swipe to Place Order'}
        />
      </div>
    </div>
  )
}
