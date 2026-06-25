import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { formatDateLong } from '../utils/formatDate'

export default function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onIndexChange,
}) {
  const dragThreshold = 60
  const item = items[activeIndex]
  if (!item) return null

  const formattedDate = item.date ? formatDateLong(item.date) : null
  const hasCaption = Boolean(formattedDate || item.text?.trim())

  const goNext = () => {
    if (activeIndex < items.length - 1) onIndexChange(activeIndex + 1)
  }

  const goPrev = () => {
    if (activeIndex > 0) onIndexChange(activeIndex - 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[100] flex flex-col theme-lightbox-bg backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="flex shrink-0 items-center justify-between px-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-medium text-rose-400">
          {activeIndex + 1} / {items.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-rose-500 shadow-sm"
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 flex-col px-12 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="absolute start-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-rose-500 shadow-sm disabled:opacity-30 sm:start-2"
          aria-label="السابق"
        >
          <ChevronRight size={22} />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x > dragThreshold) goNext()
              else if (info.offset.x < -dragThreshold) goPrev()
            }}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="flex h-full min-h-0 w-full flex-col items-center"
          >
            <div className="flex min-h-0 w-full max-w-lg flex-1 items-center justify-center py-2">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.text || 'ذكرى'}
                  className="theme-shadow-image block h-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full rounded-2xl"
                  draggable={false}
                />
              ) : (
                <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 text-6xl text-rose-300">
                  ♥
                </div>
              )}
            </div>

            {hasCaption ? (
              <div
                className="w-full max-w-lg shrink-0 px-2 pt-2 text-center"
                style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
              >
                {formattedDate ? (
                  <p className="text-xs font-medium text-rose-400">{formattedDate}</p>
                ) : null}
                {item.text?.trim() ? (
                  <p
                    className={`text-base leading-snug text-rose-800 ${formattedDate ? 'mt-1' : ''}`}
                  >
                    {item.text}
                  </p>
                ) : null}
              </div>
            ) : (
              <div
                className="shrink-0"
                style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === items.length - 1}
          className="absolute end-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-rose-500 shadow-sm disabled:opacity-30 sm:end-2"
          aria-label="التالي"
        >
          <ChevronLeft size={22} />
        </button>
      </div>
    </motion.div>
  )
}
