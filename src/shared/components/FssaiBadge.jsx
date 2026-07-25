export default function FssaiBadge({ isVeg, size = 16, className = '' }) {
  if (isVeg) {
    return (
      <span
        title="Vegetarian"
        className={`inline-flex items-center justify-center border-2 border-emerald-600 bg-white p-[2px] rounded-[4px] shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="w-full h-full bg-emerald-600 rounded-full"></span>
      </span>
    )
  }

  return (
    <span
      title="Non-Vegetarian"
      className={`inline-flex items-center justify-center border-2 border-red-600 bg-white p-[2px] rounded-[4px] shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="w-full h-full bg-red-600 rounded-full"></span>
    </span>
  )
}
