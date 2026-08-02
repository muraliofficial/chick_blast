import { useState } from 'react'
import { PAYMENT_MODES, SPLIT_PAYMENT_TYPES } from '../../shared/constants'
import GradientModal from '../../shared/components/GradientModal'
import OrderDetailsContent from '../../shared/components/OrderDetailsContent'

export default function DeliveryModal({ isOpen, onClose, order, onConfirm }) {
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [splitDetails, setSplitDetails] = useState({ Cash: 0, UPI: 0, Card: 0 })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const total = order?.totalAmount || 0

  const splitTotal = Object.values(splitDetails).reduce((s, v) => s + Number(v || 0), 0)

  const handleConfirm = async () => {
    setError('')

    if (paymentMode === 'Split') {
      if (Math.abs(splitTotal - total) > 0.01) {
        setError(`Split amounts must equal ₹${total.toFixed(2)}`)
        return
      }
    }

    setSubmitting(true)
    try {
      const payment =
        paymentMode === 'Split'
          ? { mode: 'Split', splitDetails }
          : { mode: paymentMode }

      await onConfirm(payment)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!order) return null

  return (
    <GradientModal isOpen={isOpen} onClose={onClose} title="Confirm Delivery" maxWidth="max-w-lg">
      <OrderDetailsContent order={order} />

      <div className="mt-5 space-y-4 pt-3 border-t border-slate-100">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Mode</p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentMode(mode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                  paymentMode === mode
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {paymentMode === 'Split' && (
          <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
            {SPLIT_PAYMENT_TYPES.map((type) => (
              <div key={type} className="flex items-center gap-3">
                <label className="w-12 text-xs font-bold text-slate-700">{type}</label>
                <input
                  type="number"
                  className="input-field !py-1.5 text-xs font-semibold"
                  placeholder="0"
                  min="0"
                  value={splitDetails[type]}
                  onChange={(e) =>
                    setSplitDetails({ ...splitDetails, [type]: e.target.value })
                  }
                />
              </div>
            ))}
            <p className="text-xs font-semibold text-slate-500 m-0 pt-1">
              Split total: <span className={Math.abs(splitTotal - total) < 0.01 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>₹{splitTotal.toFixed(2)}</span> / ₹{total.toFixed(2)}
            </p>
          </div>
        )}

        {error && <p className="text-rose-600 text-xs font-bold">{error}</p>}

        <div className="flex gap-2 sm:gap-3 justify-end pt-2 flex-col-reverse sm:flex-row">
          <button onClick={onClose} className="btn-outline w-full sm:w-auto !py-2.5 text-xs sm:text-sm">Cancel</button>
          <button onClick={handleConfirm} disabled={submitting} className="btn-primary w-full sm:w-auto !py-2.5 text-xs sm:text-sm font-bold">
            {submitting ? 'Confirming...' : 'Confirm Delivery'}
          </button>
        </div>
      </div>
    </GradientModal>
  )
}
