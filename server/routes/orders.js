import { Router } from 'express'
import {
  createOrder,
  getActiveOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deliverOrder,
  getItemOrderCounts,
  getOrderGrowth,
} from '../services/orderService.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { customerName, customerMobile, items, totalAmount } = req.body

    if (!customerName || !customerMobile || !items?.length) {
      return res.status(400).json({ error: 'Customer details and items are required' })
    }

    const order = await createOrder({
      customerName,
      customerMobile,
      items,
      totalAmount,
    })

    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/refresh', async (req, res) => {
  try {
    const orders = await getActiveOrders()
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const { fromDate, toDate, status } = req.query
    const orders = await getOrders({ fromDate, toDate, status })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'Status is required' })

    const order = await updateOrderStatus(req.params.id, status)
    res.json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.patch('/:id/deliver', async (req, res) => {
  try {
    const { payment } = req.body
    if (!payment?.mode) return res.status(400).json({ error: 'Payment mode is required' })

    const order = await deliverOrder(req.params.id, payment)
    res.json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router

export const dashboardRouter = Router()

dashboardRouter.get('/item-counts', async (req, res) => {
  try {
    const { date } = req.query
    const data = await getItemOrderCounts(date)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

dashboardRouter.get('/order-growth', async (req, res) => {
  try {
    const { month, year } = req.query
    const data = await getOrderGrowth(
      month ? Number(month) : undefined,
      year ? Number(year) : undefined
    )
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
