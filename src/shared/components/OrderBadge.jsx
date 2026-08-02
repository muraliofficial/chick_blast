export default function OrderBadge({ orderNo, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs tracking-wider shadow-xs ${className}`}>
      <span>#{orderNo}</span>
    </div>
  )
}
