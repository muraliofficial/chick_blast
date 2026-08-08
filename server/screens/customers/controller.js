import {
  checkCustomerExists,
  createCustomerInDb,
  updateCustomerInDb,
  fetchCustomerProfile,
  fetchCustomerOrders,
} from './model.js'

export const DEMO_OTP = '1234'

/**
 * Check if a mobile number is an existing customer
 */
export async function checkCustomerController(req, res) {
  try {
    const { mobileNo } = req.body
    const cleanMobile = String(mobileNo || '').replace(/\D/g, '')

    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number' })
    }

    const result = await checkCustomerExists(cleanMobile)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Verify OTP (1234) and handle login / customer registration
 */
export async function verifyOtpController(req, res) {
  try {
    const { mobileNo, otp, name, isNewUser } = req.body
    const cleanMobile = String(mobileNo || '').replace(/\D/g, '')
    const cleanOtp = String(otp || '').trim()

    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({ error: 'Valid 10-digit mobile number is required' })
    }

    if (cleanOtp !== DEMO_OTP) {
      return res.status(400).json({ error: 'Invalid verification code. Please try again.' })
    }

    // Check existing customer status
    const { exists, customer: existingCustomer } = await checkCustomerExists(cleanMobile)

    let customer = null

    if (isNewUser || !exists) {
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Customer Name is required for registration' })
      }
      customer = await createCustomerInDb({
        name: name.trim(),
        mobileNo: cleanMobile,
      })
    } else {
      customer = existingCustomer
    }

    // Fetch order history for the customer
    const orders = await fetchCustomerOrders(cleanMobile)

    res.json({
      success: true,
      message: exists ? 'Logged in successfully' : 'Account created successfully',
      customer,
      orders,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Get Customer Profile
 */
export async function getCustomerProfileController(req, res) {
  try {
    const { mobileNo } = req.params
    const cleanMobile = String(mobileNo || '').replace(/\D/g, '')

    if (!cleanMobile) {
      return res.status(400).json({ error: 'Mobile number is required' })
    }

    const customer = await fetchCustomerProfile(cleanMobile)
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    const orders = await fetchCustomerOrders(cleanMobile)
    res.json({
      customer,
      orders,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/**
 * Update Customer Profile (Name)
 */
export async function updateCustomerProfileController(req, res) {
  try {
    const { id } = req.params
    const { name, Name } = req.body
    const newName = (name || Name || '').trim()

    if (!newName) {
      return res.status(400).json({ error: 'Customer name cannot be empty' })
    }

    const updated = await updateCustomerInDb(id, { name: newName })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

/**
 * Get Customer Orders
 */
export async function getCustomerOrdersController(req, res) {
  try {
    const { mobileNo } = req.params
    const cleanMobile = String(mobileNo || '').replace(/\D/g, '')

    if (!cleanMobile) {
      return res.status(400).json({ error: 'Mobile number is required' })
    }

    const orders = await fetchCustomerOrders(cleanMobile)
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
