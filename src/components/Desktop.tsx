import { useEffect, useMemo, useRef, useState } from 'react'
import DesktopIcon from './DesktopIcon'
import DesktopWindow from './DesktopWindow'
import Taskbar from './Taskbar'
import { useWindowManager } from '../contexts/WindowManagerContext'
import { DESKTOP_SHORTCUTS } from '../utils/window-apps'
import type { WindowSize } from '../types/window'

const DEFAULT_SIZE: WindowSize = { width: 1024, height: 720 }
const CONTAINER_PADDING = 32 // Tailwind p-4
const ICON_GAP = 24 // Tailwind gap-6
const DEFAULT_ICON_SIZE = { width: 96, height: 112 }

export default function Desktop() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerSize, setContainerSize] = useState<WindowSize>(DEFAULT_SIZE)
  const [iconSize, setIconSize] = useState(DEFAULT_ICON_SIZE)
  const { windows, openWindow } = useWindowManager()
  const initializedRef = useRef(false)
  const firstIconRef = useRef<HTMLButtonElement | null>(null)

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

  useEffect(() => {
    const element = firstIconRef.current
    if (!element) return

    const updateIconSize = () => {
      setIconSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
      })
    }

    updateIconSize()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateIconSize)
      observer.observe(element)
      return () => observer.disconnect()
    }

    window.addEventListener('resize', updateIconSize)
    return () => window.removeEventListener('resize', updateIconSize)
  }, [])

  const sortedWindows = useMemo(
    () => [...windows].sort((a, b) => a.zIndex - b.zIndex),
    [windows]
  )

  const shortcutsByColumn = useMemo(() => {
    const totalShortcuts = DESKTOP_SHORTCUTS.length
    if (totalShortcuts === 0) return []

    const availableHeight = Math.max(
      0,
      containerSize.height - CONTAINER_PADDING
    )
    const availableWidth = Math.max(0, containerSize.width - CONTAINER_PADDING)

    const iconHeightWithGap = iconSize.height + ICON_GAP
    const iconWidthWithGap = iconSize.width + ICON_GAP

    const maxRows = iconHeightWithGap
      ? Math.max(
          1,
          Math.floor((availableHeight + ICON_GAP) / iconHeightWithGap)
        )
      : totalShortcuts

    const columnsByHeight =
      maxRows >= totalShortcuts ? 1 : Math.ceil(totalShortcuts / maxRows)

    const maxColumnsByWidth = iconWidthWithGap
      ? Math.max(1, Math.floor((availableWidth + ICON_GAP) / iconWidthWithGap))
      : totalShortcuts

    const columnCount = Math.max(
      1,
      Math.min(columnsByHeight, maxColumnsByWidth)
    )

    const rowsPerColumn = Math.ceil(totalShortcuts / columnCount)

    return Array.from({ length: columnCount }, (_, columnIndex) =>
      DESKTOP_SHORTCUTS.slice(
        columnIndex * rowsPerColumn,
        columnIndex * rowsPerColumn + rowsPerColumn
      )
    )
  }, [
    containerSize.height,
    containerSize.width,
    iconSize.height,
    iconSize.width,
  ])

  return (
    <div className="min-h-screen bg-[#008080] font-['MS_Sans_Serif','Tahoma',sans-serif] flex flex-col text-black">
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden p-4"
        role="presentation"
      >
        <div className="flex h-full items-start gap-6">
          {shortcutsByColumn.map((column, columnIndex) => (
            <div key={`column-${columnIndex}`} className="flex flex-col gap-6">
              {column.map((app, itemIndex) => (
                <DesktopIcon
                  key={app.id}
                  app={app}
                  ref={
                    columnIndex === 0 && itemIndex === 0
                      ? firstIconRef
                      : undefined
                  }
                />
              ))}
            </div>
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
