export default function NextButton({
  onClick,
  children = 'Next',
  className = '',
}) {
  return (
    <div className={`flex w-full justify-center ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 px-10 py-4 text-sm font-semibold text-white shadow-[0_10px_32px_-6px_rgba(244,114,182,0.75)] transition hover:brightness-105 active:scale-[0.98]"
      >
        <span className="font-sans tracking-wide">{children}</span>
        <span className="text-base leading-none" aria-hidden="true">
          ♥
        </span>
      </button>
    </div>
  )
}
