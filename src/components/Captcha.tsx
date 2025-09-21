import { useState, useEffect } from 'react'
import { styled } from 'styled-components'
import type { CaptchaProps } from '../types/captcha-props'
import { TextInput } from 'react95'

const CaptchaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const QuestionLabel = styled.label`
  font-size: 13px;
`

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
    <CaptchaContainer>
      <QuestionLabel htmlFor="captcha">
        What is {a} + {b}?
      </QuestionLabel>
      <TextInput
        id="captcha"
        value={answer}
        onChange={event => setAnswer(event.target.value)}
        fullWidth
      />
    </CaptchaContainer>
  )
}
