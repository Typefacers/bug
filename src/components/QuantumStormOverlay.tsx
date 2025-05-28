import { AnimatePresence, motion } from 'framer-motion'

export default function QuantumStormOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/60 text-white"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            transition: { repeat: Infinity, duration: 0.5 },
          }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-4xl font-bold"
          >
            Quantum Storm!
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
