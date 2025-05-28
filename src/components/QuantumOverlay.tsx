import { motion } from 'framer-motion'
import { useBugStore } from '../store'

const QuantumOverlay: React.FC = () => {
  const quantumMode = useBugStore(s => s.quantumMode)
  if (!quantumMode) return null
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none bg-purple-800 mix-blend-screen"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        transition: { repeat: Infinity, duration: 0.3 },
      }}
    />
  )
}

export default QuantumOverlay
