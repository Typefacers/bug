import Meta from '../components/Meta'
import { memo } from 'react'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

function EasterEgg({ windowId }: WindowComponentProps = {}) {
  const { openWindow, closeWindow } = useWindowManager()

  return (
    <>
      <Meta
        title="Secret Bug Found - Bug Basher"
        description="You've discovered a hidden page in Bug Basher."
      />
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">\uD83E\uDD5A Easter Egg</h1>
        <p>
          You found the hidden page! There isn't much here, but enjoy the
          bragging rights.
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
          Back to squashing bugs
        </button>
      </div>
    </>
  )
}

export default memo(EasterEgg)
