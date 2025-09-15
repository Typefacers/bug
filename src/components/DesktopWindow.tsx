import { Suspense } from 'react'
import { Rnd } from 'react-rnd'
import { Button, Toolbar, Window, WindowContent, WindowHeader } from 'react95'
import {
  Win95CloseIcon,
  Win95MaximizeIcon,
  Win95MinimizeIcon,
} from './WindowControlIcons'
import { useWindowManager } from '../contexts/WindowManagerContext'
import { WINDOW_APPS } from '../utils/window-apps'
import type { WindowSize, WindowState } from '../types/window'

const CONTROL_BUTTON_CLASS =
  'h-6 w-6 p-0 flex items-center justify-center rounded-none'

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
      dragHandleClassName="react95-window-header"
      disableDragging={windowState.maximized}
      enableResizing={!windowState.maximized}
      minWidth={360}
      minHeight={240}
      className={`absolute ${windowState.minimized ? 'hidden' : ''}`}
      style={{ zIndex: windowState.zIndex }}
    >
      <Window className="flex h-full flex-col" shadow>
        <WindowHeader
          className="react95-window-header flex items-center justify-between"
          onDoubleClick={handleMaximize}
          active={!windowState.minimized}
        >
          <span className="pr-3 text-sm font-bold tracking-wide">
            {windowState.title}
          </span>
          <Toolbar className="gap-1" noPadding>
            <Button
              aria-label="Minimize"
              onClick={() => toggleMinimize(windowState.id)}
              variant="thin"
              size="sm"
              square
              className={CONTROL_BUTTON_CLASS}
            >
              <Win95MinimizeIcon />
            </Button>
            <Button
              aria-label={windowState.maximized ? 'Restore' : 'Maximize'}
              onClick={handleMaximize}
              variant="thin"
              size="sm"
              square
              className={CONTROL_BUTTON_CLASS}
            >
              <Win95MaximizeIcon />
            </Button>
            <Button
              aria-label="Close"
              onClick={() => closeWindow(windowState.id)}
              variant="thin"
              size="sm"
              square
              className={CONTROL_BUTTON_CLASS}
            >
              <Win95CloseIcon />
            </Button>
          </Toolbar>
        </WindowHeader>
        <WindowContent className="flex flex-1 flex-col overflow-hidden bg-material p-3">
          <Suspense fallback={<div className="p-4 text-sm">Loading...</div>}>
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
