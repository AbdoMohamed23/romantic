export default function GalleryCard({ item, index = 0, onOpen }) {
  const formattedDate = item.date
    ? new Intl.DateTimeFormat('ar-EG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(item.date))
    : null

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="group w-full max-w-[11rem] text-center transition active:scale-[0.98] sm:max-w-none"
    >
      <article className="polaroid-shadow mx-auto overflow-hidden rounded-sm bg-white p-2 pb-5 transition-transform duration-300 group-hover:scale-[1.02]">
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

        <div className="mt-3 px-1 text-center">
          {formattedDate ? (
            <p className="text-[10px] text-rose-400 sm:text-xs">{formattedDate}</p>
          ) : null}
          {item.text ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-rose-700 sm:text-sm">
              {item.text}
            </p>
          ) : null}
        </div>
      </article>
    </button>
  )
}
