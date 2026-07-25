import { X } from 'lucide-react'

export default function GradientModal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null

  return (
    <div className="modal-gradient-bg" onClick={onClose}>
      <div
        className={`modal-content ${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900 m-0">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer border-none bg-transparent"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
