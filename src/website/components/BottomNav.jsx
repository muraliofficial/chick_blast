import { NavLink } from 'react-router-dom'
import { UtensilsCrossed, ShoppingCart, ClipboardList } from 'lucide-react'
import { useCart } from '../../shared/context/CartContext'

const navItems = [
  { to: '/', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/order-status', icon: ClipboardList, label: 'Status' },
]

export default function BottomNav() {
  const { itemCount } = useCart()

  return (
    <nav className="glass-nav md:hidden">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-extrabold transition-all duration-200 no-underline whitespace-nowrap ${
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
            <Icon size={18} />
            {to === '/cart' && itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white bg-slate-950 border border-white">
                {itemCount}
              </span>
            )}
          </div>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
