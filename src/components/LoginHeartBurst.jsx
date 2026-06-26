import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { config } from '../data/config'
import {
  createDenseCoverHearts,
  getLoginRevealHeartCount,
  heartColor,
  heartGlowShadow,
} from '../utils/heartVisuals'

const { loginReveal } = config.animations

export default function LoginHeartBurst({ onCovered, onComplete, canExit }) {
  const [phase, setPhase] = useState('burst')
  const onCoveredRef = useRef(onCovered)
  const onCompleteRef = useRef(onComplete)
  const coveredRef = useRef(false)
  const finishedRef = useRef(false)
  const coverHearts = useMemo(
    () => createDenseCoverHearts(getLoginRevealHeartCount()),
    [],
  )

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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      markCovered()
      finish()
      return
    }

    const coverTimer = window.setTimeout(() => {
      setPhase('covered')
      markCovered()
      setPhase('hold')
    }, loginReveal.burstDuration * 1000)

    const failsafeTimer = window.setTimeout(
      finish,
      (loginReveal.burstDuration + loginReveal.welcomeFadeDuration + loginReveal.exitDuration) *
        1000 +
        2000,
    )

    return () => {
      window.clearTimeout(coverTimer)
      window.clearTimeout(failsafeTimer)
    }
  }, [])

  useEffect(() => {
    if (phase === 'hold' && canExit) {
      setPhase('exit')
    }
  }, [phase, canExit])

  return createPortal(
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      style={{ width: '100vw', height: '100dvh' }}
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={
        phase === 'exit'
          ? { opacity: 0 }
          : { opacity: 1 }
      }
      transition={{
        duration: loginReveal.exitDuration,
        ease: [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={() => {
        if (phase === 'exit') finish()
      }}
    >
      {coverHearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="absolute select-none will-change-transform"
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            fontSize: `${heart.size}px`,
            color: heartColor(heart.opacity),
            textShadow: heartGlowShadow(),
            zIndex: 10 + heart.layer,
            rotate: `${heart.rotation}deg`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.12, 1],
            opacity: [0, heart.opacity, Math.min(1, heart.opacity + 0.1)],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          ♥
        </motion.span>
      ))}
    </motion.div>,
    document.body,
  )
}
