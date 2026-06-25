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
      className="fixed inset-0 z-[100] flex flex-col bg-rose-50/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-4 pt-4"
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
        className="relative flex flex-1 items-center justify-center overflow-hidden px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="absolute start-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-rose-500 shadow-sm disabled:opacity-30 sm:start-4"
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
              if (info.offset.x > dragThreshold) goPrev()
              else if (info.offset.x < -dragThreshold) goNext()
            }}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="flex max-h-[70dvh] w-full max-w-lg flex-col items-center touch-pan-y"
          >
            <div className="flex w-full items-center justify-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.text || 'ذكرى'}
                  className="max-h-[60dvh] w-auto max-w-full rounded-2xl object-contain shadow-xl shadow-rose-200/50"
                  draggable={false}
                />
              ) : (
                <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 text-6xl text-rose-300">
                  ♥
                </div>
              )}
            </div>

            {(item.date || item.text) && (
              <div className="mt-5 w-full max-w-sm px-4 text-center">
                {item.date ? (
                  <p className="text-xs text-rose-400">{formatDateLong(item.date)}</p>
                ) : null}
                {item.text ? (
                  <p className="mt-2 text-base leading-relaxed text-rose-800">
                    {item.text}
                  </p>
                ) : null}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === items.length - 1}
          className="absolute end-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-rose-500 shadow-sm disabled:opacity-30 sm:end-4"
          aria-label="التالي"
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      <div className="pb-6" />
    </motion.div>
  )
}
