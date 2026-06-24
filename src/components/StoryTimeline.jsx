import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

function CardConnector() {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <div className="flex flex-col items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-red-300/70" />
        <span className="h-5 w-px bg-gradient-to-b from-red-200/80 to-transparent" />
      </div>
    </div>
  )
}

function DateBadge({ date, highlight = false }) {
  return (
    <div className="mb-4 flex justify-center">
      <span
        className={`rounded-full px-4 py-1.5 text-xs font-medium ${
          highlight
            ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md shadow-rose-200/60'
            : 'bg-rose-50 text-rose-500 ring-1 ring-rose-100'
        }`}
      >
        {formatDate(date)}
      </span>
    </div>
  )
}

export function TimelineMilestone({
  label,
  date,
  children,
  showConnector = true,
  motionVariants,
}) {
  return (
    <>
      <motion.li variants={motionVariants} className="mx-auto w-full">
        <article className="glass-card w-full rounded-2xl p-5 text-center sm:p-6">
          <DateBadge date={date} />
          <p className="text-sm font-medium text-rose-400">{label}</p>
          <div className="mt-4 text-sm leading-relaxed text-rose-600">
            {children}
          </div>
        </article>
      </motion.li>
      {showConnector ? <CardConnector /> : null}
    </>
  )
}

export function TimelineLoveConfession({
  label,
  date,
  message,
  showConnector = true,
  motionVariants,
}) {
  return (
    <>
      <motion.li variants={motionVariants} className="mx-auto w-full">
        <article className="w-full rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50 via-pink-50 to-white p-5 text-center shadow-[0_8px_24px_-8px_rgba(244,114,182,0.3)] sm:p-6">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(244,114,182,0.35)]"
          >
            <Heart size={24} className="text-rose-500" fill="currentColor" />
          </motion.div>

          <DateBadge date={date} highlight />
          <p className="text-sm font-medium text-rose-400">{label}</p>
          <p className="mt-4 text-sm leading-relaxed text-rose-600">{message}</p>
        </article>
      </motion.li>
      {showConnector ? <CardConnector /> : null}
    </>
  )
}

export function TimelineMemoryCard({
  memory,
  showConnector = true,
  motionVariants,
}) {
  return (
    <>
      <motion.li variants={motionVariants} className="mx-auto w-full">
        <article className="polaroid-shadow w-full overflow-hidden rounded-2xl bg-white text-center">
          <div className="aspect-[4/3] bg-gradient-to-br from-blush-100 to-rose-100">
            {memory.image ? (
              <img
                src={memory.image}
                alt={memory.text}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-3xl text-rose-300">
                ♥
              </div>
            )}
          </div>
          <div className="p-5">
            <p className="text-xs text-rose-400">{formatDate(memory.date)}</p>
            <p className="mt-3 text-sm leading-relaxed text-rose-700">
              {memory.text}
            </p>
          </div>
        </article>
      </motion.li>
      {showConnector ? <CardConnector /> : null}
    </>
  )
}

export default function StoryTimeline({ children }) {
  return <ol className="mx-auto flex w-full flex-col gap-2">{children}</ol>
}
