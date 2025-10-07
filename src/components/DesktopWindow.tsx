import { Suspense, useCallback, useEffect, useRef } from 'react'
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
  overflow: auto;
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

  const {
    id,
    position: windowPosition,
    size,
    minimized,
    maximized,
    zIndex,
    context,
  } = windowState

  const windowShellRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const autoSizeEnabledRef = useRef(true)

  const definition = WINDOW_APPS[windowState.appId]

  const adjustToContentSize = useCallback(() => {
    if (maximized || minimized || !autoSizeEnabledRef.current) {
      return
    }

    if (containerSize.width <= 0 || containerSize.height <= 0) {
      return
    }

    const shellEl = windowShellRef.current
    const contentEl = contentRef.current

    if (!shellEl || !contentEl) {
      return
    }

    const widthExtra = shellEl.offsetWidth - contentEl.offsetWidth
    const heightExtra = shellEl.offsetHeight - contentEl.offsetHeight

    const requiredWidth = Math.ceil(
      contentEl.scrollWidth + Math.max(0, widthExtra)
    )
    const requiredHeight = Math.ceil(
      contentEl.scrollHeight + Math.max(0, heightExtra)
    )

    const nextWidth = Math.min(
      Math.max(size.width, requiredWidth),
      containerSize.width
    )
    const nextHeight = Math.min(
      Math.max(size.height, requiredHeight),
      containerSize.height
    )

    let nextX = windowPosition.x
    let nextY = windowPosition.y

    if (nextX + nextWidth > containerSize.width) {
      nextX = Math.max(0, containerSize.width - nextWidth)
    }

    if (nextY + nextHeight > containerSize.height) {
      nextY = Math.max(0, containerSize.height - nextHeight)
    }

    const sizeChanged = nextWidth > size.width || nextHeight > size.height
    const positionChanged =
      nextX !== windowPosition.x || nextY !== windowPosition.y

    if (sizeChanged || positionChanged) {
      const maybePosition = positionChanged ? { x: nextX, y: nextY } : undefined
      setWindowSize(id, { width: nextWidth, height: nextHeight }, maybePosition)
    }
  }, [
    containerSize.height,
    containerSize.width,
    id,
    maximized,
    minimized,
    setWindowSize,
    size.height,
    size.width,
    windowPosition.x,
    windowPosition.y,
  ])

  useEffect(() => {
    if (typeof window === 'undefined' || maximized || minimized) {
      return
    }

    const contentEl = contentRef.current
    if (!contentEl) {
      return
    }

    adjustToContentSize()

    if (typeof ResizeObserver === 'undefined') {
      const rafId = window.requestAnimationFrame(() => adjustToContentSize())
      return () => window.cancelAnimationFrame(rafId)
    }

    const observer = new ResizeObserver(() => {
      adjustToContentSize()
    })

    observer.observe(contentEl)
    return () => observer.disconnect()
  }, [adjustToContentSize, maximized, minimized])

  if (!definition) {
    return null
  }

  const { Component } = definition

  const handleMaximize = () => {
    autoSizeEnabledRef.current = false
    toggleMaximize(id, containerSize)
  }

  return (
    <Rnd
      bounds="parent"
      size={{ width: size.width, height: size.height }}
      position={{ x: windowPosition.x, y: windowPosition.y }}
      onDragStart={() => {
        autoSizeEnabledRef.current = false
        focusWindow(id)
      }}
      onDragStop={(_, data) => setWindowPosition(id, { x: data.x, y: data.y })}
      onResizeStart={() => {
        autoSizeEnabledRef.current = false
        focusWindow(id)
      }}
      onResize={(_, __, ref, ___, position) =>
        setWindowSize(
          id,
          { width: ref.offsetWidth, height: ref.offsetHeight },
          position
        )
      }
      onMouseDown={() => focusWindow(id)}
      dragHandleClassName="win95-title-bar"
      disableDragging={maximized}
      enableResizing={!maximized}
      minWidth={360}
      minHeight={240}
      style={{
        display: minimized ? 'none' : undefined,
        zIndex,
      }}
    >
      <WindowShell ref={windowShellRef} shadow>
        <TitleBar onDoubleClick={handleMaximize}>
          <TitleText>{windowState.title}</TitleText>
          <ControlGroup>
            <Button
              square
              size="sm"
              aria-label="Minimize"
              onClick={() => toggleMinimize(id)}
            >
              <Win95MinimizeIcon />
            </Button>
            <Button
              square
              size="sm"
              aria-label={maximized ? 'Restore' : 'Maximize'}
              onClick={handleMaximize}
            >
              {maximized ? <Win95RestoreIcon /> : <Win95MaximizeIcon />}
            </Button>
            <Button
              square
              size="sm"
              aria-label="Close"
              onClick={() => closeWindow(id)}
            >
              <Win95CloseIcon />
            </Button>
          </ControlGroup>
        </TitleBar>
        <Content ref={contentRef}>
          <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
            <Component
              windowId={id}
              context={context}
              setTitle={title => setWindowTitle(id, title)}
            />
          </Suspense>
        </Content>
      </WindowShell>
    </Rnd>
  )
}
