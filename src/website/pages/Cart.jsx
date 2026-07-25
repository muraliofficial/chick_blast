import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, User, Phone, ArrowLeft, Receipt, CheckCircle2, AlertCircle } from 'lucide-react'
import { useCart } from '../../shared/context/CartContext'
import { ordersApi } from '../../shared/api'
import SwipeToConfirm from '../../shared/components/SwipeToConfirm'
import FssaiBadge from '../../shared/components/FssaiBadge'
import logoImg from '../../assets/logo.png'

export default function Cart() {
  const navigate = useNavigate()
  const {
    items,
    customerName,
    customerMobile,
    totalAmount,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
    setCustomerName,
    setCustomerMobile,
    setLastOrderId,
  } = useCart()

  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const isNameValid = customerName.trim().length > 0
  const isMobileValid = customerMobile.trim().length === 10

  const canPlace = items.length > 0 && isNameValid && isMobileValid

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
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-4">
        <div className="w-24 h-24 rounded-full bg-orange-50 mx-auto flex items-center justify-center border border-orange-100 shadow-inner">
          <img
            src={logoImg}
            alt="Chick Blast Logo"
            className="h-16 w-auto object-contain drop-shadow-md"
          />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 m-0">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-gray-500 m-0">Looks like you haven't added any crispy items yet.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-primary !px-7 !py-3.5 !rounded-2xl text-sm font-black shadow-lg shadow-orange-500/25 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={18} /> Explore Menu
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Chick Blast" className="h-9 w-auto object-contain" />
          <div>
            <h2 className="text-lg font-black text-gray-900 m-0 leading-tight">Review Order</h2>
            <p className="text-xs text-gray-400 font-medium m-0">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
          </div>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      {/* Selected Dishes Card Sheet */}
      <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              🛒
            </div>
            <h3 className="text-sm font-black text-gray-900 m-0">Selected Items ({items.length})</h3>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-extrabold text-orange-500 hover:text-orange-600 border-none bg-transparent cursor-pointer flex items-center gap-1"
          >
            <Plus size={14} className="stroke-[3]" /> Add More
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.itemId} className="py-3 first:pt-1 last:pb-0 flex items-center justify-between gap-3">
              {/* Dish Thumbnail & Name */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-13 h-13 rounded-2xl bg-orange-50/50 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🍗</span>
                  )}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <FssaiBadge isVeg={item.label === 'Veg'} size={13} />
                    <h4 className="font-bold text-sm text-gray-900 truncate m-0">{item.name}</h4>
                  </div>
                  <p className="text-xs font-black text-orange-600 m-0">
                    ₹{item.price}{' '}
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">x {item.quantity}</span>
                  </p>
                </div>
              </div>

              {/* Quantity Stepper & Item Total */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="flex items-center gap-1 bg-white border border-orange-500 rounded-xl p-0.5 shadow-xs">
                  <button
                    onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                    className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 active:scale-90 flex items-center justify-center border-none cursor-pointer transition-all"
                  >
                    <Minus size={12} className="stroke-[3]" />
                  </button>
                  <span className="w-5 text-center font-black text-xs text-gray-900 select-none">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                    className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 active:scale-90 flex items-center justify-center border-none cursor-pointer transition-all"
                  >
                    <Plus size={12} className="stroke-[3]" />
                  </button>
                </div>

                <span className="font-black text-sm text-gray-900 w-14 text-right">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Info Form Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 m-0">Contact Information</h3>
          {canPlace && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 size={13} /> Ready to Order
            </span>
          )}
        </div>

        {/* Customer Name */}
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
            className="input-field !pl-10 text-sm font-medium"
          />
          {isNameValid && (
            <CheckCircle2 size={16} className="absolute right-3.5 top-3.5 text-emerald-500" />
          )}
        </div>

        {/* Mobile Number */}
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
            className="input-field !pl-10 text-sm font-medium"
            maxLength={10}
          />
          {isMobileValid && (
            <CheckCircle2 size={16} className="absolute right-3.5 top-3.5 text-emerald-500" />
          )}
        </div>
      </div>

      {/* Bill Details Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Receipt size={18} className="text-orange-500" />
          <h3 className="text-sm font-bold text-gray-900 m-0">Bill Summary</h3>
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>Items Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-semibold text-gray-800">₹{totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>Packaging & Service Fee</span>
          <span className="font-bold text-emerald-600 uppercase">FREE</span>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="font-bold text-base text-gray-900">Grand Total</span>
          <span className="font-black text-2xl text-orange-500">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Validation Banner if missing info */}
      {!canPlace && (
        <div className="flex items-center gap-2 p-3 bg-orange-50/80 text-orange-700 rounded-xl text-xs font-semibold border border-orange-200/80">
          <AlertCircle size={16} className="shrink-0" />
          <span>
            {!customerName.trim()
              ? 'Please enter your name to complete your order'
              : customerMobile.length < 10
              ? 'Please enter a valid 10-digit mobile number'
              : ''}
          </span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center border border-red-100">
          {error}
        </div>
      )}

      {/* Swipe to Confirm Action Bar */}
      <div className="pt-1">
        <SwipeToConfirm
          onConfirm={handlePlaceOrder}
          disabled={!canPlace || placing}
          label={placing ? 'Placing Order...' : 'Swipe to Place Order'}
        />
      </div>
    </div>
  )
}
