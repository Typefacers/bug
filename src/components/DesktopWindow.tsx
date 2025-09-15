import { Minus, Square, X as CloseIcon } from 'lucide-react'
import { useCallback } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import AppRoutes from '../routes/AppRoutes'
import { useDesktop } from '../contexts/DesktopContext'
import type { WindowState } from '../types/window'
import Window from './win95/Window'
import TitleBar from './win95/TitleBar'
import Win95Button from './win95/Button'

type DesktopWindowProps = {
  windowState: WindowState
}

export default function DesktopWindow({ windowState }: DesktopWindowProps) {
  const {
    focusWindow,
    closeWindow,
    toggleMinimize,
    toggleMaximize,
    setWindowPosition,
    setWindowSize,
  } = useDesktop()

  const { id, path, title, position, size, zIndex, isMaximized, canResize } =
    windowState

  const handleDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (isMaximized) return
      event.preventDefault()
      focusWindow(id)

      const startX = event.clientX
      const startY = event.clientY
      const { x, y } = position

      const handleMove = (moveEvent: PointerEvent) => {
        const next = {
          x: x + (moveEvent.clientX - startX),
          y: y + (moveEvent.clientY - startY),
        }
        setWindowPosition(id, next)
      }

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [focusWindow, id, isMaximized, position, setWindowPosition]
  )

  const handleResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!canResize || isMaximized) return
      event.preventDefault()
      event.stopPropagation()
      focusWindow(id)

      const startX = event.clientX
      const startY = event.clientY
      const { width, height } = size

      const handleMove = (moveEvent: PointerEvent) => {
        const nextWidth = width + (moveEvent.clientX - startX)
        const nextHeight = height + (moveEvent.clientY - startY)
        setWindowSize(id, { width: nextWidth, height: nextHeight })
      }

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [canResize, focusWindow, id, isMaximized, setWindowSize, size]
  )

  const handleFocus = useCallback(() => {
    focusWindow(id)
  }, [focusWindow, id])

  const maximizeToggle = useCallback(() => {
    toggleMaximize(id)
  }, [id, toggleMaximize])

  const minimizeToggle = useCallback(() => {
    toggleMinimize(id)
  }, [id, toggleMinimize])

  const close = useCallback(() => {
    closeWindow(id)
  }, [closeWindow, id])

  const boundsStyle = isMaximized
    ? { left: 0, top: 0, width: '100%', height: '100%' }
    : {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }

  return (
    <div
      className="absolute flex flex-col"
      style={{ ...boundsStyle, zIndex }}
      onPointerDown={handleFocus}
    >
      <Window className="flex h-full flex-col" data-window-id={id}>
        <TitleBar
          title={title}
          onDoubleClick={maximizeToggle}
          onPointerDown={handleDragStart}
          controls={
            <div className="flex gap-px">
              <Win95Button
                aria-label="Minimize"
                onClick={minimizeToggle}
                className="h-6 w-6 p-0"
              >
                <Minus className="h-3 w-3 text-black" />
              </Win95Button>
              <Win95Button
                aria-label={isMaximized ? 'Restore' : 'Maximize'}
                onClick={maximizeToggle}
                className="h-6 w-6 p-0"
              >
                <Square className="h-3 w-3 text-black" />
              </Win95Button>
              <Win95Button
                aria-label="Close"
                onClick={close}
                className="h-6 w-6 p-0"
              >
                <CloseIcon className="h-3 w-3 text-black" />
              </Win95Button>
            </div>
          }
        />
        <div className="relative flex-1 overflow-hidden bg-[#E0E0E0]">
          <div className="absolute inset-0 overflow-auto">
            <AppRoutes location={path} />
          </div>
        </div>
      </Window>
      {canResize && !isMaximized && (
        <div
          className="absolute bottom-1 right-1 h-3 w-3 cursor-se-resize border-b border-r border-black"
          onPointerDown={handleResizeStart}
        />
      )}
    </div>
  )
}
