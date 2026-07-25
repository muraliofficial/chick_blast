export default function FssaiBadge({ isVeg, size = 16, className = '' }) {
  if (isVeg) {
    return (
      <span
        title="Vegetarian (FSSAI)"
        className={`inline-flex items-center justify-center border-2 border-emerald-600 bg-white p-[2px] rounded-[3px] flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="w-full h-full bg-emerald-600 rounded-full"></span>
      </span>
    )
  }

  return (
    <span
      title="Non-Vegetarian (FSSAI)"
      className={`inline-flex items-center justify-center border-2 border-red-600 bg-white p-[2px] rounded-[3px] flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className="w-0 h-0"
        style={{
          borderLeft: `${Math.max(3, size / 3.5)}px solid transparent`,
          borderRight: `${Math.max(3, size / 3.5)}px solid transparent`,
          borderBottom: `${Math.max(5, size / 1.8)}px solid #dc2626`,
        }}
      ></span>
    </span>
  )
}
