import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function GradientModal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const [shouldRender, setShouldRender] = useState(false)
  const [active, setActive] = useState(false)

  // Lock background body scroll when modal is open + smooth animations
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      const timer = setTimeout(() => setActive(true), 20)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
      }
    } else {
      setActive(false)
      const timer = setTimeout(() => {
        setShouldRender(false)
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
      }, 250)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
      }
    }
  }, [isOpen])

  const handleClose = () => {
    setActive(false)
    setTimeout(() => {
      onClose?.()
    }, 250)
  }

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 transition-all duration-300 ease-out touch-none overscroll-none ${
        active
          ? 'bg-slate-950/60 backdrop-blur-md opacity-100'
          : 'bg-slate-950/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
      onWheel={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl w-full max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden transition-all duration-300 cubic-bezier(0.32,0.72,0,1) transform ${maxWidth} ${active
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-4 opacity-0'
          }`}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-white shrink-0">
          <h3 className="text-base sm:text-lg font-black text-gray-900 m-0">{title}</h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors border-none cursor-pointer flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1">{children}</div>
      </div>
    </div>
  )
}
