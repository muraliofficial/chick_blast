import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export default function ModernSelect({ options = [], value, onChange, placeholder = 'Select...', label }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) =>
    typeof opt === 'object' ? opt.value === value : opt === value
  )

  const getLabel = (opt) => {
    if (!opt) return placeholder
    if (typeof opt === 'object') return opt.label || opt.name || opt.value
    return opt
  }

  const getValue = (opt) => {
    if (typeof opt === 'object') return opt.value
    return opt
  }

  return (
    <div className="relative inline-block w-full" ref={containerRef}>
      {label && <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white/90 hover:bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition-all text-sm font-medium text-gray-800 cursor-pointer"
      >
        <span className="truncate">{getLabel(selectedOption)}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-orange-500' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((option, idx) => {
            const optVal = getValue(option)
            const optLabel = getLabel(option)
            const isSelected = optVal === value

            return (
              <div
                key={idx}
                onClick={() => {
                  onChange(optVal)
                  setIsOpen(false)
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                }`}
              >
                <span className="truncate">{optLabel}</span>
                {isSelected && <Check size={16} className="text-orange-500 flex-shrink-0" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
