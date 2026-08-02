import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Utensils, Package, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'

export default function StatusActionMenu({ order, onSelectAction, loading }) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, right: 0 })
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  // Calculate position when opening
  const toggleMenu = (e) => {
    e?.stopPropagation()
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      })
    }
    setIsOpen(!isOpen)
  }

  // Close dropdown on click outside, scroll, or resize
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    function handleScrollOrResize() {
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [isOpen])

  if (!order || order.status === 'delivered' || order.status === 'cancelled') {
    return <span className="text-xs font-semibold text-slate-400">Completed</span>
  }

  const handleItemClick = (actionKey, e) => {
    e?.stopPropagation()
    setIsOpen(false)
    onSelectAction(order, actionKey)
  }

  return (
    <div className="inline-block text-left" onClick={(e) => e.stopPropagation()}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        disabled={loading}
        onClick={toggleMenu}
        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs border-none cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? (
          <>
            <RefreshCw size={13} className="animate-spin" />
            <span>Updating...</span>
          </>
        ) : (
          <>
            <span>Action</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Portal Popover Menu rendered into document.body to prevent table clipping */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              right: `${coords.right}px`,
              zIndex: 99999,
            }}
            className="w-44 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 origin-top-right select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {order.status === 'new' && (
              <button
                type="button"
                onClick={(e) => handleItemClick('preparing', e)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-800 hover:bg-amber-50 flex items-center gap-2 transition-colors border-none cursor-pointer"
              >
                <Utensils size={14} className="text-amber-500 shrink-0" />
                <span>Mark Preparing</span>
              </button>
            )}

            {(order.status === 'new' || order.status === 'preparing') && (
              <button
                type="button"
                onClick={(e) => handleItemClick('packed', e)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-800 hover:bg-indigo-50 flex items-center gap-2 transition-colors border-none cursor-pointer"
              >
                <Package size={14} className="text-indigo-500 shrink-0" />
                <span>Mark Packed</span>
              </button>
            )}

            {(order.status === 'new' || order.status === 'preparing' || order.status === 'packed') && (
              <button
                type="button"
                onClick={(e) => handleItemClick('delivered', e)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 transition-colors border-none cursor-pointer"
              >
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Deliver Order</span>
              </button>
            )}

            <div className="my-1 border-t border-slate-100" />

            <button
              type="button"
              onClick={(e) => handleItemClick('cancelled', e)}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors border-none cursor-pointer"
            >
              <XCircle size={14} className="text-rose-500 shrink-0" />
              <span>Cancel Order</span>
            </button>
          </div>,
          document.body
        )}
    </div>
  )
}
