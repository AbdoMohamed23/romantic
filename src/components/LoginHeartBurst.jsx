import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { config } from '../data/config'
import { getLoginRevealHeartCount } from '../utils/heartVisuals'
import {
  createLoginHeartParticles,
  drawLoginHeartFrame,
  isLoginHeartExitComplete,
} from '../utils/loginHeartCanvas'

const { loginReveal } = config.animations

export default function LoginHeartBurst({ onCovered, onComplete, canExit }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const startTimeRef = useRef(0)
  const exitStartRef = useRef(null)
  const rafRef = useRef(0)
  const [phase, setPhase] = useState('burst')
  const onCoveredRef = useRef(onCovered)
  const onCompleteRef = useRef(onComplete)
  const coveredRef = useRef(false)
  const finishedRef = useRef(false)

  onCoveredRef.current = onCovered
  onCompleteRef.current = onComplete

  const markCovered = () => {
    if (coveredRef.current) return
    coveredRef.current = true
    onCoveredRef.current?.()
  }

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    onCompleteRef.current?.()
  }

  useEffect(() => {
    document.documentElement.classList.add('login-reveal-active')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      markCovered()
      finish()
      return () => {
        document.documentElement.classList.remove('login-reveal-active')
      }
    }

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return undefined

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    particlesRef.current = createLoginHeartParticles(
      getLoginRevealHeartCount(),
      width,
      height,
    )
    startTimeRef.current = performance.now()

    const loop = (now) => {
      drawLoginHeartFrame(
        ctx,
        particlesRef.current,
        now,
        startTimeRef.current,
        exitStartRef.current,
        width,
        height,
      )

      if (
        exitStartRef.current !== null &&
        isLoginHeartExitComplete(particlesRef.current, now, exitStartRef.current)
      ) {
        finish()
        return
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    const coverTimer = window.setTimeout(() => {
      markCovered()
      setPhase('hold')
    }, loginReveal.burstDuration * 1000)

    const failsafeTimer = window.setTimeout(
      finish,
      (loginReveal.burstDuration + loginReveal.exitDuration) * 1000 + 4000,
    )

    window.addEventListener('resize', resize)

    return () => {
      document.documentElement.classList.remove('login-reveal-active')
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(rafRef.current)
      window.clearTimeout(coverTimer)
      window.clearTimeout(failsafeTimer)
    }
  }, [])

  useEffect(() => {
    if (phase === 'hold' && canExit) {
      exitStartRef.current = performance.now()
      setPhase('exit')
    }
  }, [phase, canExit])

  return createPortal(
    <div
      className={`login-heart-burst${phase === 'exit' ? ' login-heart-burst--exit' : ''}`}
      style={{ '--login-exit-duration': `${loginReveal.exitDuration}s` }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="login-heart-burst__canvas" />
    </div>,
    document.body,
  )
}
