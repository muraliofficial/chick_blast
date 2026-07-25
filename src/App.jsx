import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './shared/context/CartContext'
import ApiLoader from './shared/components/ApiLoader'
import WebsiteLayout from './website/layout/WebsiteLayout'
import AdminLayout from './admin/layout/AdminLayout'
import Products from './website/pages/Products'
import Cart from './website/pages/Cart'
import OrderStatus from './website/pages/OrderStatus'
import Dashboard from './admin/pages/Dashboard'
import LiveOrders from './admin/pages/LiveOrders'
import OrderSummary from './admin/pages/OrderSummary'
import Items from './admin/pages/Items'
import ComboItems from './admin/pages/ComboItems'
import NotFound from './website/pages/NotFound'

export default function App() {
  return (
    <CartProvider>
      <ApiLoader />
      <BrowserRouter>
        <Routes>
          <Route element={<WebsiteLayout />}>
            <Route index element={<Products />} />
            <Route path="cart" element={<Cart />} />
            <Route path="order-status" element={<OrderStatus />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="live-orders" element={<LiveOrders />} />
            <Route path="order-summary" element={<OrderSummary />} />
            <Route path="items" element={<Items />} />
            <Route path="combo-items" element={<ComboItems />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
