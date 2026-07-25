import { useState, useEffect } from 'react'
import { Plus, Minus } from 'lucide-react'
import { itemsApi } from '../../shared/api'
import { CATEGORIES } from '../../shared/constants'
import { useCart } from '../../shared/context/CartContext'
import FssaiBadge from '../../shared/components/FssaiBadge'
import ProductDetailModal from '../components/ProductDetailModal'

function ProductCard({ product, onSelect }) {
  const { items, addItem, updateQuantity } = useCart()
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
      onClick={() => onSelect(product)}
      className="card group cursor-pointer hover:border-orange-200 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🍗</div>
          )}
          <div className="absolute top-2.5 left-2.5">
            <FssaiBadge isVeg={isVeg} size={18} />
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-bold text-sm text-gray-900 leading-snug mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
        </div>
      </div>

      <div className="p-3 pt-0 flex items-center justify-between gap-2 mt-auto">
        <span className="font-black text-base text-orange-500">
          ₹{product.price}
        </span>

        {quantity > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 bg-orange-500 text-white rounded-xl px-2 py-1 shadow-md shadow-orange-500/20"
          >
            <button
              onClick={handleDecrement}
              className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center border-none cursor-pointer text-white transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="w-5 text-center font-bold text-xs">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center border-none cursor-pointer text-white transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="btn-primary !px-3 !py-1.5 !text-xs !rounded-xl shadow-sm"
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>
    </div>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    itemsApi
      .getAll()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    category === 'All'
      ? products
      : products.filter((p) => p.category === category)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-gray-400">Loading menu...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="category-filter">
        <button
          className={`category-pill ${category === 'All' ? 'active' : ''}`}
          onClick={() => setCategory('All')}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🍽️</p>
          <p>No items available in this category</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
