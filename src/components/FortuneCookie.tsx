import { useEffect, useState } from 'react'
import { raised } from '../utils/win95'

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
    <div className={`mt-2 text-center bg-[#C0C0C0] p-2 ${raised}`}>
      <p className="text-sm">🥠 {fortune}</p>
      <div className="flex justify-center gap-2 mt-2">
        <button
          onClick={randomFortune}
          className={`px-2 py-1 bg-[#E0E0E0] ${raised} hover:bg-[#D0D0D0]`}
        >
          New Fortune
        </button>
        <button
          onClick={speakFortune}
          className={`px-2 py-1 bg-[#E0E0E0] ${raised} hover:bg-[#D0D0D0]`}
        >
          🔈 Read Aloud
        </button>
      </div>
    </div>
  )
}
