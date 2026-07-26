import {
  createOrderInDb,
  fetchActiveOrders,
  fetchOrders,
  fetchOrderById,
  updateOrderStatusInDb,
  deliverOrderInDb,
} from './model.js'
import {
  validateCreateOrder,
  validateOrderStatusUpdate,
  validateDeliverOrder,
} from './validation.js'

export async function createOrderController(req, res) {
  try {
    const errors = validateCreateOrder(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') })
    }

    const order = await createOrderInDb(req.body)
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getActiveOrdersController(req, res) {
  try {
    const orders = await fetchActiveOrders()
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getOrdersController(req, res) {
  try {
    const { fromDate, toDate, status } = req.query
    const orders = await fetchOrders({ fromDate, toDate, status })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getOrderByIdController(req, res) {
  try {
    const order = await fetchOrderById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateOrderStatusController(req, res) {
  try {
    const errors = validateOrderStatusUpdate(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') })
    }

    const order = await updateOrderStatusInDb(req.params.id, req.body.status)
    res.json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function deliverOrderController(req, res) {
  try {
    const errors = validateDeliverOrder(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') })
    }

    const order = await deliverOrderInDb(req.params.id, req.body.payment)
    res.json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
