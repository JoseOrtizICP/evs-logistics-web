import { motion } from 'framer-motion'

const ScrollReveal = ({ children, direction = 'up', delay = 0, duration = 0.6, style = {} }) => {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 }
  }

  const { x, y } = directions[direction] || directions.up

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
