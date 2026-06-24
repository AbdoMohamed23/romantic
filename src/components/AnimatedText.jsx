import { motion } from 'framer-motion'

export default function AnimatedText({
  text,
  className = '',
  as: Component = 'p',
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Component className={className}>{text}</Component>
    </motion.div>
  )
}
