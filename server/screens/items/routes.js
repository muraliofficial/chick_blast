import { Router } from 'express'
import {
  getItemsController,
  getAllItemsAdminController,
  createItemController,
  updateItemController,
  deleteItemController,
} from './controller.js'

const router = Router()

router.get('/', getItemsController)
router.get('/all', getAllItemsAdminController)
router.post('/', createItemController)
router.put('/:id', updateItemController)
router.delete('/:id', deleteItemController)

export default router
