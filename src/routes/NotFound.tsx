import { memo } from 'react'
import { styled } from 'styled-components'
import { Button, Frame } from 'react95'
import Meta from '../components/Meta'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

const NotFoundFrame = styled(Frame).attrs({
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
  font-size: 22px;
`

const Message = styled.p`
  margin: 0;
  font-size: 14px;
`

function NotFound({ windowId }: WindowComponentProps = {}) {
  const { openWindow, closeWindow } = useWindowManager()

  const goHome = () => {
    openWindow('bugs')
    if (windowId) {
      closeWindow(windowId)
    }
  }

  return (
    <>
      <Meta
        title="Page Not Found - Bug Bounty"
        description="This route is more elusive than a bug-free codebase."
      />
      <NotFoundFrame>
        <Title>404 - Page Not Found</Title>
        <Message>
          Well, this is embarrassing. You found the page even we can&apos;t
          find.
        </Message>
        <Message>
          Either it never existed or a hungry bug devoured it in a midnight
          snack.
        </Message>
        <Button onClick={goHome}>Back to the bug hunt</Button>
      </NotFoundFrame>
    </>
  )
}

export default memo(NotFound)
