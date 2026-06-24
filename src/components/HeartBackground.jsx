import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const TIERS = {
  tiny: {
    sizeMin: 6,
    sizeMax: 12,
    opacityMin: 0.1,
    opacityMax: 0.22,
    durationMin: 14,
    durationMax: 22,
    drift: 40,
  },
  small: {
    sizeMin: 12,
    sizeMax: 20,
    opacityMin: 0.14,
    opacityMax: 0.3,
    durationMin: 11,
    durationMax: 18,
    drift: 55,
  },
  medium: {
    sizeMin: 20,
    sizeMax: 34,
    opacityMin: 0.18,
    opacityMax: 0.38,
    durationMin: 8,
    durationMax: 14,
    drift: 70,
  },
  large: {
    sizeMin: 34,
    sizeMax: 52,
    opacityMin: 0.2,
    opacityMax: 0.42,
    durationMin: 7,
    durationMax: 12,
    drift: 85,
  },
  xlarge: {
    sizeMin: 64,
    sizeMax: 120,
    opacityMin: 0.12,
    opacityMax: 0.28,
    durationMin: 10,
    durationMax: 16,
    drift: 50,
  },
}

function getCounts(density, isMobile) {
  const base = isMobile
    ? { tiny: 28, small: 24, medium: 18, large: 10, xlarge: 4 }
    : { tiny: 38, small: 32, medium: 24, large: 14, xlarge: 6 }

  if (density === 'high') {
    return {
      tiny: Math.round(base.tiny * 1.5),
      small: Math.round(base.small * 1.5),
      medium: Math.round(base.medium * 1.4),
      large: Math.round(base.large * 1.4),
      xlarge: base.xlarge + 2,
    }
  }

  return base
}

function createTierHearts(tier, count) {
  const cfg = TIERS[tier]

  return Array.from({ length: count }, (_, id) => ({
    id: `${tier}-${id}`,
    tier,
    left: `${1 + Math.random() * 98}%`,
    size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
    delay: Math.random() * 12,
    duration: cfg.durationMin + Math.random() * (cfg.durationMax - cfg.durationMin),
    drift: (Math.random() - 0.5) * cfg.drift,
    opacity: cfg.opacityMin + Math.random() * (cfg.opacityMax - cfg.opacityMin),
    blur: tier === 'tiny' || tier === 'xlarge' ? 'blur-[0.5px]' : '',
  }))
}

function getDensityCounts(density) {
  if (typeof window === 'undefined') {
    return getCounts(density, false)
  }

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (isReducedMotion) {
    return { tiny: 0, small: 0, medium: 0, large: 0, xlarge: 0 }
  }

  const isMobile = window.matchMedia('(max-width: 640px)').matches
  return getCounts(density, isMobile)
}

const tierZ = { tiny: 0, small: 1, medium: 2, large: 3, xlarge: 1 }

export default function HeartBackground({ className = '', density = 'normal' }) {
  const [counts, setCounts] = useState(() => getDensityCounts(density))

  useEffect(() => {
    const update = () => setCounts(getDensityCounts(density))
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 640px)')

    motionQuery.addEventListener('change', update)
    mobileQuery.addEventListener('change', update)
    update()

    return () => {
      motionQuery.removeEventListener('change', update)
      mobileQuery.removeEventListener('change', update)
    }
  }, [density])

  const hearts = useMemo(
    () =>
      Object.entries(counts).flatMap(([tier, count]) =>
        count > 0 ? createTierHearts(tier, count) : [],
      ),
    [counts],
  )

  if (hearts.length === 0) return null

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className={`absolute select-none will-change-transform ${heart.blur}`}
          style={{
            left: heart.left,
            bottom: '-4rem',
            fontSize: `${heart.size}px`,
            zIndex: tierZ[heart.tier],
            color: `rgba(239, 100, 110, ${heart.opacity})`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '-125vh',
            opacity: [0, heart.opacity, heart.opacity * 0.5, 0],
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
