import { useState, useEffect } from 'react'
import { apiLoadingEmitter } from '../api'
// import Loader from './Loader'

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
      <div className="h-1 w-full overflow-hidden bg-slate-950/40">
        <div className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 animate-pulse w-full origin-left duration-300 shadow-[0_0_12px_#f97316]"></div>
      </div>
    </div>

    // <Loader
    //   fullScreen={true}
    //   overlay={true}
    //   text="Loading..."
    //   subtext="Please wait a moment"
    // />
  )
}
