import { STATUS_LABELS } from '../constants'
import { Clock, Utensils, PackageCheck, CheckCircle2, XCircle } from 'lucide-react'

const STATUS_CONFIG = {
  new: {
    icon: Clock,
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dotGlow: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse',
    iconBg: 'bg-blue-100/80 text-blue-600',
  },
  preparing: {
    icon: Utensils,
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dotGlow: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse',
    iconBg: 'bg-amber-100/80 text-amber-600',
  },
  packed: {
    icon: PackageCheck,
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200/80',
    dotGlow: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    iconBg: 'bg-purple-100/80 text-purple-600',
  },
  delivered: {
    icon: CheckCircle2,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    dotGlow: 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]',
    iconBg: 'bg-emerald-100/80 text-emerald-600',
  },
  cancelled: {
    icon: XCircle,
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200/80',
    dotGlow: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
    iconBg: 'bg-rose-100/80 text-rose-600',
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
