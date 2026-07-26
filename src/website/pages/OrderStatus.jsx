import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Receipt,
  CheckCircle2,
  Flame,
  PackageCheck,
  PartyPopper,
  User,
  Phone,
  ArrowLeft,
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react'
import { ordersApi } from '../../shared/api'
import { useCart } from '../../shared/context/CartContext'
import OrderBadge from '../../shared/components/OrderBadge'
import StatusPill from '../../shared/components/StatusPill'
import FssaiBadge from '../../shared/components/FssaiBadge'
import Loader from '../../shared/components/Loader'
import logoImg from '../../assets/logo.png'

const TRACKER_STEPS = [
  { key: 'new', label: 'Placed', icon: Receipt, desc: 'Kitchen received order' },
  { key: 'preparing', label: 'Preparing', icon: Flame, desc: 'Chef is cooking fresh' },
  { key: 'packed', label: 'Packed', icon: PackageCheck, desc: 'Ready for pickup/delivery' },
  { key: 'delivered', label: 'Delivered', icon: PartyPopper, desc: 'Order completed' },
]

const STATUS_ORDER = ['new', 'preparing', 'packed', 'delivered']

export default function OrderStatus() {
  const location = useLocation()
  const navigate = useNavigate()
  const { lastOrderId } = useCart()
  const orderId = location.state?.orderId || lastOrderId
  const justPlacedFromLocation = location.state?.justPlaced || false

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [itemsExpanded, setItemsExpanded] = useState(true)
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(justPlacedFromLocation)

  const [overlayTitle, setOverlayTitle] = useState(
    justPlacedFromLocation ? 'Order Placed! 🎉' : 'Order Confirmed!'
  )
  const [overlaySubtitle, setOverlaySubtitle] = useState(
    'Your order has been received & kitchen preparation is starting.'
  )
  const prevStatusRef = useRef(null)

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

  // Auto-dismiss overlay after 3 seconds
  useEffect(() => {
    if (showSuccessOverlay) {
      const timer = setTimeout(() => {
        setShowSuccessOverlay(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessOverlay])

  // Trigger green celebration splash screen when order status changes to 'delivered'
  useEffect(() => {
    if (order) {
      if (prevStatusRef.current === null) {
        prevStatusRef.current = order.status
      } else if (order.status === 'delivered' && prevStatusRef.current !== 'delivered') {
        setOverlayTitle('Order Delivered! 🥳')
        setOverlaySubtitle('Your order has been delivered successfully. Enjoy your delicious meal!')
        setShowSuccessOverlay(true)
        prevStatusRef.current = order.status
      } else {
        prevStatusRef.current = order.status
      }
    }
  }, [order?.status])

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    fetchOrder().finally(() => setLoading(false))
    const interval = setInterval(() => {
      fetchOrder()
    }, 8000)
    return () => clearInterval(interval)
  }, [orderId])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrder()
    setRefreshing(false)
  }

  if (!orderId) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-4">
        <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 text-3xl shadow-inner border border-orange-100">
          📋
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 m-0">No Active Order Tracked</h2>
          <p className="text-xs sm:text-sm text-gray-500 m-0">Place an order to track live kitchen preparation & status.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-primary !px-7 !py-3 !rounded-2xl text-sm font-black shadow-lg shadow-orange-500/25 active:scale-95 cursor-pointer inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Explore Menu
        </button>
      </div>
    )
  }

  if (loading) {
    return <Loader fullScreen={false} text="Fetching Order Status..." subtext="Connecting to Chick Blast kitchen" />
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-4">
        <AlertCircle size={48} className="mx-auto text-gray-300" />
        <h2 className="text-xl font-bold text-gray-900 m-0">Order Not Found</h2>
        <p className="text-xs text-gray-500 m-0">We couldn't find an active order with ID #{orderId}</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary !px-6 !py-2.5 !rounded-xl text-xs font-extrabold cursor-pointer"
        >
          Back to Menu
        </button>
      </div>
    )
  }

  const currentStepIdx = STATUS_ORDER.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'
  const totalItemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0

  const handleManualOpenOverlay = () => {
    if (order.status === 'delivered') {
      setOverlayTitle('Order Delivered! 🥳')
      setOverlaySubtitle('Your order has been delivered successfully. Enjoy your delicious meal!')
    } else {
      setOverlayTitle('Order Confirmed! 🎉')
      setOverlaySubtitle('Your order has been received & kitchen preparation is starting.')
    }
    setShowSuccessOverlay(true)
  }

  return (
    <>
      {/* Full Screen Green Order Placed Splash Overlay (Auto-dismisses in 3 seconds) */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-b from-emerald-500 via-emerald-600 to-green-700 text-white flex flex-col items-center justify-between p-6 sm:p-10 overflow-y-auto animate-fade-in">
          {/* Top Bar with Auto-Dismiss Indicator */}
          <div className="w-full max-w-md flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 text-xs font-black uppercase tracking-wider text-white">
              <CheckCircle2 size={16} className="text-white" />
              {order.status === 'delivered' ? 'Delivered' : 'Order Confirmed'}
            </div>
            <button
              onClick={() => setShowSuccessOverlay(false)}
              className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs border border-white/30 transition-colors cursor-pointer"
            >
              Skip ✕
            </button>
          </div>

          {/* Central Giant Tick Icon & Dynamic Message */}
          <div className="flex flex-col items-center text-center space-y-4 my-auto py-6">
            <div className="relative my-2">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-950/40 ring-8 ring-white/30 animate-tick-pop animate-ripple mx-auto">
                <svg
                  className="w-20 h-20 sm:w-24 sm:h-24 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h1 className="text-3xl sm:text-4xl font-black text-white m-0 tracking-tight drop-shadow-md">
                {overlayTitle}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 font-semibold m-0 leading-snug">
                {overlaySubtitle}
              </p>
            </div>

            {/* Token Card */}
            <div className="w-full max-w-sm bg-white/15 backdrop-blur-md border border-white/25 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-2 text-center my-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-200 block">
                🎟️ YOUR ORDER NUMBER / TOKEN
              </span>
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-white m-0 drop-shadow-lg">
                #{order.orderNo}
              </div>
              <p className="text-xs text-emerald-100 font-semibold m-0 pt-1">
                Quote this token number when collecting your food
              </p>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
                <span>{order.customerName}</span>
                <span>₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bottom 3-Second Progress Bar & Action */}
          <div className="w-full max-w-sm space-y-3 pb-4">
            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div className="bg-white h-full animate-progress-3s rounded-full" />
            </div>
            <button
              onClick={() => setShowSuccessOverlay(false)}
              className="w-full py-3 px-6 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 text-sm font-black shadow-xl shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border-none"
            >
              <span>View Order Details</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}


      <div className="max-w-lg sm:max-w-xl mx-auto space-y-5 pb-28">
        {/* Brand Header */}
        <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Chick Blast" className="h-9 w-auto object-contain" />
            <div>
              <h2 className="text-lg font-black text-gray-900 m-0 leading-tight">Live Order Tracking</h2>
              <p className="text-xs text-gray-400 font-semibold m-0">Real-time Kitchen Progress</p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors border border-orange-200/60 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Order Status"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Highlighted Order Token Banner */}
        <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white text-center shadow-xl shadow-emerald-600/20 border border-emerald-400/30 overflow-hidden">
          <div className="relative z-10 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-widest text-white border border-white/30">
              <CheckCircle2 size={13} /> YOUR ORDER NUMBER / TOKEN
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white m-0 drop-shadow-md">
              #{order.orderNo}
            </h1>
            <p className="text-xs text-emerald-100 font-bold m-0 max-w-sm mx-auto">
              Please quote this Order Number when picking up or receiving your food
            </p>

            <button
              onClick={handleManualOpenOverlay}
              className="mt-2.5 px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors border border-white/30 cursor-pointer"
            >
              <CheckCircle2 size={15} /> View Fullscreen Green Success View
            </button>
          </div>
        </div>

        {/* Visual Step Tracker Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">Status Update</span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 m-0 capitalize">
                {isCancelled ? 'Order Cancelled' : order.status === 'new' ? 'Order Placed!' : order.status === 'preparing' ? 'Preparing Meals 🍳' : order.status === 'packed' ? 'Packed & Ready 📦' : 'Delivered 🎉'}
              </h3>
            </div>
            <StatusPill status={order.status} />
          </div>

          {/* Step Progress Line */}
          {!isCancelled && (
            <div className="relative pt-2">
              <div className="flex items-center justify-between relative z-10">
                {TRACKER_STEPS.map((step, idx) => {
                  const Icon = step.icon
                  const isPassed = currentStepIdx >= idx
                  const isCurrent = currentStepIdx === idx

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-2 flex-1">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isPassed
                            ? isCurrent
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-110 ring-4 ring-emerald-100'
                              : 'bg-emerald-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}
                      >
                        <Icon size={20} className={isCurrent ? 'animate-bounce' : ''} />
                      </div>

                      <div className="space-y-0.5">
                        <p
                          className={`text-xs font-black m-0 leading-tight ${
                            isPassed ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[10px] text-gray-400 hidden sm:block font-medium m-0">{step.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Connecting Bar */}
              <div className="absolute top-7 sm:top-8 left-8 right-8 h-1 bg-gray-100 -z-0 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStepIdx / (TRACKER_STEPS.length - 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Order Info & Customer Details Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <OrderBadge orderNo={order.orderNo} />
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
              <Clock size={14} className="text-emerald-600" />
              <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Customer Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider block">Customer Name</span>
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <User size={14} className="text-gray-400" />
                <span className="truncate">{order.customerName}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider block">Mobile Number</span>
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <Phone size={14} className="text-gray-400" />
                <span>{order.customerMobile}</span>
              </div>
            </div>
          </div>

          {/* Expandable Order Details */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => setItemsExpanded(!itemsExpanded)}
              className="w-full p-3.5 bg-white flex items-center justify-between border-none cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-emerald-600" />
                <span className="text-xs font-black text-gray-900">
                  Ordered Items ({totalItemCount})
                </span>
              </div>
              {itemsExpanded ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </button>

            {itemsExpanded && (
              <div className="p-3.5 pt-0 space-y-2 bg-white border-t border-gray-100">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FssaiBadge isVeg={item.label === 'Veg'} size={13} />
                      <span className="font-bold text-gray-900 truncate">{item.name}</span>
                      <span className="text-emerald-600 font-extrabold text-[11px]">x{item.quantity}</span>
                    </div>
                    <span className="font-black text-gray-900 ml-2">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}

                {/* Total Summary Row */}
                <div className="pt-2 flex justify-between items-center text-xs font-bold border-t border-gray-100">
                  <span className="text-gray-500">Order Subtotal</span>
                  <span className="text-emerald-600 font-black text-base">₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
