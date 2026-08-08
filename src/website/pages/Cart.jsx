import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Trash2,
  User,
  Phone,
  ArrowLeft,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ShieldCheck,
  Lock,
  KeyRound,
  Send,
  Sparkles,
} from 'lucide-react'
import { useCart } from '../../shared/context/CartContext'
import { useCustomer } from '../../shared/context/CustomerContext'
import { ordersApi, customersApi } from '../../shared/api'
import SwipeToConfirm from '../../shared/components/SwipeToConfirm'
import FssaiBadge from '../../shared/components/FssaiBadge'
import logoImg from '../../assets/logo.png'
import QuantityControl from '../components/QuantityControl'

export default function Cart() {
  const navigate = useNavigate()
  const {
    items,
    customerName,
    customerMobile,
    totalAmount,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
    setCustomerName,
    setCustomerMobile,
    setLastOrderId,
  } = useCart()

  const {
    customer,
    isLoggedIn,
    loginCustomer,
    openAuthModal,
  } = useCustomer()

  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  // Inline OTP state on cart page when not logged in
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [isExistingCustomer, setIsExistingCustomer] = useState(false)
  const [needsNameInput, setNeedsNameInput] = useState(false)
  const [tempName, setTempName] = useState('')

  // Auto-sync customer details when customer is logged in
  useEffect(() => {
    if (isLoggedIn && customer) {
      if (customer.Name || customer.name) {
        setCustomerName(customer.Name || customer.name)
      }
      if (customer.MobileNo || customer.mobile) {
        setCustomerMobile(customer.MobileNo || customer.mobile)
      }
    }
  }, [isLoggedIn, customer])

  const isNameValid = customerName.trim().length > 0
  const isMobileValid = customerMobile.trim().length === 10
  const canPlace = items.length > 0 && isNameValid && isMobileValid

  // Handle Send OTP button click on Cart page
  const handleSendOtp = async () => {
    if (!isMobileValid || verifyingOtp) return
    setVerifyingOtp(true)
    setOtpError('')
    setError('')

    try {
      // Check if user is existing or new
      const checkRes = await customersApi.check(customerMobile)
      if (checkRes.exists && checkRes.customer) {
        setIsExistingCustomer(true)
        if (checkRes.customer.Name || checkRes.customer.name) {
          setTempName(checkRes.customer.Name || checkRes.customer.name)
        }
      } else {
        setIsExistingCustomer(false)
      }
      setOtpSent(true)
    } catch (err) {
      // Offline fallback
      setIsExistingCustomer(false)
      setOtpSent(true)
    } finally {
      setVerifyingOtp(false)
    }
  }

  // Handle Verify OTP on Cart page
  const handleVerifyCartOtp = async (e) => {
    if (e) e.preventDefault()
    if (otpCode.trim().length !== 4) {
      setOtpError('Please enter 4-digit verification code')
      return
    }

    setVerifyingOtp(true)
    setOtpError('')

    try {
      const payload = {
        mobileNo: customerMobile,
        otp: otpCode.trim(),
        name: isExistingCustomer ? tempName : (customerName.trim() || tempName.trim() || 'Customer'),
        isNewUser: !isExistingCustomer,
      }

      // If new user needs to provide name first
      if (!isExistingCustomer && !customerName.trim() && !tempName.trim()) {
        setNeedsNameInput(true)
        setVerifyingOtp(false)
        return
      }

      const res = await customersApi.verifyOtp(payload)
      if (res.success && res.customer) {
        loginCustomer(res.customer, res.orders || [])
        const finalName = res.customer.Name || res.customer.name || tempName
        setCustomerName(finalName)
        setCustomerMobile(res.customer.MobileNo || res.customer.mobile || customerMobile)
        setOtpSent(false)
        setOtpCode('')
        setNeedsNameInput(false)
      } else {
        throw new Error(res.error || 'Invalid verification code.')
      }
    } catch (err) {
      setOtpError(err.message || 'Invalid verification code. Please try again.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!canPlace || placing) return
    setPlacing(true)
    setError('')

    const customerDid = customer?.did || customer?.id || ''
    const currentName = customerName.trim()
    const currentMobile = customerMobile.trim()

    try {
      const order = await ordersApi.create({
        customerName: currentName,
        customerMobile: currentMobile,
        customerDid,
        customerDetails: {
          name: currentName,
          mobile: currentMobile,
          customerDid,
        },
        items: items.map(({ itemId, name, price, quantity, type }) => ({
          itemId,
          name,
          price,
          quantity,
          type,
        })),
        totalAmount,
      })

      setLastOrderId(order.id)
      clearCart()
      navigate('/order-status', { state: { orderId: order.id, justPlaced: true } })
    } catch (err) {
      setError(err.message)
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-4">
        <div className="w-24 h-24 rounded-full bg-orange-50 mx-auto flex items-center justify-center border border-orange-100 shadow-inner">
          <img
            src={logoImg}
            alt="Chick Blast Logo"
            className="h-16 w-auto object-contain drop-shadow-md"
          />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 m-0">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-gray-500 m-0">Looks like you haven't added any crispy items yet.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-primary !px-7 !py-3.5 !rounded-2xl text-sm font-black shadow-lg shadow-orange-500/25 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={18} /> Explore Menu
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5 pb-32">
      {/* Selected Items Card Sheet */}
      <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold shrink-0 text-sm">
              🛒
            </div>
            <h3 className="text-sm font-black text-gray-900 m-0">Selected Items ({itemCount})</h3>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-extrabold text-orange-500 hover:text-orange-600 border-none bg-transparent cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Plus size={14} className="stroke-[3]" /> Add More
          </button>
        </div>

        {/* Item List */}
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.itemId} className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between gap-2">
              {/* Thumbnail & Item Details */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-orange-50/50 overflow-hidden shrink-0 border border-gray-100 relative flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">🍗</span>
                  )}
                  {/* FSSAI Veg / Non-Veg Badge */}
                  <div className="absolute top-0.5 right-0.5 z-10 p-0.5 flex items-center justify-center">
                    <FssaiBadge isVeg={item.label === 'Veg'} size={11} />
                  </div>
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate m-0">{item.name}</h4>
                  <p className="text-[11px] font-semibold text-gray-400 m-0">₹{item.price} × {item.quantity}</p>
                </div>
              </div>

              {/* Quantity Stepper & Subtotal */}
              <div className="flex items-center gap-2.5 shrink-0">
                <QuantityControl
                  quantity={item.quantity}
                  onIncrement={() => updateQuantity(item.itemId, item.quantity + 1)}
                  onDecrement={() => updateQuantity(item.itemId, item.quantity - 1)}
                  size="sm"
                />

                <span className="font-black text-xs sm:text-sm text-gray-900 text-right min-w-[42px]">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Contact Information Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 m-0">
              Contact Information
            </h3>
          </div>

          {canPlace && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 size={13} /> Ready to Order
            </span>
          )}
        </div>

        {/* 1. Mobile Number Field with Send OTP Button */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <Phone size={18} className={`absolute left-3.5 top-3.5 ${isLoggedIn ? 'text-gray-700' : 'text-gray-400'}`} />
            <input
              type="tel"
              placeholder="10-digit Mobile Number"
              value={customerMobile}
              disabled={isLoggedIn}
              onChange={(e) => {
                setError('')
                setOtpError('')
                setOtpSent(false)
                setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))
              }}
              className={`input-field !pl-10 !pr-24 text-sm font-semibold transition-all ${
                isLoggedIn
                  ? '!bg-slate-50 !border-gray-200 !text-slate-900 cursor-not-allowed opacity-90'
                  : ''
              }`}
              maxLength={10}
            />

            {isLoggedIn ? (
              <div className="absolute right-3.5 top-3.5 flex items-center gap-1 text-xs font-bold text-gray-500">
                <Lock size={14} className="text-gray-400" />
                <span className="text-[10px] uppercase font-bold text-gray-400">Locked</span>
              </div>
            ) : isMobileValid ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={verifyingOtp}
                className="absolute right-2 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs border-none cursor-pointer shadow-xs transition-transform active:scale-95 flex items-center gap-1"
              >
                <Send size={12} />
                <span>{verifyingOtp ? 'Sending...' : otpSent ? 'Resend' : 'Send OTP'}</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* 2. Inline OTP Verification Input (When OTP Sent & Not logged in) */}
        {!isLoggedIn && otpSent && (
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <KeyRound size={14} className="text-orange-600" />
                <span>Enter Verification Code</span>
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="tel"
                maxLength={4}
                placeholder="Enter 4-digit OTP"
                value={otpCode}
                onChange={(e) => {
                  setOtpError('')
                  setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))
                }}
                className="input-field !py-2 text-sm font-black tracking-widest text-center flex-1 bg-white"
                autoFocus
              />
              <button
                type="button"
                onClick={handleVerifyCartOtp}
                disabled={verifyingOtp || otpCode.length !== 4}
                className="btn-primary !px-4 !py-2 !rounded-xl text-xs font-black shrink-0 cursor-pointer"
              >
                {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            {needsNameInput && !isExistingCustomer && (
              <div className="pt-2 space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Enter Your Full Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Murali"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-field !py-2 text-xs font-semibold bg-white"
                />
              </div>
            )}

            {otpError && (
              <p className="text-xs text-red-600 font-bold m-0">{otpError}</p>
            )}
          </div>
        )}

        {/* 3. Customer Name Field */}
        <div className="space-y-1">
          <div className="relative">
            <User size={18} className={`absolute left-3.5 top-3.5 ${isLoggedIn ? 'text-gray-700' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Your Full Name"
              value={customerName}
              disabled={isLoggedIn}
              onChange={(e) => {
                setError('')
                setCustomerName(e.target.value)
              }}
              className={`input-field !pl-10 text-sm font-semibold transition-all ${
                isLoggedIn
                  ? '!bg-slate-50 !border-gray-200 !text-slate-900 cursor-not-allowed opacity-90'
                  : ''
              }`}
            />
            {isLoggedIn ? (
              <div className="absolute right-3.5 top-3.5 flex items-center gap-1 text-xs font-bold text-gray-500">
                <Lock size={14} className="text-gray-400" />
                <span className="text-[10px] uppercase font-bold text-gray-400">Locked</span>
              </div>
            ) : isNameValid ? (
              <CheckCircle2 size={16} className="absolute right-3.5 top-3.5 text-emerald-500" />
            ) : null}
          </div>
        </div>
      </div>

      {/* Bill Details Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Receipt size={18} className="text-orange-500" />
          <h3 className="text-sm font-bold text-gray-900 m-0">Bill Summary</h3>
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>Items Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-semibold text-gray-800">₹{totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>Packaging & Service Fee</span>
          <span className="font-bold text-emerald-600 uppercase">FREE</span>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="font-bold text-base text-gray-900">Grand Total</span>
          <span className="font-black text-2xl text-orange-500">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Validation Banner if missing info */}
      {!canPlace && (
        <div className="flex items-center gap-2 p-3 bg-orange-50/80 text-orange-700 rounded-xl text-xs font-semibold border border-orange-200/80">
          <AlertCircle size={16} className="shrink-0" />
          <span>
            {!customerName.trim()
              ? 'Please enter your name to complete your order'
              : customerMobile.length < 10
              ? 'Please enter a valid 10-digit mobile number'
              : ''}
          </span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center border border-red-100">
          {error}
        </div>
      )}

      {/* Swipe to Confirm Action Bar */}
      <div className="pt-1">
        <SwipeToConfirm
          onConfirm={handlePlaceOrder}
          disabled={!canPlace || placing}
          label={placing ? 'Placing Order...' : 'Swipe to Place Order'}
        />
      </div>
    </div>
  )
}
