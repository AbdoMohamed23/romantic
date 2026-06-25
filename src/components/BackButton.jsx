import { ChevronRight } from 'lucide-react'

export default function BackButton({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="رجوع للصفحة السابقة"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/80 text-rose-500 shadow-[0_4px_16px_-4px_rgb(var(--theme-rgb)/0.35)] backdrop-blur-sm transition hover:bg-white hover:text-rose-600 active:scale-95 ${className}`.trim()}
    >
      <ChevronRight size={18} strokeWidth={2.5} />
    </button>
  )
}
