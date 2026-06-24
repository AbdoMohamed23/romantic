import { motion } from 'framer-motion'
import WordByWord from '../components/WordByWord'
import { useContent } from '../context/ContentContext'
import { config } from '../data/config'

export default function Final() {
  const { content } = useContent()
  const { final } = content

  return (
    <section className="relative mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-md flex-col items-center justify-center overflow-hidden px-2 py-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-[0_0_32px_rgba(244,114,182,0.5)]"
      >
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-2xl text-white"
        >
          ♥
        </motion.span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-10 text-xs font-medium text-rose-400"
      >
        {final.eyebrow}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="font-display relative z-10 mt-3 text-4xl font-bold text-rose-900"
      >
        {final.title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="relative z-10 mt-8 w-full rounded-3xl border border-white/60 bg-white/60 p-6 backdrop-blur-md"
      >
        <WordByWord
          text={final.text}
          wordDelay={config.animations.final.wordDelay}
          className="text-base leading-loose text-rose-700 sm:text-lg"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, type: 'spring', stiffness: 200 }}
        className="relative z-10 mt-10 text-3xl"
      >
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          ♥
        </motion.span>
      </motion.div>
    </section>
  )
}
