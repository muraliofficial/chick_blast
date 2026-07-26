import { Outlet, Link, NavLink } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { useCart } from '../../shared/context/CartContext'
import logoImg from '../../assets/logo.png'
import '../../styles/website.css'

export default function WebsiteLayout() {
  const { itemCount, totalAmount } = useCart()

  return (
    <div className="website-layout">
      {/* Top Header */}
      <header className="website-header">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <img
              src={logoImg}
              alt="Chick Blast Logo"
              className="h-10 sm:h-11 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-gray-900 m-0 leading-tight">
                Chick Blast
              </h1>
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider m-0 hidden sm:block">
                Crispy & Delicious
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-semibold no-underline transition-colors ${
                  isActive ? 'text-orange-500 font-bold' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Menu
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `text-sm font-semibold no-underline transition-colors ${
                  isActive ? 'text-orange-500 font-bold' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Cart ({itemCount})
            </NavLink>
            <NavLink
              to="/order-status"
              className={({ isActive }) =>
                `text-sm font-semibold no-underline transition-colors ${
                  isActive ? 'text-orange-500 font-bold' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Track Order
            </NavLink>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm no-underline shadow-md shadow-orange-500/20 transition-transform active:scale-95"
            >
              <div className="relative">
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-slate-950 text-orange-400 text-[10px] font-black flex items-center justify-center border border-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">₹{totalAmount.toFixed(2)}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="website-main">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
