import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { raised, sunken, windowShadow } from '../utils/win95'
import Win95Button from './win95/Button'

const FORTUNES = [
  'A bug in time saves nine more bugs.',
  'Even the smallest bug can lead to big rewards.',
  'Today is a good day to squash a bug.',
  'Squashed bugs smell like victory.',
  'Debugging: because real bugs have feelings too.',
  'Every bug you find hides two more.',
]

export default function FortuneCookie() {
  const [fortune, setFortune] = useState('')

  const randomFortune = () => {
    const msg = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
    setFortune(msg)
  }

  const speakFortune = () => {
    if (fortune) {
      const utter = new SpeechSynthesisUtterance(fortune)
      window.speechSynthesis.speak(utter)
    }
  }

  useEffect(() => {
    randomFortune()
  }, [])

  return (
    <div
      className={`mt-2 text-center bg-[#C0C0C0] p-4 ${raised} ${windowShadow} rounded`}
    >
      <motion.p
        key={fortune}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`text-sm mb-2 px-2 py-1 bg-white inline-block ${sunken}`}
      >
        🥠 {fortune}
      </motion.p>
      <div className="flex justify-center gap-2 mt-2">
        <Win95Button
          onClick={randomFortune}
          className={`px-2 py-1 bg-[#E0E0E0] ${raised} hover:bg-[#D0D0D0]`}
        >
          New Fortune
        </Win95Button>
        <Win95Button
          onClick={speakFortune}
          className={`px-2 py-1 bg-[#E0E0E0] ${raised} hover:bg-[#D0D0D0]`}
        >
          🔈 Read Aloud
        </Win95Button>
      </div>
    </div>
  )
}
