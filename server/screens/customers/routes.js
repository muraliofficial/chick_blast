import { Router } from 'express'
import {
  checkCustomerController,
  verifyOtpController,
  getCustomerProfileController,
  updateCustomerProfileController,
  getCustomerOrdersController,
} from './controller.js'

const router = Router()

router.post('/check', checkCustomerController)
router.post('/verify-otp', verifyOtpController)
router.get('/profile/:mobileNo', getCustomerProfileController)
router.put('/:id', updateCustomerProfileController)
router.patch('/:id', updateCustomerProfileController)
router.get('/:mobileNo/orders', getCustomerOrdersController)

export default router
