import { Suspense } from 'react'
import { Rnd } from 'react-rnd'
import Window from './win95/Window'
import TitleBar from './win95/TitleBar'
import Win95Button from './win95/Button'
import { WindowContent } from 'react95'
import {
  Win95CloseIcon,
  Win95MaximizeIcon,
  Win95MinimizeIcon,
} from './win95/WindowControlIcons'
import { useWindowManager } from '../contexts/WindowManagerContext'
import { WINDOW_APPS } from '../utils/window-apps'
import type { WindowSize, WindowState } from '../types/window'

type Props = {
  windowState: WindowState
  containerSize: WindowSize
}

export default function DesktopWindow({ windowState, containerSize }: Props) {
  const {
    closeWindow,
    focusWindow,
    toggleMinimize,
    toggleMaximize,
    setWindowPosition,
    setWindowSize,
    setWindowTitle,
    activeWindowId,
  } = useWindowManager()

  const definition = WINDOW_APPS[windowState.appId]
  if (!definition) {
    return null
  }

  const { Component } = definition

  const handleMaximize = () => {
    toggleMaximize(windowState.id, containerSize)
  }

  return (
    <Rnd
      bounds="parent"
      size={{ width: windowState.size.width, height: windowState.size.height }}
      position={{ x: windowState.position.x, y: windowState.position.y }}
      onDragStart={() => focusWindow(windowState.id)}
      onDragStop={(_, data) =>
        setWindowPosition(windowState.id, { x: data.x, y: data.y })
      }
      onResizeStart={() => focusWindow(windowState.id)}
      onResize={(_, __, ref, ___, position) =>
        setWindowSize(
          windowState.id,
          { width: ref.offsetWidth, height: ref.offsetHeight },
          position
        )
      }
      onMouseDown={() => focusWindow(windowState.id)}
      dragHandleClassName="win95-title-bar"
      disableDragging={windowState.maximized}
      enableResizing={!windowState.maximized}
      minWidth={360}
      minHeight={240}
      className={`absolute ${windowState.minimized ? 'hidden' : ''}`}
      style={{ zIndex: windowState.zIndex }}
    >
      <Window className="h-full">
        <TitleBar
          title={windowState.title}
          onDoubleClick={handleMaximize}
          active={activeWindowId === windowState.id && !windowState.minimized}
          controls={
            <div className="flex gap-px">
              <Win95Button
                onClick={() => toggleMinimize(windowState.id)}
                aria-label="Minimize"
                size="sm"
                square
              >
                <Win95MinimizeIcon />
              </Win95Button>
              <Win95Button
                onClick={handleMaximize}
                aria-label={windowState.maximized ? 'Restore' : 'Maximize'}
                size="sm"
                square
              >
                <Win95MaximizeIcon />
              </Win95Button>
              <Win95Button
                onClick={() => closeWindow(windowState.id)}
                aria-label="Close"
                size="sm"
                square
              >
                <Win95CloseIcon />
              </Win95Button>
            </div>
          }
        />
        <WindowContent className="flex-1 overflow-hidden bg-[#E0E0E0] p-3">
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <Component
              windowId={windowState.id}
              context={windowState.context}
              setTitle={title => setWindowTitle(windowState.id, title)}
            />
          </Suspense>
        </WindowContent>
      </Window>
    </Rnd>
  )
}
