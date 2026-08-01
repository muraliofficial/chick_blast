import { useState, useEffect, useMemo } from 'react'
import { Plus, Minus, Search, X, ShoppingBag, ChevronRight, RotateCcw, ChevronDown, ChevronUp, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { itemsApi } from '../../shared/api'
import { CATEGORIES } from '../../shared/constants'
import { useCart } from '../../shared/context/CartContext'
import FssaiBadge from '../../shared/components/FssaiBadge'
import Loader from '../../shared/components/Loader'
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
      className="group cursor-pointer py-3.5 sm:py-4 px-2 sm:px-3 flex items-start justify-between gap-3 sm:gap-4 border-b border-gray-100/90 last:border-b-0 hover:bg-orange-50/20 transition-all duration-200 rounded-2xl relative"
    >
      {/* Left Column: Food Details */}
      <div className="space-y-1 flex-1 min-w-0 pr-1 sm:pr-2">
        <div className="flex items-center gap-1.5">
          <FssaiBadge isVeg={isVeg} size={14} />
          <span className={`text-[10px] font-black uppercase tracking-wider ${isVeg ? 'text-emerald-600' : 'text-red-600'}`}>
            {product.label || (isVeg ? 'Veg' : 'Non-Veg')}
          </span>
          {product.category && (
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md uppercase">
              {product.category}
            </span>
          )}
        </div>

        <h3 className="font-extrabold text-sm sm:text-base text-gray-900 leading-snug m-0 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-1 pt-0.5">
          <span className="font-black text-sm sm:text-base text-gray-900">
            ₹{product.price}
          </span>
          {product.unit && (
            <span className="text-[10px] text-gray-400 font-semibold uppercase">({product.unit})</span>
          )}
        </div>

        <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed m-0 pt-0.5 font-medium">
          {product.description || 'Prepared fresh with high quality ingredients.'}
        </p>
      </div>

      {/* Right Column: Food Image & Overlapping ADD Button */}
      <div className="relative shrink-0 pb-3">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50/80 to-amber-50/80 border border-gray-200/70 shadow-2xs relative group-hover:shadow-xs transition-shadow">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🍗</div>
          )}
        </div>

        {/* Swiggy-Style Overlapping ADD / Stepper Button */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-10 shrink-0">
          {quantity > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between gap-1 bg-white border-2 border-emerald-600 text-emerald-700 rounded-xl px-1 py-0.5 shadow-md shadow-emerald-500/10 min-w-[86px]"
            >
              <button
                onClick={handleDecrement}
                className="w-5 h-5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 active:scale-90 flex items-center justify-center border-none cursor-pointer transition-all"
              >
                <Minus size={11} className="stroke-[3]" />
              </button>
              <span className="font-black text-xs px-1 text-emerald-800 select-none">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-5 h-5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white active:scale-90 flex items-center justify-center border-none cursor-pointer transition-all shadow-2xs"
              >
                <Plus size={11} className="stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="px-4 py-1.5 rounded-xl font-black text-xs tracking-wider text-emerald-600 bg-white border-2 border-emerald-600 hover:bg-emerald-50 shadow-md shadow-emerald-500/10 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 active:scale-95 border-none min-w-[80px]"
            >
              <span>ADD</span>
            </button>
          )}
        </div>
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
  const [collapsedCategories, setCollapsedCategories] = useState({})
  const [showMenuDrawer, setShowMenuDrawer] = useState(false)

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

  // Group products by category
  const groupedProducts = useMemo(() => {
    const groups = {}
    filtered.forEach((product) => {
      const cat = product.category || 'Others'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(product)
    })
    return groups
  }, [filtered])

  const toggleCategory = (cat) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }))
  }

  const scrollToCategory = (catName) => {
    setCategory(catName)
    setShowMenuDrawer(false)
    setCollapsedCategories((prev) => ({ ...prev, [catName]: false }))
    const el = document.getElementById(`cat-${catName}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return <Loader fullScreen={false} text="Loading Menu..." subtext="Fetching delicious Chick Blast items" />
  }

  return (
    <div className="space-y-4 pb-24 relative">
      {/* Sticky Glassmorphic Search & Filter Bar */}
      <div className="sticky top-[60px] sm:top-[72px] z-30 -mx-4 px-4 py-3 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-xs space-y-3 transition-all">
        <div className="max-w-6xl mx-auto space-y-2.5">
          {/* Search Input & Reset */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1 min-w-0">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500" />
              <input
                type="text"
                placeholder="Search delicious dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50/90 hover:bg-white focus:bg-white text-gray-900 placeholder-gray-400 rounded-2xl text-sm font-medium border border-gray-200 focus:border-orange-500 shadow-2xs outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-200/60 hover:bg-gray-200 rounded-full p-1 border-none cursor-pointer transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {(category !== 'All' || foodType !== 'All' || searchQuery) && (
              <div className="flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => {
                    setCategory('All')
                    setFoodType('All')
                    setSearchQuery('')
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold cursor-pointer border-none transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Category Horizontal Pills & Diet Toggle Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0 py-0.5">
              <button
                onClick={() => setCategory('All')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border-none ${category === 'All'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'bg-gray-100/80 hover:bg-gray-100 text-gray-700 border border-gray-200/60'
                  }`}
              >
                <span>All</span>
              </button>

              {CATEGORIES.map((cat) => {
                const isActive = category === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border-none ${isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                      : 'bg-gray-100/80 hover:bg-gray-100 text-gray-700 border border-gray-200/60'
                      }`}
                  >
                    <span>{cat}</span>
                  </button>
                )
              })}
            </div>

            {/* Diet Filter Toggle (All, Veg, Non-Veg) */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl flex-shrink-0 self-start sm:self-auto border border-gray-200/60">
              <button
                onClick={() => setFoodType('All')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${foodType === 'All'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 bg-transparent'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFoodType('Veg')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${foodType === 'Veg'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-700 bg-transparent'
                  }`}
              >
                <FssaiBadge isVeg={true} size={12} />
                <span>Veg</span>
              </button>
              <button
                onClick={() => setFoodType('Non-Veg')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${foodType === 'Non-Veg'
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
      </div>

      {/* Grouped Swiggy-Style Category List Container */}
      {Object.keys(groupedProducts).length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl text-center py-16 px-4 shadow-sm space-y-2">
          <ShoppingBag size={44} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-900 m-0">No dishes found</h3>
          <p className="text-xs text-gray-400 m-0">Try searching for another item or clear your filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs divide-y divide-gray-100 overflow-hidden">
          {Object.entries(groupedProducts).map(([catName, catItems]) => {
            const isCollapsed = collapsedCategories[catName]

            return (
              <div key={catName} id={`cat-${catName}`} className="transition-all scroll-mt-36">
                {/* Category Accordion Header */}
                <button
                  onClick={() => toggleCategory(catName)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-white hover:bg-gray-50/80 transition-colors border-none cursor-pointer text-left group"
                >
                  <h3 className="text-sm sm:text-base font-extrabold text-gray-900 m-0 group-hover:text-orange-600 transition-colors">
                    {catName} ({catItems.length})
                  </h3>

                  <div className="text-gray-400 group-hover:text-orange-600 transition-colors">
                    {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                </button>

                {/* Swiggy-Style Item List */}
                {!isCollapsed && (
                  <div className="divide-y divide-gray-100 px-3 sm:px-4 bg-white border-t border-gray-100/60">
                    {catItems.map((product) => (
                      <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Floating Dark Swiggy-Style "MENU / CATEGORIES" Button */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setShowMenuDrawer(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-950/30 border border-slate-700/60 font-black text-xs tracking-wider uppercase cursor-pointer active:scale-95 transition-all"
        >
          <UtensilsCrossed size={16} className="text-amber-400" />
          <span>MENU</span>
        </button>
      </div>

      {/* Floating Quick Category Drawer / Modal */}
      {showMenuDrawer && (
        <div
          className="fixed inset-0 z-[999] bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowMenuDrawer(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[75vh] flex flex-col border border-gray-100 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-orange-500" />
                <h3 className="text-base font-black text-gray-900 m-0">Select Category</h3>
              </div>
              <button
                onClick={() => setShowMenuDrawer(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center border-none cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
              <button
                onClick={() => scrollToCategory('All')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-all border-none cursor-pointer ${category === 'All' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
              >
                <span>All Categories</span>
                <span className="font-extrabold text-gray-400">{filtered.length}</span>
              </button>

              {CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat).length
                const isActive = category === cat
                return (
                  <button
                    key={cat}
                    onClick={() => scrollToCategory(cat)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-all border-none cursor-pointer ${isActive ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                  >
                    <span>{cat}</span>
                    <span className="font-extrabold text-gray-400">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Cart Bar */}
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
