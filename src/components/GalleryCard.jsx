import { motion } from 'framer-motion'

function formatDate(dateString) {
  if (!dateString) return null

  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2']

export default function GalleryCard({ memory, index = 0, onOpen }) {
  const formattedDate = formatDate(memory.date)
  const rotation = rotations[index % rotations.length]

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      initial={{ opacity: 0, y: 24, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className={`group w-full text-start ${index % 3 === 1 ? 'sm:translate-y-4' : ''}`}
    >
      <article
        className={`polaroid-shadow overflow-hidden rounded-sm bg-white p-2 pb-5 transition-transform duration-300 ${rotation} group-hover:rotate-0`}
      >
        <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-blush-100 to-rose-100">
          {memory.image ? (
            <img
              src={memory.image}
              alt={memory.text}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-rose-300/80">
              <span className="text-3xl">♥</span>
              <span className="text-[10px]">ذكرى جميلة</span>
            </div>
          )}
        </div>

        <div className="mt-3 px-1">
          {formattedDate ? (
            <p className="text-[10px] text-rose-400 sm:text-xs">{formattedDate}</p>
          ) : null}
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-rose-700 sm:text-sm">
            {memory.text}
          </p>
        </div>
      </article>
    </motion.button>
  )
}
