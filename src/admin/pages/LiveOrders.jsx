import { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import { RefreshCw, XCircle, Utensils, Package, CheckCircle2, Sparkles } from 'lucide-react'
import { ordersApi } from '../../shared/api'
import { STATUS_ACTIONS, STATUS_LABELS } from '../../shared/constants'
import OrderBadge from '../../shared/components/OrderBadge'
import StatusPill from '../../shared/components/StatusPill'
import GradientModal from '../../shared/components/GradientModal'
import OrderDetailsContent from '../../shared/components/OrderDetailsContent'
import DeliveryModal from '../components/DeliveryModal'
import Toast, { useToast } from '../../shared/components/Toast'

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
  const { toast, showToast, hideToast } = useToast()

  const fetchOrders = useCallback(async () => {
    try {
      const data = await ordersApi.refresh()
      setOrders(data)
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
    e.stopPropagation()
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
    e.stopPropagation()
    if (!confirm('Cancel this order?')) return
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

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />

      <div className="admin-page-header">
        <h2>Live Orders</h2>
        <button onClick={handleRefresh} disabled={refreshing} className="btn-primary">
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Order No</th>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No active orders</td></tr>
            ) : (
              orders.map((order) => {
                const action = STATUS_ACTIONS[order.status]
                const ActionIcon = action ? ACTION_ICONS[action.next] || Sparkles : null
                return (
                  <tr key={order.id} onClick={() => setSelectedOrder(order)}>
                    <td>{moment(order.createdAt).format('DD MMM, hh:mm A')}</td>
                    <td><OrderBadge orderNo={order.orderNo} /></td>
                    <td className="font-medium">{order.customerName}</td>
                    <td>{order.customerMobile}</td>
                    <td><StatusPill status={order.status} /></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {action && (
                          <button
                            onClick={(e) => handleStatusUpdate(order, e)}
                            disabled={actionLoading === order.id}
                            className={`pill-status pill-status-${action.next} !px-3 !py-1.5 !text-xs font-semibold shadow-md border-none cursor-pointer hover:scale-105 transition-all flex items-center gap-1.5`}
                          >
                            {ActionIcon && <ActionIcon size={14} />}
                            <span>{action.label}</span>
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={(e) => handleCancel(order, e)}
                            disabled={actionLoading === order.id}
                            title="Cancel Order"
                            className="pill-status pill-status-cancelled !px-2.5 !py-1.5 !text-xs font-semibold shadow-md border-none cursor-pointer hover:scale-105 transition-all flex items-center gap-1"
                          >
                            <XCircle size={14} />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <GradientModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
        maxWidth="max-w-lg"
      >
        <OrderDetailsContent order={selectedOrder} />
      </GradientModal>

      <DeliveryModal
        isOpen={!!deliveryOrder}
        onClose={() => setDeliveryOrder(null)}
        order={deliveryOrder}
        onConfirm={handleDeliver}
      />
    </div>
  )
}
