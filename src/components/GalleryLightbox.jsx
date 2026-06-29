import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { formatDateLong } from '../utils/formatDate'
import { useState } from 'react'

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? -100 : direction < 0 ? 100 : 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? 100 : direction < 0 ? -100 : 0,
    opacity: 0,
  }),
}

export default function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onIndexChange,
}) {
  const dragThreshold = 60
  const [direction, setDirection] = useState(0) // 1 = next, -1 = prev
  
  const item = items[activeIndex]
  if (!item) return null

  const formattedDate = item.date ? formatDateLong(item.date) : null
  const hasCaption = Boolean(formattedDate || item.text?.trim())

  const goNext = () => {
    if (activeIndex < items.length - 1) {
      setDirection(1)
      onIndexChange(activeIndex + 1)
    }
  }

  const goPrev = () => {
    if (activeIndex > 0) {
      setDirection(-1)
      onIndexChange(activeIndex - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-sm md:max-w-md bg-white/95 backdrop-blur-md border border-rose-100 rounded-3xl p-5 shadow-2xl flex flex-col pointer-events-auto gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Top info and Close button) */}
        <div className="flex shrink-0 items-center justify-between w-full h-8">
          <p className="text-xs font-semibold text-rose-400">
            {activeIndex + 1} / {items.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors shadow-sm"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="relative flex flex-col w-full">
          {/* Navigation Buttons inside the card overlay */}
          <button
            type="button"
            onClick={goNext}
            disabled={activeIndex === items.length - 1}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 hover:bg-white text-rose-500 shadow-md disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            aria-label="التالي"
          >
            <ChevronLeft size={20} />
          </button>

          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={item.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -dragThreshold) {
                  goPrev()
                } else if (info.offset.x > dragThreshold) {
                  goNext()
                }
              }}
              className="flex w-full flex-col items-center"
            >
              {/* Image Container with auto height adjustment */}
              <div className="w-full flex justify-center py-1">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.text || 'ذكرى'}
                    className="theme-shadow-image w-full h-auto max-h-[45dvh] object-contain rounded-2xl border border-rose-100/50 shadow-sm"
                    style={{ objectPosition: item.objectPosition || 'center' }}
                    draggable={false}
                  />
                ) : (
                  <div className="flex aspect-square w-full max-w-[240px] items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 text-5xl text-rose-300">
                    ♥
                  </div>
                )}
              </div>

              {/* Caption (Standard layout, no wide space) */}
              {hasCaption && (
                <div className="w-full text-center mt-3 px-2">
                  {formattedDate && (
                    <p className="text-xs font-semibold text-rose-400 mb-1">{formattedDate}</p>
                  )}
                  {item.text?.trim() && (
                    <p className="text-sm md:text-base leading-relaxed text-rose-800" dir="rtl">
                      {item.text}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 hover:bg-white text-rose-500 shadow-md disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            aria-label="السابق"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
