import { ExternalLink, Code2, Heart } from 'lucide-react'
import logoImg from '../../assets/logo.png'

export const DEVELOPER_INFO = {
  name: 'Murali',
  portfolioUrl: 'https://my-self-murali.vercel.app/',
  version: 'v1.0.1',
}

export default function DeveloperSignature({ variant = 'footer', className = '' }) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-100/80 pt-3 mt-3 px-1 ${className}`}>
        <div className="flex items-center gap-1">
          <span>Dev:</span>
          <a
            href={DEVELOPER_INFO.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-0.5 no-underline"
          >
            <span>{DEVELOPER_INFO.name}</span>
            <ExternalLink size={10} />
          </a>
        </div>
        <span className="font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-semibold">
          {DEVELOPER_INFO.version}
        </span>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`p-3 mx-2 my-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Developed By</span>
          <span className="text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/30">
            {DEVELOPER_INFO.version}
          </span>
        </div>
        <a
          href={DEVELOPER_INFO.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-white font-bold hover:text-orange-400 transition-colors no-underline group"
        >
          <span className="flex items-center gap-1.5">
            <Code2 size={14} className="text-orange-500" />
            <span>{DEVELOPER_INFO.name}</span>
          </span>
          <ExternalLink size={12} className="text-slate-400 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
        </a>
      </div>
    )
  }

  // Default website footer variant - Modern Minimalist Card Banner
  return (
    <footer className={`mt-6 mb-20 md:mb-6 px-4 max-w-6xl mx-auto ${className}`}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10 border border-orange-200/80 p-4 sm:p-5 shadow-xs backdrop-blur-sm">
        {/* Subtle Decorative Background Glows */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Brand & Version Info */}
          <div className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="Chick Blast Logo"
              className="w-9 h-9 object-contain drop-shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="font-black text-sm text-gray-900 tracking-tight">Chick Blast</span>
                <span className="text-[10px] font-extrabold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                  {DEVELOPER_INFO.version}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium m-0 mt-0.5">
                Crispy &amp; Delicious Food Ordering Application
              </p>
            </div>
          </div>

          {/* Developer Credit & Portfolio Link */}
          <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-2xl border border-orange-100 shadow-2xs">
            <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
              Crafted with <Heart size={13} className="text-red-500 fill-red-500 animate-pulse" /> by
            </span>
            <a
              href={DEVELOPER_INFO.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs no-underline shadow-sm shadow-orange-500/20 active:scale-95 transition-all group"
            >
              <span>{DEVELOPER_INFO.name}</span>
              <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
