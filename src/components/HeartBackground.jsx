import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../context/ContentContext'
import {
  createFloatingHearts,
  getHeartCount,
  heartColor,
  heartGlowShadow,
} from '../utils/heartVisuals'

function HeartBackground({ className = '' }) {
  useContent()
  const heartsCache = useRef({ count: 0, hearts: [] })
  const [count, setCount] = useState(() => getHeartCount())

  useEffect(() => {
    const update = () => setCount(getHeartCount())
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 640px)')

    motionQuery.addEventListener('change', update)
    mobileQuery.addEventListener('change', update)
    update()

    return () => {
      motionQuery.removeEventListener('change', update)
      mobileQuery.removeEventListener('change', update)
    }
  }, [])

  const hearts = useMemo(() => {
    if (count <= 0) {
      heartsCache.current = { count: 0, hearts: [] }
      return []
    }

    if (
      heartsCache.current.count === count &&
      heartsCache.current.hearts.length > 0
    ) {
      return heartsCache.current.hearts
    }

    const created = createFloatingHearts(count)
    heartsCache.current = { count, hearts: created }
    return created
  }, [count])

  if (hearts.length === 0) return null

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="absolute select-none will-change-transform"
          style={{
            left: heart.left,
            bottom: '-4rem',
            fontSize: `${heart.size}px`,
            color: heartColor(heart.opacity),
            textShadow: heartGlowShadow(),
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '-125vh',
            opacity: [0, heart.opacity, heart.opacity * 0.9, heart.opacity * 0.45, 0],
            x: [0, heart.drift * 0.35, heart.drift],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: 'linear',
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}

export default memo(HeartBackground)
