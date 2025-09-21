import { memo, useEffect, useMemo } from 'react'
import { styled } from 'styled-components'
import { Button, Frame } from 'react95'
import { useBugStore } from '../store'
import Meta from '../components/Meta'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

const Container = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Panel = styled(Frame).attrs({ variant: 'window' as const, shadow: true })`
  background: ${({ theme }) => theme.material};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.borderDark};
  padding-bottom: 8px;
`

const BugCard = styled(Frame).attrs({ variant: 'window' as const })`
  background: ${({ theme }) => theme.canvas};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FooterActions = styled.div`
  text-align: center;
`

type UserProfileContext = {
  userId?: number | string
}

function UserProfile({
  context,
  windowId,
  setTitle,
}: WindowComponentProps<UserProfileContext> = {}) {
  const { users, bugs } = useBugStore()
  const { openWindow, closeWindow } = useWindowManager()

  const id = context?.userId !== undefined ? Number(context.userId) : NaN
  const user = users.find(u => u.id === id)

  const squashedBugs = useMemo(
    () =>
      user?.bugsSquashed
        ? bugs.filter(bug => user.bugsSquashed!.includes(bug.id))
        : [],
    [bugs, user?.bugsSquashed]
  )
  const totalBounty = useMemo(
    () => squashedBugs.reduce((sum, bug) => sum + bug.bounty, 0),
    [squashedBugs]
  )

  useEffect(() => {
    if (user && setTitle) {
      setTitle(`User Profile - ${user.name}`)
    }
  }, [setTitle, user])

  const goToLeaderboard = () => {
    openWindow('leaderboard')
    if (windowId) {
      closeWindow(windowId)
    }
  }

  if (!user) {
    return (
      <>
        <Meta
          title="User Not Found - Bug Bounty"
          description="The requested user profile could not be located."
        />
        <Panel>
          <p>This profile could not be located.</p>
          <Button onClick={goToLeaderboard}>Back to Leaderboard</Button>
        </Panel>
      </>
    )
  }

  return (
    <>
      <Meta
        title={`Bug Bounty Profile - ${user.name}`}
        description={`Stats and achievements for ${user.name} in Bug Basher.`}
      />
      <Container>
        <Panel>
          <Title>{user.name}</Title>
          <span style={{ fontFamily: 'monospace', color: '#006400' }}>
            {(user.score ?? 0).toLocaleString()} points
          </span>
          <StatRow>
            <span>Total Bugs Squashed:</span>
            <strong>{user.bugsSquashed?.length ?? 0}</strong>
          </StatRow>
          <StatRow>
            <span>Total Bounty Collected:</span>
            <strong>{totalBounty.toLocaleString()}</strong>
          </StatRow>
          <StatRow>
            <span>Rank:</span>
            <strong>#{users.findIndex(u => u.id === id) + 1}</strong>
          </StatRow>
        </Panel>

        {squashedBugs.length > 0 && (
          <Panel>
            <h3 style={{ margin: 0, fontSize: 18 }}>Bugs Squashed</h3>
            {squashedBugs.map(bug => (
              <BugCard key={bug.id}>
                <strong>{bug.title}</strong>
                <span style={{ fontSize: 13 }}>{bug.description}</span>
                <span
                  style={{
                    textAlign: 'right',
                    fontFamily: 'monospace',
                    color: '#006400',
                  }}
                >
                  +{bug.bounty.toLocaleString()}
                </span>
              </BugCard>
            ))}
          </Panel>
        )}

        <FooterActions>
          <Button onClick={goToLeaderboard}>Back to Leaderboard</Button>
        </FooterActions>
      </Container>
    </>
  )
}

export default memo(UserProfile)
