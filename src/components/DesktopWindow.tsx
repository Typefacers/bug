import { Suspense } from 'react'
import { Rnd } from 'react-rnd'
import { Button, Window, WindowContent, WindowHeader } from 'react95'
import {
  Win95CloseIcon,
  Win95MaximizeIcon,
  Win95MinimizeIcon,
} from './WindowControlIcons'
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
      <Window className="flex h-full flex-col" shadow>
        <WindowHeader
          className="win95-title-bar flex items-center justify-between gap-2"
          onDoubleClick={handleMaximize}
        >
          <span className="truncate pr-2">{windowState.title}</span>
          <div className="flex gap-1">
            <Button
              square
              size="sm"
              aria-label="Minimize"
              onClick={() => toggleMinimize(windowState.id)}
            >
              <Win95MinimizeIcon />
            </Button>
            <Button
              square
              size="sm"
              aria-label={windowState.maximized ? 'Restore' : 'Maximize'}
              onClick={handleMaximize}
            >
              <Win95MaximizeIcon />
            </Button>
            <Button
              square
              size="sm"
              aria-label="Close"
              onClick={() => closeWindow(windowState.id)}
            >
              <Win95CloseIcon />
            </Button>
          </div>
        </WindowHeader>
        <WindowContent className="flex-1 overflow-hidden">
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
