import { formatDateLong } from '../utils/formatDate'

const TILTS = ['-rotate-[2.5deg]', 'rotate-[2.5deg]', '-rotate-[1.5deg]', 'rotate-[3deg]']

export default function GalleryCard({ item, index = 0, onOpen }) {
  const formattedDate = item.date ? formatDateLong(item.date) : null
  const tilt = TILTS[index % TILTS.length]

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="group w-full text-center transition active:scale-[0.98]"
    >
      <article
        className={`polaroid-shadow mx-auto w-full overflow-hidden rounded-sm bg-white p-2 pb-2.5 transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-[1.02] ${tilt}`}
      >
        <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-blush-100 to-rose-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.text || 'ذكرى'}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-rose-300/80">
              <span className="text-3xl">♥</span>
            </div>
          )}
        </div>

        {(formattedDate || item.text) ? (
          <div className="mt-1.5 px-1 text-center">
            {formattedDate ? (
              <p className="text-[10px] text-rose-400 sm:text-xs">{formattedDate}</p>
            ) : null}
            {item.text ? (
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-rose-700 sm:text-sm">
                {item.text}
              </p>
            ) : null}
          </div>
        ) : null}
      </article>
    </button>
  )
}
