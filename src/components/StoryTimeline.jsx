import { formatDateLong } from '../utils/formatDate'
import { RevealGroup, RevealItem } from './Reveal'

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
  if (!date) return null

  return (
    <div className="mb-4 flex justify-center">
      <span
        className={`rounded-full px-4 py-1.5 text-xs font-medium ${
          highlight
            ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md shadow-rose-200/60'
            : 'bg-rose-50 text-rose-500 ring-1 ring-rose-100'
        }`}
      >
        {formatDateLong(date)}
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
      <RevealItem as="li" className="mx-auto w-full">
        <article className="glass-card w-full rounded-2xl p-5 text-center sm:p-6">
          <DateBadge date={date} />
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
      <RevealItem as="li" className="mx-auto w-full">
        <article className="w-full rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50 via-pink-50 to-white p-5 text-center shadow-[0_8px_24px_-8px_rgba(244,114,182,0.3)] sm:p-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(244,114,182,0.35)]">
            <span className="text-xl text-rose-500">♥</span>
          </div>

          <DateBadge date={date} highlight />
          <p className="text-sm font-medium text-rose-400">{label}</p>
          <p className="mt-4 text-sm leading-relaxed text-rose-600">{message}</p>
        </article>
      </RevealItem>
      {showConnector ? <CardConnector /> : null}
    </>
  )
}

export function TimelineMemoryCard({ memory, showConnector = true }) {
  const hasImage = Boolean(memory.image)

  return (
    <>
      <RevealItem as="li" className="mx-auto w-full">
        {hasImage ? (
          <article className="polaroid-shadow mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-white text-center">
            <div className="aspect-[4/3] bg-gradient-to-br from-blush-100 to-rose-100">
              <img
                src={memory.image}
                alt={memory.text}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-5">
              <DateBadge date={memory.date} />
              <p className="mt-3 text-sm leading-relaxed text-rose-700">{memory.text}</p>
            </div>
          </article>
        ) : (
          <article className="glass-card mx-auto w-full max-w-sm rounded-2xl p-5 text-center sm:p-6">
            <DateBadge date={memory.date} />
            <p className="text-sm leading-relaxed text-rose-700">{memory.text}</p>
          </article>
        )}
      </RevealItem>
      {showConnector ? <CardConnector /> : null}
    </>
  )
}

export default function StoryTimeline({ children }) {
  return (
    <RevealGroup
      as="ol"
      className="mx-auto flex w-full flex-col items-center gap-2"
    >
      {children}
    </RevealGroup>
  )
}
