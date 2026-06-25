import { config } from '../data/config'

export function pickHeartSize() {
  const roll = Math.random()
  if (roll < 0.08) return 64 + Math.random() * 56
  if (roll < 0.2) return 40 + Math.random() * 28
  if (roll < 0.45) return 22 + Math.random() * 20
  return 12 + Math.random() * 14
}

export function pickHeartOpacity() {
  const { opacityMin, opacityMax } = config.hearts
  return opacityMin + Math.random() * (opacityMax - opacityMin)
}

export function heartColor(opacity) {
  const { rgb } = config.hearts
  return `rgba(${rgb}, ${opacity})`
}

export function createStaticHearts(count) {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: 1 + Math.random() * 98,
    top: Math.random() * 100,
    size: pickHeartSize(),
    opacity: pickHeartOpacity(),
    delay: Math.random() * 0.7,
  }))
}

export function createFloatingHearts(count) {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: `${1 + Math.random() * 98}%`,
    size: pickHeartSize(),
    opacity: pickHeartOpacity(),
    delay: Math.random() * 10,
    duration: 9 + Math.random() * 10,
    drift: (Math.random() - 0.5) * 70,
  }))
}

export function getHeartCount() {
  if (typeof window === 'undefined') return config.hearts.count

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (isReducedMotion) return 0

  const isMobile = window.matchMedia('(max-width: 640px)').matches
  return isMobile
    ? Math.round(config.hearts.count * config.hearts.mobileRatio)
    : config.hearts.count
}
