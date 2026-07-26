import { Router } from 'express'
import {
  createOrderController,
  getActiveOrdersController,
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  deliverOrderController,
} from './controller.js'

const router = Router()

router.post('/', createOrderController)
router.get('/refresh', getActiveOrdersController)
router.get('/', getOrdersController)
router.get('/:id', getOrderByIdController)
router.patch('/:id/status', updateOrderStatusController)
router.patch('/:id/deliver', deliverOrderController)

export default router
