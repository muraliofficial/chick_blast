import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { RefreshCw, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'
import { ordersApi } from '../../shared/api'
import { useCart } from '../../shared/context/CartContext'
import OrderBadge from '../../shared/components/OrderBadge'
import StatusPill from '../../shared/components/StatusPill'
import FssaiBadge from '../../shared/components/FssaiBadge'
import logoImg from '../../assets/logo.png'

function SuccessTick() {
  return (
    <svg className="success-tick w-24 h-24 mx-auto" viewBox="0 0 52 52">
      <circle
        className="success-tick-circle"
        cx="26"
        cy="26"
        r="25"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
      />
      <path
        className="success-tick-check"
        fill="none"
        stroke="#22c55e"
        strokeWidth="3"
        d="M14 27l7 7 16-16"
      />
    </svg>
  )
}

const STATUS_TITLES = {
  new: 'Order Placed!',
  preparing: 'Order Being Prepared!',
  packed: 'Order Packed & Ready!',
  delivered: 'Order Delivered! Enjoy your meal!',
  cancelled: 'Order Cancelled',
}

const STATUS_SUBTITLES = {
  new: 'Your order has been received by the kitchen',
  preparing: 'Our chef is preparing your delicious meal right now',
  packed: 'Your order is packed and ready for delivery/pickup',
  delivered: 'Thank you for ordering with Chick Blast!',
  cancelled: 'This order was cancelled by the store',
}

export default function OrderStatus() {
  const location = useLocation()
  const { lastOrderId } = useCart()
  const orderId = location.state?.orderId || lastOrderId

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [itemsExpanded, setItemsExpanded] = useState(true)

  const fetchOrder = async () => {
    if (!orderId) {
      setLoading(false)
      return
    }
    try {
      const data = await ordersApi.getById(orderId)
      setOrder(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    fetchOrder().finally(() => setLoading(false))
    const interval = setInterval(() => {
      fetchOrder()
    }, 10000)
    return () => clearInterval(interval)
  }, [orderId])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrder()
    setRefreshing(false)
  }

  if (!orderId) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          📋
        </div>
        <h2 className="text-xl font-bold mb-2">No Active Order</h2>
        <p className="text-gray-500 text-sm">Place an order to track its status here.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-gray-400 font-medium">Loading order status...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Order not found</p>
      </div>
    )
  }

  const titleText = STATUS_TITLES[order.status] || 'Order Status'
  const subText = STATUS_SUBTITLES[order.status] || 'Track your order progress below'
  const totalItemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0

  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-6 pb-20">
      <img
        src={logoImg}
        alt="Chick Blast Logo"
        className="h-14 w-auto mx-auto object-contain drop-shadow-md animate-fade-in"
      />

      {order.status === 'new' && <SuccessTick />}

      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">{titleText}</h2>
        <p className="text-xs text-gray-500">{subText}</p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <OrderBadge orderNo={order.orderNo} />
        <StatusPill status={order.status} />
      </div>

      {/* Expandable Order Details Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-left transition-all">
        {/* Card Header Summary */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Customer Name</span>
            <span className="font-bold text-gray-900">{order.customerName}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Mobile Number</span>
            <span className="font-semibold text-gray-700">{order.customerMobile}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-1 border-t border-gray-100/60">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="font-black text-orange-500 text-base">
              ₹{order.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Expandable Ordered Items Header */}
        <button
          onClick={() => setItemsExpanded(!itemsExpanded)}
          className="w-full px-4 py-3 bg-white flex items-center justify-between border-none cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-orange-500" />
            <span className="text-xs font-bold text-gray-900">
              Ordered Items ({totalItemCount})
            </span>
          </div>
          {itemsExpanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </button>

        {/* Expandable Item List Content */}
        {itemsExpanded && (
          <div className="px-4 pb-4 space-y-2 bg-white animate-in fade-in slide-in-from-top-1 duration-200">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FssaiBadge isVeg={item.label === 'Veg'} size={14} />
                  <span className="font-bold text-gray-900 truncate">{item.name}</span>
                  <span className="text-gray-400 font-semibold">x{item.quantity}</span>
                </div>
                <span className="font-bold text-gray-900 ml-2">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="btn-outline !py-2.5 !px-5 mx-auto !text-xs shadow-sm"
      >
        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        Refresh Live Status
      </button>
    </div>
  )
}
