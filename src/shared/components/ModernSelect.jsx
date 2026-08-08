import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export default function ModernSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  label,
  iconMap = {},
  renderOption,
  className = '',
}) {
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

  const getIcon = (optVal) => {
    if (iconMap && iconMap[optVal]) return iconMap[optVal]
    return null
  }

  const currentLabel = getLabel(selectedOption)
  const currentIcon = getIcon(value)

  return (
    <div className={`relative inline-block w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border rounded-xl shadow-2xs transition-all text-sm font-semibold text-slate-800 cursor-pointer ${
          isOpen ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {currentIcon && <span className="text-base leading-none shrink-0">{currentIcon}</span>}
          <span className="truncate">{currentLabel}</span>
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-orange-500' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 z-50 max-h-60 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-md">
          {options.map((option, idx) => {
            const optVal = getValue(option)
            const optLabel = getLabel(option)
            const isSelected = optVal === value
            const optIcon = getIcon(optVal)

            return (
              <div
                key={idx}
                onClick={() => {
                  onChange(optVal)
                  setIsOpen(false)
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200/60'
                    : 'text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {optIcon && <span className="text-base leading-none shrink-0">{optIcon}</span>}
                  {renderOption ? renderOption(option) : <span className="truncate">{optLabel}</span>}
                </div>
                {isSelected && <Check size={16} className="text-orange-600 shrink-0 ml-2" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

