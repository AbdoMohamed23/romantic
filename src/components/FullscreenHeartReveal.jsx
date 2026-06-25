import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { config } from '../data/config'
import {
  createStaticHearts,
  getHeartCount,
  heartColor,
} from '../utils/heartVisuals'

const { welcome: welcomeReveal } = config.animations

export default function FullscreenHeartReveal({ onComplete }) {
  const [opening, setOpening] = useState(false)
  const overlayHearts = useMemo(
    () => createStaticHearts(getHeartCount() || config.hearts.count),
    [],
  )

  useEffect(() => {
    const openTimer = window.setTimeout(() => {
      setOpening(true)
    }, welcomeReveal.holdDuration * 1000)

    const doneTimer = window.setTimeout(() => {
      onComplete?.()
    }, (welcomeReveal.holdDuration + welcomeReveal.openDuration) * 1000)

    return () => {
      window.clearTimeout(openTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onComplete])

  return createPortal(
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      style={{
        width: '100vw',
        height: '100dvh',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      aria-hidden="true"
      initial={{ opacity: 1, scale: 1 }}
      animate={
        opening
          ? { opacity: 0, scale: 1.15 }
          : { opacity: 1, scale: 1 }
      }
      transition={{
        duration: welcomeReveal.openDuration,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-rose-100 via-pink-50 to-white" />

      {overlayHearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="absolute select-none"
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            fontSize: `${heart.size}px`,
            color: heartColor(heart.opacity),
            textShadow: '0 0 14px rgba(251, 113, 133, 0.4)',
          }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: heart.opacity, scale: 1 }}
          transition={{ duration: 0.55, delay: heart.delay }}
        >
          ♥
        </motion.span>
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1.1, 1], opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-36 w-36 items-center justify-center rounded-full bg-white/65 shadow-[0_0_80px_rgba(251,113,133,0.45)] backdrop-blur-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl text-rose-400"
          >
            ♥
          </motion.div>
        </motion.div>
      </div>
    </motion.div>,
    document.body,
  )
}
