import { X, Minus, Plus } from 'lucide-react'
import FssaiBadge from '../../shared/components/FssaiBadge'
import { useCart } from '../../shared/context/CartContext'

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const { items, addItem, updateQuantity } = useCart()

  if (!isOpen || !product) return null

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
      className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer" onClick={onClose} />

        {/* Product Image Header */}
        <div className="relative aspect-video w-full bg-gray-100 flex-shrink-0 overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🍗</div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors border-none cursor-pointer backdrop-blur-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Detail Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FssaiBadge isVeg={isVeg} size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {product.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">{product.name}</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-orange-500">₹{product.price}</span>
              {product.unit && (
                <p className="text-xs text-gray-400 m-0 font-medium">{product.unit}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1 m-0">Description</h4>
            <p className="text-sm text-gray-600 leading-relaxed m-0">{product.description || 'Prepared fresh with signature spices and high quality ingredients.'}</p>
          </div>
        </div>

        {/* Footer Cart Action */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <span className="text-xs text-gray-400 font-medium block">Total Price</span>
            <span className="text-lg font-black text-gray-900">
              ₹{(product.price * (quantity || 1)).toFixed(0)}
            </span>
          </div>

          {quantity > 0 ? (
            <div className="flex items-center gap-3 bg-orange-500 text-white rounded-2xl px-3 py-2 shadow-lg shadow-orange-500/25">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white border-none cursor-pointer transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-bold text-base">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white border-none cursor-pointer transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="btn-primary !px-8 !py-3 !rounded-2xl !text-base shadow-lg shadow-orange-500/25"
            >
              <Plus size={18} /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
