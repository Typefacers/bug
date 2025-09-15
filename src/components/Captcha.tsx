import { useState, useEffect } from 'react'
import { Label } from './ui/label'
import type { CaptchaProps } from '../types/captcha-props'
import { sunken } from '../utils/win95'

export default function Captcha({ onChange }: CaptchaProps) {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    setA(Math.floor(Math.random() * 5) + 1)
    setB(Math.floor(Math.random() * 5) + 1)
  }, [])

  useEffect(() => {
    const num = parseInt(answer, 10)
    onChange(num === a + b)
  }, [answer, a, b, onChange])

  return (
    <div className="space-y-1">
      <Label htmlFor="captcha">
        What is {a} + {b}?
      </Label>
      <input
        id="captcha"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        className={`bg-white ${sunken}`}
      />
    </div>
  )
}
