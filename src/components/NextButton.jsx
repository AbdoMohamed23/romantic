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
        className="inline-flex items-center rounded-t-xl border-b-2 border-rose-400 border-t-0 border-l-0 border-r-0 bg-transparent px-10 pt-3.5 pb-1 text-sm font-semibold text-rose-600 transition hover:bg-rose-50/50 hover:border-rose-500 active:scale-[0.98]"
      >
        <span className="font-sans tracking-wide">{children}</span>
      </button>
    </div>
  )
}