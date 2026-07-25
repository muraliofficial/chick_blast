import { useRef, useState, useCallback } from 'react'
import { ChevronRight, Check, ChevronsRight } from 'lucide-react'

export default function SwipeToConfirm({ onConfirm, disabled, label = 'Swipe to Place Order' }) {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const startX = useRef(0)

  const maxOffset = useCallback(() => {
    if (!trackRef.current) return 200
    return Math.max(50, trackRef.current.offsetWidth - 56)
  }, [])

  const handlePointerDown = (e) => {
    if (disabled || confirmed) return
    setDragging(true)
    startX.current = e.clientX - offset
    if (thumbRef.current) {
      try {
        thumbRef.current.setPointerCapture(e.pointerId)
      } catch (err) {
        // Fallback
      }
    }
  }

  const handlePointerMove = (e) => {
    if (!dragging || disabled || confirmed) return
    const max = maxOffset()
    const newOffset = Math.max(0, Math.min(e.clientX - startX.current, max))
    setOffset(newOffset)
  }

  const handlePointerUp = (e) => {
    if (!dragging || disabled || confirmed) return
    setDragging(false)
    if (thumbRef.current) {
      try {
        thumbRef.current.releasePointerCapture(e.pointerId)
      } catch (err) {
        // Fallback
      }
    }

    const max = maxOffset()
    if (offset >= max * 0.8) {
      setOffset(max)
      setConfirmed(true)
      onConfirm?.()
    } else {
      setOffset(0)
    }
  }

  const max = maxOffset()
  const progressRatio = Math.min(1, Math.max(0, offset / (max || 1)))
  const labelOpacity = Math.max(0, 1 - progressRatio * 1.5)

  return (
    <div
      ref={trackRef}
      className={`relative w-full h-14 rounded-2xl overflow-hidden select-none touch-none flex items-center shadow-lg transition-all duration-300 ${
        confirmed
          ? 'bg-emerald-500 shadow-emerald-500/30'
          : 'bg-slate-900 border border-slate-800 shadow-orange-500/10'
      }`}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      {/* Glowing Filled Trail */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-75"
        style={{
          width: confirmed ? '100%' : `${offset + 28}px`,
          opacity: confirmed ? 1 : 0.85,
        }}
      />

      {/* Swipe Fading Label */}
      <div
        className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none transition-opacity duration-150"
        style={{ opacity: confirmed ? 1 : labelOpacity }}
      >
        <span className="text-sm font-bold text-white tracking-wide uppercase">
          {confirmed ? 'Order Placed!' : label}
        </span>
        {!confirmed && <ChevronsRight size={18} className="text-amber-300 animate-pulse" />}
      </div>

      {/* Draggable Handle */}
      <div
        ref={thumbRef}
        className={`absolute left-1 top-1 bottom-1 w-12 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md z-10 transition-transform ${
          dragging ? 'scale-105' : ''
        } ${confirmed ? 'bg-white text-emerald-600' : 'bg-white text-orange-500 hover:scale-102'}`}
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {confirmed ? (
          <Check size={22} className="text-emerald-600 animate-bounce" />
        ) : (
          <ChevronRight size={24} className="text-orange-500" />
        )}
      </div>
    </div>
  )
}
