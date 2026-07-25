import moment from 'moment'
import OrderBadge from './OrderBadge'
import StatusPill from './StatusPill'
import FssaiBadge from './FssaiBadge'
import logoImg from '../../assets/logo.png'

export default function OrderDetailsContent({ order }) {
  if (!order) return null

  return (
    <div className="space-y-6">
      <div className="text-center pb-2 border-b border-gray-100">
        <img
          src={logoImg}
          alt="Chick Blast"
          className="h-12 w-auto mx-auto object-contain mb-1 drop-shadow-sm"
        />
        <p className="text-xs text-gray-500 font-medium m-0">Official Store Receipt</p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <OrderBadge orderNo={order.orderNo} />
        <StatusPill status={order.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Customer</p>
          <p className="font-semibold">{order.customerName}</p>
          <p className="text-gray-600">{order.customerMobile}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date & Time</p>
          <p className="font-semibold">
            {moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Ordered Items</p>
        <div className="space-y-2">
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
            >
              <div className="flex items-center gap-2.5">
                <FssaiBadge isVeg={item.label === 'Veg'} size={16} />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-lg font-bold">Total</span>
        <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
          ₹{order.totalAmount?.toFixed(2)}
        </span>
      </div>

      {order.payment && (
        <div className="p-4 rounded-xl bg-green-50">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Payment</p>
          <p className="font-semibold">{order.payment.mode}</p>
          {order.payment.splitDetails && (
            <div className="mt-2 text-sm text-gray-600">
              {Object.entries(order.payment.splitDetails).map(([key, val]) =>
                val > 0 ? (
                  <p key={key}>
                    {key}: ₹{val}
                  </p>
                ) : null
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
