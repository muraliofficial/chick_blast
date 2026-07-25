import { useState, useEffect } from 'react'
import { apiLoadingEmitter } from '../api'

export default function ApiLoader() {
  const [loadingCount, setLoadingCount] = useState(0)

  useEffect(() => {
    const unsub = apiLoadingEmitter.subscribe((count) => {
      setLoadingCount(count)
    })
    return unsub
  }, [])

  if (loadingCount <= 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      {/* Top animated gradient progress line */}
      <div className="h-1 w-full overflow-hidden bg-orange-100">
        <div className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 animate-[pulse_1s_infinite] w-full origin-left transform duration-300"></div>
      </div>
      
      {/* Floating subtle loader toast */}
      <div className="fixed bottom-20 right-5 md:bottom-6 md:right-6 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 animate-bounce pointer-events-auto">
        <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold tracking-wide">Processing...</span>
      </div>
    </div>
  )
}
