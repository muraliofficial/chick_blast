import { NavLink } from 'react-router-dom'
import { UtensilsCrossed, ShoppingCart, ClipboardList, User } from 'lucide-react'
import { useCart } from '../../shared/context/CartContext'
import { useCustomer } from '../../shared/context/CustomerContext'

const navItems = [
  { to: '/', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/order-status', icon: ClipboardList, label: 'Status' },
]

export default function BottomNav() {
  const { itemCount } = useCart()
  const { customer, isLoggedIn, openAuthModal, openAccountModal } = useCustomer()

  return (
    <nav className="glass-nav md:hidden">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition-all duration-200 no-underline whitespace-nowrap ${
              isActive
                ? 'text-white shadow-md scale-[1.02]'
                : 'text-gray-500 hover:text-gray-900'
            }`
          }
          style={({ isActive }) =>
            isActive
              ? { background: 'linear-gradient(135deg, var(--color-primary), #ea580c)' }
              : {}
          }
        >
          <div className="relative flex items-center justify-center">
            <Icon size={17} />
            {to === '/cart' && itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white bg-slate-950 border border-white">
                {itemCount}
              </span>
            )}
          </div>
          <span>{label}</span>
        </NavLink>
      ))}

      {/* Account Profile Action Button */}
      <button
        type="button"
        onClick={() => (isLoggedIn ? openAccountModal() : openAuthModal())}
        className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold text-gray-500 hover:text-gray-900 border-none bg-transparent cursor-pointer whitespace-nowrap transition-colors"
      >
        <div className="w-5 h-5 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-black">
          {isLoggedIn && customer?.Name ? customer.Name.charAt(0).toUpperCase() : <User size={13} />}
        </div>
        <span>{isLoggedIn ? 'Account' : 'Login'}</span>
      </button>
    </nav>
  )
}
