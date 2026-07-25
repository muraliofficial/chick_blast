import { STATUS_LABELS } from '../constants'
import { Sparkles, Utensils, Package, CheckCircle2, XCircle } from 'lucide-react'

const STATUS_ICONS = {
  new: Sparkles,
  preparing: Utensils,
  packed: Package,
  delivered: CheckCircle2,
  cancelled: XCircle,
}

export default function StatusPill({ status }) {
  const label = STATUS_LABELS[status] || status
  const Icon = STATUS_ICONS[status] || Sparkles

  return (
    <span className={`pill-status pill-status-${status} flex items-center gap-1.5 shadow-sm`}>
      <Icon size={14} className="flex-shrink-0" />
      <span>{label}</span>
    </span>
  )
}
