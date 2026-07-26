export function validateCreateOrder(body) {
  const errors = []
  if (!body.customerName || typeof body.customerName !== 'string' || !body.customerName.trim()) {
    errors.push('Customer name is required')
  }
  if (!body.customerMobile || typeof body.customerMobile !== 'string' || !body.customerMobile.trim()) {
    errors.push('Customer mobile is required')
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push('At least one order item is required')
  }
  return errors
}

export function validateOrderStatusUpdate(body) {
  const errors = []
  if (!body.status || typeof body.status !== 'string' || !body.status.trim()) {
    errors.push('Status is required')
  }
  return errors
}

export function validateDeliverOrder(body) {
  const errors = []
  if (!body.payment || !body.payment.mode) {
    errors.push('Payment mode is required')
  }
  return errors
}
