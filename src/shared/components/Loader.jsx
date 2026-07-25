import logoImg from '../../assets/logo.png'

export default function Loader({
  fullScreen = true,
  text = 'Loading Chick Blast...',
  subtext = 'Please wait a moment',
  size = 'md',
  showLogo = true,
  overlay = true,
}) {
  // Size mappings
  const logoSizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  }

  const ringSizes = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-44 h-44',
  }

  const containerClasses = fullScreen
    ? `fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 transition-all duration-300 ${
        overlay ? 'bg-slate-950/65 backdrop-blur-md' : 'bg-slate-900'
      }`
    : 'flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]'

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {/* Outer ambient glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/30 via-red-500/20 to-amber-500/30 blur-2xl animate-pulse" />

        {/* Outer Spinning Gradient Ring */}
        <div
          className={`${ringSizes[size]} rounded-full border-2 border-transparent border-t-orange-500 border-r-amber-400 border-b-red-500 animate-spin`}
          style={{ animationDuration: '1.5s' }}
        />

        {/* Reverse Spinning Inner Ring */}
        <div
          className={`absolute rounded-full border-2 border-dashed border-orange-400/50 animate-spin`}
          style={{
            width: size === 'sm' ? '4rem' : size === 'lg' ? '9.5rem' : '7rem',
            height: size === 'sm' ? '4rem' : size === 'lg' ? '9.5rem' : '7rem',
            animationDirection: 'reverse',
            animationDuration: '3s',
          }}
        />

        {/* Center Logo with Pulse & Drop Shadow */}
        {showLogo && (
          <div className="absolute flex items-center justify-center">
            <div className="relative flex items-center justify-center p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl animate-bounce" style={{ animationDuration: '2s' }}>
              <img
                src={logoImg}
                alt="Chick Blast Logo"
                className={`${logoSizes[size]} object-contain drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Loading Text & Animated Dots */}
      <div className="mt-6 text-center z-10 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          <h3 className="text-lg md:text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-red-400 m-0">
            {text}
          </h3>
          <span className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>

        {subtext && (
          <p className="text-xs text-slate-400 font-medium tracking-wide m-0">
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}
