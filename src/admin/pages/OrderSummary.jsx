import { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import { Search } from 'lucide-react'
import { ordersApi } from '../../shared/api'
import OrderBadge from '../../shared/components/OrderBadge'
import StatusPill from '../../shared/components/StatusPill'
import GradientModal from '../../shared/components/GradientModal'
import OrderDetailsContent from '../../shared/components/OrderDetailsContent'
import ModernDatePicker from '../../shared/components/ModernDatePicker'

export default function OrderSummary() {
  const defaultFrom = moment().startOf('month').format('YYYY-MM-DD')
  const defaultTo = moment().format('YYYY-MM-DD')

  const [orders, setOrders] = useState([])
  const [fromDate, setFromDate] = useState(defaultFrom)
  const [toDate, setToDate] = useState(defaultTo)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleSearch = useCallback(async () => {
    setLoading(true)
    setSearched(true)
    try {
      const params = {}
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate
      const data = await ordersApi.getAll(params)
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [fromDate, toDate])

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 m-0">Order Summary</h2>
          <p className="text-xs text-gray-500 mt-1">Filtered order history & reports</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 items-end bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
        <div className="w-56">
          <ModernDatePicker
            label="From Date"
            value={fromDate}
            onChange={(d) => setFromDate(d)}
          />
        </div>
        <div className="w-56">
          <ModernDatePicker
            label="To Date"
            value={toDate}
            onChange={(d) => setToDate(d)}
          />
        </div>
        <button onClick={handleSearch} disabled={loading} className="btn-primary !py-2.5">
          <Search size={18} />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Order No</th>
              <th>Customer Details</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!searched ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Select dates and search</td></tr>
            ) : loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">No orders found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} onClick={() => setSelectedOrder(order)}>
                  <td>{moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}</td>
                  <td><OrderBadge orderNo={order.orderNo} /></td>
                  <td>
                    <p className="font-medium m-0">{order.customerName}</p>
                    <p className="text-sm text-gray-500 m-0">{order.customerMobile}</p>
                  </td>
                  <td><StatusPill status={order.status} /></td>
                </tr>
              ))
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
    </div>
  )
}
