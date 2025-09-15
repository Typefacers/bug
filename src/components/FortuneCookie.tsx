import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Frame } from 'react95'
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
    <Frame
      variant="window"
      shadow
      className="mt-2 rounded bg-[#c6c6c6] p-4 text-center"
    >
      <Frame
        variant="well"
        className="mx-auto mb-3 inline-block bg-white px-3 py-2"
      >
        <motion.p
          key={fortune}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm"
        >
          🥠 {fortune}
        </motion.p>
      </Frame>
      <div className="mt-2 flex justify-center gap-2">
        <Win95Button size="sm" onClick={randomFortune}>
          New Fortune
        </Win95Button>
        <Win95Button size="sm" onClick={speakFortune}>
          🔈 Read Aloud
        </Win95Button>
      </div>
    </Frame>
  )
}
