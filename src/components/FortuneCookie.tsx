import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Frame } from 'react95'

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
    <Frame shadow className="mt-2 rounded bg-[#C0C0C0] p-4 text-center">
      <motion.div
        key={fortune}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-2 inline-block"
      >
        <Frame variant="well" className="bg-white px-2 py-1 text-sm">
          🥠 {fortune}
        </Frame>
      </motion.div>
      <div className="mt-2 flex justify-center gap-2">
        <Button onClick={randomFortune}>New Fortune</Button>
        <Button onClick={speakFortune}>🔈 Read Aloud</Button>
      </div>
    </Frame>
  )
}
