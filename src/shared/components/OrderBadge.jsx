export default function OrderBadge({ orderNo, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 border border-orange-400/30 ${className}`}>
      {/* <span className="text-[10px] font-black uppercase tracking-wider text-orange-100">ORDER NO:</span> */}
      <span className="text-sm font-black tracking-wide">{orderNo}</span>
    </div>
  )
}
