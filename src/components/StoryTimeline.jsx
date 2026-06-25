import { formatDateLong } from '../utils/formatDate'
import { RevealItem } from './Reveal'

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

function DateBadge({ date, highlight = false, className = '' }) {
  if (!date) return null

  const formatted = formatDateLong(date)
  if (!formatted) return null

  return (
    <div className={`flex justify-center ${className}`}>
      <span
        className={`rounded-full px-4 py-1.5 text-xs font-medium ${
          highlight
            ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md shadow-rose-200/60'
            : 'bg-rose-50 text-rose-500 ring-1 ring-rose-100'
        }`}
      >
        {formatted}
      </span>
    </div>
  )
}

export function TimelineMilestone({
  label,
  date,
  children,
  showConnector = true,
}) {
  return (
    <>
      <RevealItem as="div" role="listitem" className="mx-auto w-full">
        <article className="glass-card w-full rounded-2xl p-5 text-center sm:p-6">
          <DateBadge date={date} className="mb-4" />
          <p className="text-sm font-medium text-rose-400">{label}</p>
          <div className="mt-4 text-sm leading-relaxed text-rose-600">{children}</div>
        </article>
      </RevealItem>
      {showConnector ? <CardConnector /> : null}
    </>
  )
}

export function TimelineLoveConfession({
  label,
  date,
  message,
  showConnector = true,
}) {
  return (
    <>
      <RevealItem as="div" role="listitem" className="mx-auto w-full">
        <article className="w-full rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50 via-pink-50 to-white p-5 text-center shadow-[0_8px_24px_-8px_rgba(244,114,182,0.3)] sm:p-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(244,114,182,0.35)]">
            <span className="text-xl text-rose-500">♥</span>
          </div>

          <DateBadge date={date} highlight className="mb-4" />
          <p className="text-sm font-medium text-rose-400">{label}</p>
          <p className="mt-4 text-sm leading-relaxed text-rose-600">{message}</p>
        </article>
      </RevealItem>
      {showConnector ? <CardConnector /> : null}
    </>
  )
}

function hasMemoryContent(memory) {
  return Boolean(
    memory.image?.trim() || memory.date || memory.text?.trim(),
  )
}

export function isVisibleMemory(memory) {
  return hasMemoryContent(memory)
}

export function TimelineMemoryCard({ memory, showConnector = true }) {
  const hasImage = Boolean(memory.image?.trim())
  const hasDate = Boolean(memory.date)
  const hasText = Boolean(memory.text?.trim())

  if (!hasImage && !hasDate && !hasText) return null

  const caption = hasDate || hasText

  return (
    <>
      <RevealItem as="div" role="listitem" className="mx-auto w-full">
        {hasImage ? (
          <article className="w-full overflow-hidden rounded-2xl border border-rose-200/60 bg-white text-center shadow-[0_8px_24px_-8px_rgba(244,114,182,0.3)]">
            <div className="aspect-[4/3] w-full bg-gradient-to-br from-blush-100 to-rose-100">
              <img
                src={memory.image}
                alt={hasText ? memory.text : 'ذكرى'}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            {caption ? (
              <div className="px-4 py-3">
                <DateBadge date={hasDate ? memory.date : null} className="mb-1.5" />
                {hasText ? (
                  <p className="text-sm leading-relaxed text-rose-700">{memory.text}</p>
                ) : null}
              </div>
            ) : null}
          </article>
        ) : (
          <article className="glass-card w-full rounded-2xl p-5 text-center sm:p-6">
            <DateBadge date={hasDate ? memory.date : null} className="mb-3" />
            {hasText ? (
              <p className="text-sm leading-relaxed text-rose-700">{memory.text}</p>
            ) : null}
          </article>
        )}
      </RevealItem>
      {showConnector ? <CardConnector /> : null}
    </>
  )
}

export default function StoryTimeline({ children }) {
  return (
    <div
      role="list"
      className="mx-auto flex w-full flex-col items-center gap-2"
    >
      {children}
    </div>
  )
}
