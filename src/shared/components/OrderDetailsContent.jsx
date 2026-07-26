import moment from 'moment'
import { User, Phone, Calendar, Clock, ShoppingBag, CheckCircle2 } from 'lucide-react'
import OrderBadge from './OrderBadge'
import StatusPill from './StatusPill'
import FssaiBadge from './FssaiBadge'
import logoImg from '../../assets/logo.png'

export default function OrderDetailsContent({ order }) {
  if (!order) return null

  const totalItemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0

  return (
    <div className="space-y-5">
      {/* Brand Header Receipt Badge */}
      <div className="text-center pb-3 border-b border-gray-100 space-y-1">
        <img
          src={logoImg}
          alt="Chick Blast"
          className="h-10 w-auto mx-auto object-contain drop-shadow-xs"
        />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest m-0">Store Order Receipt</p>
      </div>

      {/* Order Badge & Status */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
        <OrderBadge orderNo={order.orderNo} />
        <StatusPill status={order.status} />
      </div>

      {/* Customer Info & Date Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-white border border-gray-100 p-3.5 rounded-2xl space-y-1.5 shadow-xs">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Customer Info</span>
          <div className="flex items-center gap-1.5 font-bold text-gray-900">
            <User size={14} className="text-orange-500" />
            <span className="truncate">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 font-semibold">
            <Phone size={14} className="text-gray-400" />
            <span>{order.customerMobile}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-3.5 rounded-2xl space-y-1.5 shadow-xs">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Order Timestamp</span>
          <div className="flex items-center gap-1.5 font-bold text-gray-900">
            <Calendar size={14} className="text-orange-500" />
            <span>{moment(order.createdAt).format('DD MMM YYYY')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 font-semibold">
            <Clock size={14} className="text-gray-400" />
            <span>{moment(order.createdAt).format('hh:mm A')}</span>
          </div>
        </div>
      </div>

      {/* Ordered Items Breakdown */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5">
            <ShoppingBag size={14} className="text-orange-500" /> Items List
          </span>
          <span>{totalItemCount} items</span>
        </div>

        <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-2xl p-3 shadow-xs">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FssaiBadge isVeg={item.label === 'Veg'} size={13} />
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate m-0">{item.name}</p>
                  <p className="text-[11px] text-gray-400 font-semibold m-0">₹{item.price} x {item.quantity}</p>
                </div>
              </div>
              <span className="font-black text-gray-900">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grand Total Summary Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between shadow-lg shadow-orange-500/20">
        <div>
          <span className="text-xs font-bold text-orange-100 uppercase tracking-wider block">Grand Total</span>
          <span className="text-xs text-orange-100 font-medium">Taxes & fees included</span>
        </div>
        <span className="text-2xl font-black text-white">
          ₹{order.totalAmount?.toFixed(2)}
        </span>
      </div>

      {/* Payment Information if present */}
      {order.payment && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
            <CheckCircle2 size={13} /> Payment Mode: {order.payment.mode}
          </div>
          {order.payment.splitDetails && (
            <div className="text-emerald-700 font-semibold pt-1">
              {Object.entries(order.payment.splitDetails).map(([key, val]) =>
                val > 0 ? (
                  <p key={key} className="m-0">
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
