import { forwardRef, useState } from 'react'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowAppDefinition } from '../utils/window-apps'

const baseClasses =
  'flex flex-col items-center justify-center w-24 gap-2 text-center text-white cursor-default select-none bg-transparent border-none !px-0 !py-3 focus:outline-none focus-visible:outline focus-visible:outline-offset-1 focus-visible:outline-white'

const DesktopIcon = forwardRef<HTMLButtonElement, { app: WindowAppDefinition }>(
  ({ app }, ref) => {
    const { openWindow } = useWindowManager()
    const [selected, setSelected] = useState(false)

    return (
      <button
        type="button"
        onClick={() => setSelected(true)}
        onDoubleClick={() => {
          openWindow(app.id)
          setSelected(false)
        }}
        className={`${baseClasses} focus:outline-none`}
        ref={ref}
      >
        <span
          className={`flex h-12 w-12 items-center justify-center rounded ${
            selected ? 'bg-[#000080] border border-white' : ''
          }`}
        >
          <span className="text-2xl" aria-hidden>
            {app.icon}
          </span>
        </span>
        <span
          className={`px-1 text-sm leading-tight ${
            selected ? 'bg-[#000080] border border-white' : 'bg-[#000080]/0'
          }`}
        >
          {app.title}
        </span>
      </button>
    )
  }
)

DesktopIcon.displayName = 'DesktopIcon'

export default DesktopIcon
