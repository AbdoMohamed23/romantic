import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GalleryCard from '../components/GalleryCard'
import GalleryLightbox from '../components/GalleryLightbox'
import NextButton from '../components/NextButton'
import { useContent } from '../context/ContentContext'

export default function Gallery() {
  const navigate = useNavigate()
  const { content } = useContent()
  const { gallery, galleryItems = [] } = content
  const [lightboxIndex, setLightboxIndex] = useState(null)

  return (
    <section className="mx-auto w-full pb-4">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6 text-center"
      >
        <p className="text-xs font-medium text-rose-400">{gallery.eyebrow}</p>
        <h1 className="font-display mt-2 text-3xl font-bold text-rose-900">
          {gallery.title}
        </h1>
      </motion.header>

      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        {galleryItems.map((item, index) => (
          <GalleryCard
            key={item.id}
            memory={item}
            index={index}
            onOpen={setLightboxIndex}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="mt-10"
      >
        <NextButton onClick={() => navigate('/final')}>
          {gallery.finalButton}
        </NextButton>
      </motion.div>

      <AnimatePresence>
        {lightboxIndex !== null ? (
          <GalleryLightbox
            memories={galleryItems}
            activeIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
          />
        ) : null}
      </AnimatePresence>
    </section>
  )
}
