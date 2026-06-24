import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function NextButton({
  onClick,
  children = 'Next',
  className = '',
}) {
  const [pulse, setPulse] = useState(false)

  const handleClick = () => {
    setPulse(true)
    window.setTimeout(() => {
      onClick?.()
      setPulse(false)
    }, 380)
  }

  return (
    <div className={`flex w-full justify-center ${className}`}>
      <motion.button
        type="button"
        onClick={handleClick}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04, y: -3 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        className="relative inline-flex items-center gap-2 overflow-visible rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 px-10 py-4 text-sm font-semibold text-white shadow-[0_10px_32px_-6px_rgba(244,114,182,0.75)]"
      >
        <motion.span
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
            animate={{ x: ['-120%', '120%'] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 1.2,
            }}
          />
        </motion.span>

        <AnimatePresence>
          {pulse ? (
            <>
              <motion.span
                key="ring"
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-rose-200"
                initial={{ scale: 1, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
              <motion.span
                key="heart"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-200"
                initial={{ scale: 0.3, opacity: 1 }}
                animate={{ scale: 2.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <Heart size={28} fill="currentColor" />
              </motion.span>
            </>
          ) : null}
        </AnimatePresence>

        <span className="relative z-10 font-sans tracking-wide">{children}</span>
        <Heart size={16} fill="currentColor" className="relative z-10" />
      </motion.button>
    </div>
  )
}
