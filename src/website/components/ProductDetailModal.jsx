import { useState, useEffect } from 'react'
import { X, Minus, Plus, Sparkles, CheckCircle2 } from 'lucide-react'
import FssaiBadge from '../../shared/components/FssaiBadge'
import { useCart } from '../../shared/context/CartContext'

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const { items, addItem, updateQuantity } = useCart()

  const [shouldRender, setShouldRender] = useState(false)
  const [active, setActive] = useState(false)

  // Handle smooth Open and Close animation sequence + body scroll lock
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      document.body.style.overflow = 'hidden'
      const timer = setTimeout(() => setActive(true), 20)
      return () => clearTimeout(timer)
    } else {
      setActive(false)
      const timer = setTimeout(() => {
        setShouldRender(false)
        document.body.style.overflow = ''
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    setActive(false)
    setTimeout(() => {
      onClose()
    }, 250)
  }

  if (!shouldRender || !product) return null

  const cartItem = items.find((i) => i.itemId === product.id)
  const quantity = cartItem?.quantity || 0
  const isVeg = product.label === 'Veg'

  const handleAdd = (e) => {
    e.stopPropagation()
    addItem(product)
  }

  const handleIncrement = (e) => {
    e.stopPropagation()
    updateQuantity(product.id, quantity + 1)
  }

  const handleDecrement = (e) => {
    e.stopPropagation()
    updateQuantity(product.id, quantity - 1)
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ease-out ${
        active
          ? 'bg-slate-950/60 backdrop-blur-md opacity-100'
          : 'bg-slate-950/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col border border-gray-100 transition-all duration-300 cubic-bezier(0.32,0.72,0,1) transform ${
          active
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-full sm:translate-y-8 sm:scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator / Close Top Bar */}
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-2.5 sm:hidden shrink-0 cursor-pointer" onClick={handleClose} />

        {/* Product Image Header */}
        <div className="relative aspect-video w-full bg-gray-100 shrink-0 overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-orange-50/50">🍗</div>
          )}
          
          {/* Gradient overlay at image bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Category Tag */}
          <div className="absolute bottom-3 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500 text-white shadow-md">
              {product.category}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors border-none cursor-pointer flex items-center justify-center backdrop-blur-md shadow-md z-10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Detail Body inside Modal */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-4 flex-1">
          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FssaiBadge isVeg={isVeg} size={16} />
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 m-0 leading-snug">
                  {product.name}
                </h2>
              </div>
              <p className="text-xs text-gray-400 font-semibold m-0 uppercase tracking-wider">
                {isVeg ? 'Vegetarian Dish' : 'Non-Vegetarian Dish'}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-orange-500 block leading-none">
                ₹{product.price}
              </span>
              {product.unit && (
                <span className="text-xs text-gray-400 font-medium uppercase mt-1 block">{product.unit}</span>
              )}
            </div>
          </div>

          {/* Quick Highlights */}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 py-2 border-y border-gray-100">
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 size={15} /> Freshly Prepared
            </span>
            <span className="flex items-center gap-1 text-orange-600">
              <Sparkles size={15} /> Signature Spices
            </span>
          </div>

          {/* Description */}
          <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/70">
            <h4 className="text-xs font-bold uppercase text-amber-800 tracking-wider mb-1 m-0">About Dish</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
              {product.description || 'Prepared fresh to order with crispy coating, signature spices, and delicious taste.'}
            </p>
          </div>
        </div>

        {/* Footer Cart Action Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-100 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-gray-400 font-medium block">Total Price</span>
            <span className="text-xl font-black text-gray-900">
              ₹{(product.price * (quantity || 1)).toFixed(0)}
            </span>
          </div>

          {quantity > 0 ? (
            <div className="flex items-center gap-2.5 bg-white border-2 border-orange-500 rounded-2xl p-1 shadow-md">
              <button
                onClick={handleDecrement}
                className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 active:scale-90 flex items-center justify-center border-none cursor-pointer transition-all"
              >
                <Minus size={18} className="stroke-[3]" />
              </button>
              <span className="w-8 text-center font-black text-lg text-gray-900 select-none">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 active:scale-90 flex items-center justify-center border-none cursor-pointer transition-all"
              >
                <Plus size={18} className="stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="btn-primary !px-7 !py-3 !rounded-2xl !text-sm font-black tracking-wide uppercase shadow-lg shadow-orange-500/25 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Plus size={18} className="stroke-[3]" /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
