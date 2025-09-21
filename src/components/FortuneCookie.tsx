import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { Button, Frame } from 'react95'

const FORTUNES = [
  'A bug in time saves nine more bugs.',
  'Even the smallest bug can lead to big rewards.',
  'Today is a good day to squash a bug.',
  'Squashed bugs smell like victory.',
  'Debugging: because real bugs have feelings too.',
  'Every bug you find hides two more.',
]

const FortuneFrame = styled(Frame).attrs({
  variant: 'window' as const,
  shadow: true,
})`
  margin-top: 8px;
  background: ${({ theme }) => theme.material};
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const FortuneText = styled(Frame).attrs({ variant: 'well' as const })`
  display: inline-block;
  background: ${({ theme }) => theme.canvas};
  padding: 6px 12px;
  font-size: 13px;
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`

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
    <FortuneFrame>
      <FortuneText>🥠 {fortune}</FortuneText>
      <ButtonRow>
        <Button onClick={randomFortune}>New Fortune</Button>
        <Button onClick={speakFortune}>🔈 Read Aloud</Button>
      </ButtonRow>
    </FortuneFrame>
  )
}
