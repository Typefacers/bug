import Meta from '../components/Meta'
import { memo } from 'react'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

function NotFound({ windowId }: WindowComponentProps = {}) {
  const { openWindow, closeWindow } = useWindowManager()

  return (
    <>
      <Meta
        title="Page Not Found - Bug Bounty"
        description="This route is more elusive than a bug-free codebase."
      />
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg">
          Well, this is embarrassing. You found the page even we can&apos;t
          find.
        </p>
        <p>
          Either it never existed or a hungry bug devoured it in a midnight
          snack.
        </p>
        <button
          type="button"
          className="text-indigo-600 hover:underline bg-transparent !px-0 !py-0 border-none focus:outline-none focus-visible:underline cursor-pointer"
          onClick={() => {
            openWindow('bugs')
            if (windowId) {
              closeWindow(windowId)
            }
          }}
        >
          Back to the bug hunt
        </button>
      </div>
    </>
  )
}

export default memo(NotFound)
