import { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import { RefreshCw, XCircle, Utensils, Package, CheckCircle2, Sparkles, Phone, ShoppingBag, ChevronRight } from 'lucide-react'
import { ordersApi } from '../../shared/api'
import { STATUS_ACTIONS, STATUS_LABELS } from '../../shared/constants'
import OrderBadge from '../../shared/components/OrderBadge'
import StatusPill from '../../shared/components/StatusPill'
import GradientModal from '../../shared/components/GradientModal'
import OrderDetailsContent from '../../shared/components/OrderDetailsContent'
import DeliveryModal from '../components/DeliveryModal'
import Toast, { useToast } from '../../shared/components/Toast'
import Loader from '../../shared/components/Loader'

const ACTION_ICONS = {
  preparing: Utensils,
  packed: Package,
  delivered: CheckCircle2,
}

export default function LiveOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [deliveryOrder, setDeliveryOrder] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const { toast, showToast, hideToast } = useToast()

  const fetchOrders = useCallback(async () => {
    try {
      const data = await ordersApi.refresh()
      setOrders(data || [])
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false))
    const interval = setInterval(() => {
      fetchOrders()
    }, 5000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrders()
    setRefreshing(false)
  }

  const handleStatusUpdate = async (order, e) => {
    e?.stopPropagation()
    const action = STATUS_ACTIONS[order.status]
    if (!action) return

    if (action.next === 'delivered') {
      setDeliveryOrder(order)
      return
    }

    setActionLoading(order.id)
    try {
      await ordersApi.updateStatus(order.id, action.next)
      await fetchOrders()
      showToast(`Order ${order.orderNo} updated to ${STATUS_LABELS[action.next] || action.next}!`, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (order, e) => {
    e?.stopPropagation()
    if (!confirm(`Cancel Order ${order.orderNo}?`)) return
    setActionLoading(order.id)
    try {
      await ordersApi.updateStatus(order.id, 'cancelled')
      await fetchOrders()
      showToast(`Order ${order.orderNo} has been cancelled!`, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeliver = async (payment) => {
    try {
      await ordersApi.deliver(deliveryOrder.id, payment)
      const ordNo = deliveryOrder.orderNo
      setDeliveryOrder(null)
      await fetchOrders()
      showToast(`Order ${ordNo} delivered successfully!`, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // Filter tabs logic
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true
    if (activeTab === 'new') return o.status === 'new'
    if (activeTab === 'preparing') return o.status === 'preparing'
    if (activeTab === 'packed') return o.status === 'packed'
    return true
  })

  const getTabCount = (tabKey) => {
    if (tabKey === 'all') return orders.length
    if (tabKey === 'new') return orders.filter((o) => o.status === 'new').length
    if (tabKey === 'preparing') return orders.filter((o) => o.status === 'preparing').length
    if (tabKey === 'packed') return orders.filter((o) => o.status === 'packed').length
    return 0
  }

  return (
    <div className="space-y-5">
      <Toast toast={toast} onClose={hideToast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 m-0">Live Orders</h2>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5 m-0">Auto-refreshing every 5 seconds</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-primary self-start sm:self-auto !py-2 !px-4 flex items-center justify-center gap-2 text-sm font-semibold shadow-sm cursor-pointer"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Filter Tabs (Horizontal Scrollable on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-gray-200">
        {[
          { key: 'all', label: 'All Active' },
          { key: 'new', label: 'New Orders' },
          { key: 'preparing', label: 'Preparing' },
          { key: 'packed', label: 'Packed' },
        ].map((tab) => {
          const count = getTabCount(tab.key)
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap border-none cursor-pointer transition-all ${
                isActive
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Orders Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12">
            <Loader fullScreen={false} size="sm" text="Fetching live orders..." subtext="" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <ShoppingBag size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 font-medium m-0">No active live orders right now</p>
            <p className="text-xs text-gray-400 m-0 mt-1">New incoming orders will appear here automatically</p>
          </div>
        ) : (
          <>
            {/* Mobile View Cards (block md:hidden) */}
            <div className="block md:hidden divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const action = STATUS_ACTIONS[order.status]
                const ActionIcon = action ? ACTION_ICONS[action.next] || Sparkles : null
                const isLoadingThis = actionLoading === order.id

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="p-4 hover:bg-orange-50/40 active:bg-orange-50 transition-colors cursor-pointer space-y-3"
                  >
                    {/* Top Row: Order No, Status Pill, Elapsed Time */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <OrderBadge orderNo={order.orderNo} />
                        <span className="text-[11px] text-gray-500 font-medium">
                          {moment(order.createdAt).fromNow()}
                        </span>
                      </div>
                      <StatusPill status={order.status} />
                    </div>

                    {/* Customer & Items Summary */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">{order.customerName}</span>
                        <span className="font-bold text-sm text-orange-600">
                          ₹{(order.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                      <a
                        href={`tel:${order.customerMobile}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-orange-600 no-underline"
                      >
                        <Phone size={12} />
                        <span>{order.customerMobile}</span>
                      </a>
                    </div>

                    {/* Items preview snippet */}
                    {order.items && order.items.length > 0 && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-xl flex items-center justify-between gap-2">
                        <span className="line-clamp-1 font-medium">
                          {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                        </span>
                        <ChevronRight size={14} className="text-gray-400 shrink-0" />
                      </div>
                    )}

                    {/* Action Bar */}
                    <div
                      className="flex items-center gap-2 pt-1 border-t border-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {action && (
                        <button
                          onClick={(e) => handleStatusUpdate(order, e)}
                          disabled={isLoadingThis}
                          className={`flex-1 pill-status pill-status-${action.next} !py-2.5 !px-3 !text-xs font-bold shadow-sm border-none cursor-pointer rounded-xl flex items-center justify-center gap-1.5 transition-transform active:scale-95`}
                        >
                          {isLoadingThis ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            ActionIcon && <ActionIcon size={15} />
                          )}
                          <span>Mark as {action.label}</span>
                        </button>
                      )}

                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button
                          onClick={(e) => handleCancel(order, e)}
                          disabled={isLoadingThis}
                          className="pill-status pill-status-cancelled !py-2.5 !px-3 !text-xs font-bold border-none cursor-pointer rounded-xl flex items-center justify-center gap-1 transition-transform active:scale-95 shrink-0"
                        >
                          <XCircle size={15} />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block admin-table border-none shadow-none rounded-none">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Order No</th>
                    <th>Customer Name</th>
                    <th>Mobile</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const action = STATUS_ACTIONS[order.status]
                    const ActionIcon = action ? ACTION_ICONS[action.next] || Sparkles : null
                    const isLoadingThis = actionLoading === order.id

                    return (
                      <tr key={order.id} onClick={() => setSelectedOrder(order)}>
                        <td>{moment(order.createdAt).format('DD MMM, hh:mm A')}</td>
                        <td><OrderBadge orderNo={order.orderNo} /></td>
                        <td className="font-medium text-gray-900">{order.customerName}</td>
                        <td className="text-gray-600">{order.customerMobile}</td>
                        <td className="font-bold text-gray-900">
                          ₹{(order.totalAmount || 0).toFixed(2)}
                        </td>
                        <td><StatusPill status={order.status} /></td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            {action && (
                              <button
                                onClick={(e) => handleStatusUpdate(order, e)}
                                disabled={isLoadingThis}
                                className={`pill-status pill-status-${action.next} !px-3.5 !py-2 !text-xs font-bold shadow-md border-none cursor-pointer hover:scale-105 transition-all flex items-center gap-1.5`}
                              >
                                {isLoadingThis ? (
                                  <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                  ActionIcon && <ActionIcon size={14} />
                                )}
                                <span>Mark {action.label}</span>
                              </button>
                            )}
                            {order.status !== 'cancelled' && order.status !== 'delivered' && (
                              <button
                                onClick={(e) => handleCancel(order, e)}
                                disabled={isLoadingThis}
                                title="Cancel Order"
                                className="pill-status pill-status-cancelled !px-2.5 !py-2 !text-xs font-semibold shadow-md border-none cursor-pointer hover:scale-105 transition-all flex items-center gap-1"
                              >
                                <XCircle size={14} />
                                <span>Cancel</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      <GradientModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
        maxWidth="max-w-lg"
      >
        <OrderDetailsContent order={selectedOrder} />
      </GradientModal>

      {/* Delivery Confirmation Modal */}
      <DeliveryModal
        isOpen={!!deliveryOrder}
        onClose={() => setDeliveryOrder(null)}
        order={deliveryOrder}
        onConfirm={handleDeliver}
      />
    </div>
  )
}
