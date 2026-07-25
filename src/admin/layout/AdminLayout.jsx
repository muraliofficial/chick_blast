import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Radio,
  ClipboardList,
  Package,
  Layers,
  Menu,
  X,
} from 'lucide-react'
import '../../styles/admin.css'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/live-orders', icon: Radio, label: 'Live Orders' },
  { to: '/admin/order-summary', icon: ClipboardList, label: 'Order Summary' },
  { to: '/admin/items', icon: Package, label: 'Items' },
  { to: '/admin/combo-items', icon: Layers, label: 'Combo Items' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h1>Chick Blast</h1>
          <p>Admin Panel</p>
        </div>
        <nav className="admin-nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <button
          className="md:hidden mb-4 p-2 rounded-lg bg-white shadow-sm cursor-pointer border-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Outlet />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
