import { useBugStore } from '../store'
import { Button, Frame } from 'react95'
import Meta from '../components/Meta'
import { memo, useEffect, useMemo } from 'react'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

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

  if (!user) {
    return (
      <>
        <Meta
          title="User Not Found - Bug Bounty"
          description="The requested user profile could not be located."
        />
        <div className="text-center space-y-4">
          <Button
            variant="flat"
            onClick={() => {
              openWindow('leaderboard')
              if (windowId) {
                closeWindow(windowId)
              }
            }}
          >
            Back to Leaderboard
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Meta
        title={`Bug Bounty Profile - ${user.name}`}
        description={`Stats and achievements for ${user.name} in Bug Basher.`}
      />
      <div className="mx-auto max-w-md space-y-6">
        <Frame variant="window" className="bg-material">
          <div className="space-y-6 p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="mt-1 text-lg font-mono text-emerald-700">
                {(user.score ?? 0).toLocaleString()} points
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span>Total Bugs Squashed:</span>
                <span className="font-medium">
                  {user.bugsSquashed?.length ?? 0}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>Total Bounty Collected:</span>
                <span className="font-medium">
                  {totalBounty.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>Rank:</span>
                <span className="font-medium">
                  #{users.findIndex(u => u.id === id) + 1}
                </span>
              </div>
            </div>
          </div>
        </Frame>

        {squashedBugs.length > 0 && (
          <Frame variant="window" className="bg-material">
            <div className="space-y-2 p-6">
              <h3 className="mb-3 text-xl font-semibold">Bugs Squashed</h3>
              {squashedBugs.map(bug => (
                <div
                  key={bug.id}
                  className="rounded-lg border bg-white p-3 shadow-sm"
                >
                  <div className="font-medium">{bug.title}</div>
                  <div className="mt-1 text-sm text-gray-600">
                    {bug.description}
                  </div>
                  <div className="mt-2 text-right font-mono text-emerald-700">
                    +{bug.bounty.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </Frame>
        )}

        <div className="text-center">
          <Button
            variant="flat"
            onClick={() => {
              openWindow('leaderboard')
              if (windowId) {
                closeWindow(windowId)
              }
            }}
          >
            Back to Leaderboard
          </Button>
        </div>
      </div>
    </>
  )
}

export default memo(UserProfile)
