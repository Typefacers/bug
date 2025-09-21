import { Suspense } from 'react'
import { Rnd } from 'react-rnd'
import { styled } from 'styled-components'
import { Button, Window, WindowContent, WindowHeader } from 'react95'
import {
  Win95CloseIcon,
  Win95MaximizeIcon,
  Win95MinimizeIcon,
  Win95RestoreIcon,
} from './WindowControlIcons'
import { useWindowManager } from '../contexts/WindowManagerContext'
import { WINDOW_APPS } from '../utils/window-apps'
import type { WindowSize, WindowState } from '../types/window'

type Props = {
  windowState: WindowState
  containerSize: WindowSize
}

const WindowShell = styled(Window)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const TitleBar = styled(WindowHeader).attrs({ className: 'win95-title-bar' })`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const TitleText = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;
`

const ControlGroup = styled.div`
  display: flex;
  gap: 4px;
`

const Content = styled(WindowContent)`
  flex: 1;
  width: 100%;
  overflow: hidden;
`

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 16px;
`

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
      style={{
        display: windowState.minimized ? 'none' : undefined,
        zIndex: windowState.zIndex,
      }}
    >
      <WindowShell shadow>
        <TitleBar onDoubleClick={handleMaximize}>
          <TitleText>{windowState.title}</TitleText>
          <ControlGroup>
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
              {windowState.maximized ? (
                <Win95RestoreIcon />
              ) : (
                <Win95MaximizeIcon />
              )}
            </Button>
            <Button
              square
              size="sm"
              aria-label="Close"
              onClick={() => closeWindow(windowState.id)}
            >
              <Win95CloseIcon />
            </Button>
          </ControlGroup>
        </TitleBar>
        <Content>
          <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
            <Component
              windowId={windowState.id}
              context={windowState.context}
              setTitle={title => setWindowTitle(windowState.id, title)}
            />
          </Suspense>
        </Content>
      </WindowShell>
    </Rnd>
  )
}
