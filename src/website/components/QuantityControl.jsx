import { Plus, Minus } from 'lucide-react'

/**
 * Compact Floating Badge Style Quantity & Add to Cart Button
 * Rounded pill shape with glowing orange shadow and bold uppercase ADD
 */
export default function QuantityControl({
  quantity = 0,
  onAdd,
  onIncrement,
  onDecrement,
  size = 'md', // 'sm' | 'md' | 'lg'
  addLabel = 'ADD',
  showPlusIcon = true,
  className = '',
}) {
  const handleClick = (e, callback) => {
    e.stopPropagation()
    if (callback) callback(e)
  }

  // Size configurations tailored for Compact Floating Badge
  const sizeConfig = {
    sm: {
      btnPad: 'px-3.5 py-1.5',
      fontSize: 'text-xs',
      iconSize: 13,
      stepBtnSize: 'w-6 h-6',
      stepperMinW: 'min-w-[88px]',
      stepperPad: 'p-1',
    },
    md: {
      btnPad: 'px-4.5 py-2',
      fontSize: 'text-xs sm:text-sm',
      iconSize: 14,
      stepBtnSize: 'w-7 h-7',
      stepperMinW: 'min-w-[100px]',
      stepperPad: 'p-1',
    },
    lg: {
      btnPad: 'px-7 py-3',
      fontSize: 'text-sm font-black',
      iconSize: 18,
      stepBtnSize: 'w-9 h-9',
      stepperMinW: 'min-w-[128px]',
      stepperPad: 'p-1.5',
    },
  }

  const cfg = sizeConfig[size] || sizeConfig.md

  if (quantity > 0) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center justify-between gap-1.5 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white rounded-full ${cfg.stepperPad} ${cfg.stepperMinW} shadow-md shadow-orange-500/35 border border-white/30 backdrop-blur-sm select-none transition-all duration-200 ${className}`}
      >
        <button
          type="button"
          onClick={(e) => handleClick(e, onDecrement)}
          className={`${cfg.stepBtnSize} rounded-full bg-white/20 hover:bg-white/35 active:scale-90 text-white flex items-center justify-center border-none cursor-pointer transition-all duration-150 shrink-0 shadow-2xs`}
          aria-label="Decrease quantity"
        >
          <Minus size={cfg.iconSize} className="stroke-[3]" />
        </button>

        <span className={`font-black text-center px-1.5 text-white ${cfg.fontSize} min-w-[20px] drop-shadow-xs`}>
          {quantity}
        </span>

        <button
          type="button"
          onClick={(e) => handleClick(e, onIncrement)}
          className={`${cfg.stepBtnSize} rounded-full bg-white/20 hover:bg-white/35 active:scale-90 text-white flex items-center justify-center border-none cursor-pointer transition-all duration-150 shrink-0 shadow-2xs`}
          aria-label="Increase quantity"
        >
          <Plus size={cfg.iconSize} className="stroke-[3]" />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={(e) => handleClick(e, onAdd)}
      className={`inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full ${cfg.btnPad} ${cfg.fontSize} font-black tracking-wider uppercase shadow-md shadow-orange-500/35 hover:shadow-xl hover:shadow-orange-500/50 border border-white/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer transition-all duration-200 select-none ${className}`}
    >
      {showPlusIcon && <Plus size={cfg.iconSize} className="stroke-[3]" />}
      <span className="drop-shadow-xs">{addLabel}</span>
    </button>
  )
}
