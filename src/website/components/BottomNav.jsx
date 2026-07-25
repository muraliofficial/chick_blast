import { NavLink } from 'react-router-dom'
import { ShoppingBag, ShoppingCart, ClipboardList } from 'lucide-react'
import { useCart } from '../../shared/context/CartContext'

const navItems = [
  { to: '/', icon: ShoppingBag, label: 'Products' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/order-status', icon: ClipboardList, label: 'Status' },
]

export default function BottomNav() {
  const { itemCount } = useCart()

  return (
    <nav className="glass-nav">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 no-underline ${
              isActive
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-800'
            }`
          }
          style={({ isActive }) =>
            isActive
              ? { background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary-dark))' }
              : {}
          }
        >
          <div className="relative">
            <Icon size={22} />
            {to === '/cart' && itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: 'var(--color-primary)' }}
              >
                {itemCount}
              </span>
            )}
          </div>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
