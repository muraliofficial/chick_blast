import { STATUS_LABELS } from '../constants'
import { Clock, Utensils, PackageCheck, CheckCircle2, XCircle } from 'lucide-react'

const STATUS_CONFIG = {
  new: {
    icon: Clock,
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200/80',
    dotGlow: 'bg-sky-500',
    iconBg: 'bg-sky-100 text-sky-700',
  },
  preparing: {
    icon: Utensils,
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200/80',
    dotGlow: 'bg-amber-500',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  packed: {
    icon: PackageCheck,
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
    dotGlow: 'bg-indigo-500',
    iconBg: 'bg-indigo-100 text-indigo-700',
  },
  delivered: {
    icon: CheckCircle2,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    dotGlow: 'bg-emerald-500',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
  cancelled: {
    icon: XCircle,
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200/80',
    dotGlow: 'bg-rose-500',
    iconBg: 'bg-rose-100 text-rose-700',
  },
}

export default function StatusPill({ status, className = '' }) {
  const label = STATUS_LABELS[status] || status
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.new
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl text-xs font-black border backdrop-blur-md transition-all duration-200 select-none shadow-2xs ${config.badgeBg} ${className}`}
    >
      <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${config.iconBg} shrink-0`}>
        <Icon size={12} className="stroke-[2.5]" />
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotGlow} shrink-0`} />
        <span className="tracking-wider uppercase text-[10px] font-extrabold truncate">{label}</span>
      </div>
    </div>
  )
}
