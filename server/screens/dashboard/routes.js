import { Router } from 'express'
import { getItemCountsController, getOrderGrowthController } from './controller.js'

const router = Router()

router.get('/item-counts', getItemCountsController)
router.get('/order-growth', getOrderGrowthController)

export default router
