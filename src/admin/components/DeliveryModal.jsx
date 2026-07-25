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

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm font-semibold mb-2">Payment Mode</p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentMode(mode)}
                className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer border-none transition-all ${
                  paymentMode === mode
                    ? 'btn-primary'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {paymentMode === 'Split' && (
          <div className="space-y-2">
            {SPLIT_PAYMENT_TYPES.map((type) => (
              <div key={type} className="flex items-center gap-3">
                <label className="w-12 text-sm font-medium">{type}</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0"
                  min="0"
                  value={splitDetails[type]}
                  onChange={(e) =>
                    setSplitDetails({ ...splitDetails, [type]: e.target.value })
                  }
                />
              </div>
            ))}
            <p className="text-sm text-gray-500">
              Split total: ₹{splitTotal.toFixed(2)} / ₹{total.toFixed(2)}
            </p>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onClose} className="btn-outline">Cancel</button>
          <button onClick={handleConfirm} disabled={submitting} className="btn-primary">
            {submitting ? 'Confirming...' : 'Confirm Delivery'}
          </button>
        </div>
      </div>
    </GradientModal>
  )
}
