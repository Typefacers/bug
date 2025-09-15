import { useEffect, useMemo, useRef, useState } from 'react'
import DesktopIcon from './DesktopIcon'
import DesktopWindow from './DesktopWindow'
import Taskbar from './Taskbar'
import { useWindowManager } from '../contexts/WindowManagerContext'
import { DESKTOP_SHORTCUTS } from '../utils/window-apps'
import type { WindowSize } from '../types/window'

const DEFAULT_SIZE: WindowSize = { width: 1024, height: 720 }

export default function Desktop() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerSize, setContainerSize] = useState<WindowSize>(DEFAULT_SIZE)
  const { windows, openWindow } = useWindowManager()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      openWindow('bugs')
    }
  }, [openWindow])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateSize = () => {
      const rect = element.getBoundingClientRect()
      setContainerSize({ width: rect.width, height: rect.height })
    }

    updateSize()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateSize)
      observer.observe(element)
      return () => observer.disconnect()
    }

    const handleResize = () => updateSize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const sortedWindows = useMemo(
    () => [...windows].sort((a, b) => a.zIndex - b.zIndex),
    [windows]
  )

  return (
    <div className="min-h-screen bg-[#008080] font-['MS_Sans_Serif','Tahoma',sans-serif] flex flex-col text-black">
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden p-4"
        role="presentation"
      >
        <div className="grid grid-cols-1 gap-6 content-start">
          {DESKTOP_SHORTCUTS.map(app => (
            <DesktopIcon key={app.id} app={app} />
          ))}
        </div>

        {sortedWindows.map(window => (
          <DesktopWindow
            key={window.id}
            windowState={window}
            containerSize={containerSize}
          />
        ))}
      </div>
      <Taskbar />
    </div>
  )
}
