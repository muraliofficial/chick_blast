import { useState, useEffect, useMemo } from 'react'
import { Plus, Minus, Search, X, ShoppingBag, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { itemsApi } from '../../shared/api'
import { CATEGORIES } from '../../shared/constants'
import { useCart } from '../../shared/context/CartContext'
import FssaiBadge from '../../shared/components/FssaiBadge'
import Loader from '../../shared/components/Loader'
import ProductDetailModal from '../components/ProductDetailModal'
import heroImg from '../../assets/hero.png'

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
      className="card group cursor-pointer hover:border-orange-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between bg-white rounded-2xl overflow-hidden border border-gray-100"
    >
      <div>
        {/* Clean Food Image */}
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-orange-50/50">🍗</div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-3.5 space-y-1">
          {/* Veg/Non-Veg Badge & Dish Title */}
          <div className="flex items-center gap-2">
            <FssaiBadge isVeg={isVeg} size={15} />
            <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug m-0 truncate group-hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
          </div>

          <p className="text-[11px] text-gray-400 font-medium m-0 uppercase tracking-wider">
            {product.category}
          </p>

          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed m-0 pt-0.5">
            {product.description || 'Prepared fresh with high quality ingredients.'}
          </p>
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className="p-3 sm:p-3.5 pt-0 flex items-center justify-between gap-2 mt-auto">
        <div>
          <span className="font-black text-base sm:text-lg text-gray-900 block leading-none">
            ₹{product.price}
          </span>
          {product.unit && (
            <span className="text-[10px] text-gray-400 font-semibold uppercase">{product.unit}</span>
          )}
        </div>

        {/* Quantity Stepper / ADD Button */}
        {quantity > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between gap-1 bg-white border border-orange-500 rounded-xl p-0.5 shadow-xs shrink-0"
          >
            <button
              onClick={handleDecrement}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 active:scale-90 flex items-center justify-center border-none cursor-pointer transition-all"
            >
              <Minus size={13} className="stroke-[3]" />
            </button>
            <span className="font-black text-xs sm:text-sm px-1.5 text-gray-900 select-none">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 active:scale-90 flex items-center justify-center border-none cursor-pointer transition-all"
            >
              <Plus size={13} className="stroke-[3]" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-black text-xs tracking-wider text-orange-600 bg-white border border-orange-500 hover:bg-orange-500 hover:text-white shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 active:scale-95 shrink-0"
          >
            <Plus size={13} className="stroke-[3]" />
            <span>ADD</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('All')
  const [foodType, setFoodType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const { itemCount, totalAmount } = useCart()

  useEffect(() => {
    itemsApi
      .getAll()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = category === 'All' || p.category === category
      const matchesFoodType = foodType === 'All' || p.label === foodType
      return matchesSearch && matchesCategory && matchesFoodType
    })
  }, [products, category, foodType, searchQuery])

  if (loading) {
    return <Loader fullScreen={false} text="Loading Menu..." subtext="Fetching delicious Chick Blast items" />
  }

  return (
    <div className="space-y-5 pb-16">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 text-white p-5 sm:p-7 shadow-lg border border-white/10">
        <div className="relative z-10 max-w-xl space-y-2.5">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight m-0">
            Taste the Crispy Perfection
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium m-0 max-w-md">
            Order fresh fried chicken, momos, burgers, pizzas, and combos directly from Chick Blast!
          </p>

          {/* Integrated Search Bar */}
          <div className="relative pt-1 max-w-md">
            <Search size={17} className="absolute left-3.5 top-[calc(50%+2px)] -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white text-gray-900 placeholder-gray-400 rounded-xl text-sm font-medium border-none shadow-md outline-none focus:ring-2 focus:ring-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-[calc(50%+2px)] -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        <img
          src={heroImg}
          alt="Hero"
          className="absolute right-0 bottom-0 top-0 h-full w-1/2 object-cover opacity-20 pointer-events-none hidden md:block mix-blend-overlay"
        />
      </div>

      {/* Simple & Clean Category & Diet Filter Bar */}
      <div className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Scroll Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0">
            <button
              onClick={() => setCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border cursor-pointer transition-all ${
                category === 'All'
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              All
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border cursor-pointer transition-all ${
                  category === cat
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Simple Diet Filter Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl flex-shrink-0 self-start sm:self-auto border border-gray-200/60">
            <button
              onClick={() => setFoodType('All')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                foodType === 'All'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 bg-transparent'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFoodType('Veg')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                foodType === 'Veg'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-700 bg-transparent'
              }`}
            >
              <FssaiBadge isVeg={true} size={12} />
              <span>Veg</span>
            </button>
            <button
              onClick={() => setFoodType('Non-Veg')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                foodType === 'Non-Veg'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-red-700 bg-transparent'
              }`}
            >
              <FssaiBadge isVeg={false} size={12} />
              <span>Non-Veg</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product List Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl text-center py-16 px-4 shadow-sm space-y-2">
          <ShoppingBag size={44} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-900 m-0">No items found</h3>
          <p className="text-xs text-gray-400 m-0">Try searching for another dish or change filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {/* Floating Bottom Cart Bar (Mobile only, desktop uses top header cart) */}
      {itemCount > 0 && (
        <div className="fixed bottom-20 left-4 right-4 md:hidden z-40 animate-in slide-in-from-bottom duration-300">
          <Link
            to="/cart"
            className="flex items-center justify-between p-3.5 px-5 rounded-2xl bg-gradient-to-r from-slate-950 to-orange-950 text-white shadow-2xl border border-orange-500/40 no-underline"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shadow-md">
                {itemCount}
              </div>
              <div>
                <p className="text-xs text-orange-300 font-bold uppercase tracking-wider m-0">Cart Subtotal</p>
                <p className="text-base font-black text-white m-0">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-400 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
              <span>View Cart</span>
              <ChevronRight size={16} />
            </div>
          </Link>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
