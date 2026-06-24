import { motion } from 'framer-motion'
import { config } from '../data/config'

const { page } = config.animations

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
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
