import { memo } from 'react'
import { styled } from 'styled-components'
import { Button, Frame } from 'react95'
import Meta from '../components/Meta'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

const EggFrame = styled(Frame).attrs({
  variant: 'window' as const,
  shadow: true,
})`
  background: ${({ theme }) => theme.material};
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`

function EasterEgg({ windowId }: WindowComponentProps = {}) {
  const { openWindow, closeWindow } = useWindowManager()

  const goBack = () => {
    openWindow('bugs')
    if (windowId) {
      closeWindow(windowId)
    }
  }

  return (
    <>
      <Meta
        title="Secret Bug Found - Bug Basher"
        description="You've discovered a hidden page in Bug Basher."
      />
      <EggFrame>
        <Title>🥚 Easter Egg</Title>
        <p>You found the hidden page! Enjoy the bragging rights.</p>
        <Button onClick={goBack}>Back to squashing bugs</Button>
      </EggFrame>
    </>
  )
}

export default memo(EasterEgg)
