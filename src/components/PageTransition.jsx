import { motion } from 'framer-motion'
import { config } from '../data/config'

const { page } = config.animations

const pageVariants = {
  initial: {
    opacity: 0,
    y: 28,
    scale: 0.97,
    filter: 'blur(6px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    filter: 'blur(4px)',
  },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: page.duration,
        ease: page.ease,
      }}
      className="mx-auto w-full max-w-lg"
    >
      {children}
    </motion.div>
  )
}
