import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import FullscreenHeartReveal from '../components/FullscreenHeartReveal'
import NextButton from '../components/NextButton'
import WordByWord from '../components/WordByWord'
import { useContent } from '../context/ContentContext'
import { config } from '../data/config'

export default function Welcome() {
  const navigate = useNavigate()
  const [introDone, setIntroDone] = useState(false)
  const { content } = useContent()
  const { welcome } = content

  return (
    <section className="relative mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-md flex-col items-center justify-center px-3 py-8 text-center">
      {!introDone ? (
        <FullscreenHeartReveal onComplete={() => setIntroDone(true)} />
      ) : null}

      {introDone ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex w-full flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-[0_0_32px_rgba(244,114,182,0.5)]"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-2xl text-white"
            >
              ♥
            </motion.span>
          </motion.div>

          <p className="text-xs font-medium text-rose-400">{welcome.eyebrow}</p>

          <h1 className="font-display mt-3 text-4xl font-bold text-rose-900">
            {welcome.title}
          </h1>

          <div className="mt-8 w-full rounded-3xl border border-white/60 bg-white/60 p-6 backdrop-blur-md">
            <WordByWord
              text={welcome.subtitle}
              wordDelay={config.animations.final.wordDelay}
              className="text-base leading-loose text-rose-700 sm:text-lg"
            />
          </div>

          <div className="mt-10 w-full">
            <NextButton onClick={() => navigate('/story')}>
              {welcome.nextButton}
            </NextButton>
          </div>
        </motion.div>
      ) : null}
    </section>
  )
}
