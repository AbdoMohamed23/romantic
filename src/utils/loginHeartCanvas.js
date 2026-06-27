function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

export function createLoginHeartParticles(count, width, height) {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: -0.08 * width + Math.random() * width * 1.16,
    y: -0.08 * height + Math.random() * height * 1.16,
    size: 16 + Math.random() * 58,
    opacity: 0.42 + Math.random() * 0.52,
    rotation: (Math.random() - 0.5) * 0.65,
    delay: Math.random() * 3400,
    appearMs: 1900 + Math.random() * 2400,
    exitDelay: Math.random() * 1600,
    exitMs: 2400 + Math.random() * 2800,
    exitVx: (Math.random() - 0.5) * 0.35,
    exitVy: -0.25 - Math.random() * 0.55,
    currentOpacity: 0,
    currentScale: 0.32,
  }))
}

function readThemeRgb() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--theme-rgb')
    .trim()

  return value || '251, 113, 133'
}

function drawSoftWash(ctx, width, height, strength) {
  if (strength <= 0) return

  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.46,
    width * 0.08,
    width * 0.5,
    height * 0.5,
    width * 0.72,
  )

  gradient.addColorStop(0, `rgba(${readThemeRgb()}, ${0.1 * strength})`)
  gradient.addColorStop(0.55, `rgba(${readThemeRgb()}, ${0.05 * strength})`)
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

export function drawLoginHeartFrame(ctx, particles, now, startTime, exitStartTime, width, height) {
  const themeRgb = readThemeRgb()
  ctx.clearRect(0, 0, width, height)

  let washStrength = 0
  let visibleCount = 0

  for (const particle of particles) {
    if (exitStartTime !== null) {
      const exitElapsed = now - exitStartTime - particle.exitDelay

      if (exitElapsed < 0) {
        particle.currentOpacity = particle.opacity
        particle.currentScale = 1
      } else {
        const progress = Math.min(1, exitElapsed / particle.exitMs)
        const eased = easeInOutSine(progress)
        particle.currentOpacity = particle.opacity * (1 - eased)
        particle.currentScale = 1 - eased * 0.12
        particle.x += particle.exitVx * (1.2 + eased * 1.8)
        particle.y += particle.exitVy * (1.2 + eased * 2.4)
      }
    } else {
      const appearElapsed = now - startTime - particle.delay

      if (appearElapsed < 0) {
        particle.currentOpacity = 0
        particle.currentScale = 0.32
        continue
      }

      const progress = Math.min(1, appearElapsed / particle.appearMs)
      const eased = easeOutCubic(progress)
      particle.currentOpacity = particle.opacity * eased
      particle.currentScale = 0.32 + 0.68 * eased
      washStrength = Math.max(washStrength, eased * particle.opacity)
    }

    if (particle.currentOpacity <= 0.02) continue

    visibleCount += 1

    ctx.save()
    ctx.translate(particle.x, particle.y)
    ctx.rotate(particle.rotation)
    ctx.scale(particle.currentScale, particle.currentScale)
    ctx.font = `${particle.size}px Tajawal, Cairo, sans-serif`
    ctx.fillStyle = `rgba(${themeRgb}, ${particle.currentOpacity})`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('♥', 0, 0)
    ctx.restore()
  }

  if (exitStartTime === null && visibleCount > 0) {
    drawSoftWash(ctx, width, height, Math.min(1, washStrength + 0.12))
  }

  return visibleCount
}

export function isLoginHeartExitComplete(particles, now, exitStartTime) {
  if (exitStartTime === null) return false

  return particles.every((particle) => {
    const exitElapsed = now - exitStartTime - particle.exitDelay
    if (exitElapsed <= 0) return false
    return exitElapsed >= particle.exitMs
  })
}
