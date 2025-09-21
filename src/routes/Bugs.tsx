import { memo, type FC } from 'react'
import { styled } from 'styled-components'
import { Frame } from 'react95'
import BugArea from '../components/BugArea'
import { useBugStore } from '../store'
import Meta from '../components/Meta'
import type { WindowComponentProps } from '../types/window'

const BugsLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
`

const BugArenaFrame = styled(Frame).attrs({
  variant: 'window' as const,
  shadow: true,
})`
  flex: 1;
  min-height: 60vh;
  position: relative;
  background: ${({ theme }) => theme.material};
  padding: 8px;
`

const HintText = styled.p`
  text-align: center;
  font-size: 13px;
`

const Bugs: FC<WindowComponentProps> = () => {
  const bugs = useBugStore(s => s.bugs)

  return (
    <BugsLayout>
      <Meta
        title="Bug Basher - Squash Bugs"
        description="Play Bug Basher and earn bounties by squashing pesky bugs."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Bug Basher',
        }}
      />
      <BugArenaFrame>
        <BugArea bugs={bugs} />
      </BugArenaFrame>
      <HintText>Click to squash a bug &amp; earn its bounty 👆</HintText>
    </BugsLayout>
  )
}

export default memo(Bugs)
