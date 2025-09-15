/* eslint-disable react-refresh/only-export-components */
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { WINDOW_APPS } from '../utils/window-apps'
import type {
  OpenWindowOptions,
  WindowAppId,
  WindowSize,
  WindowState,
  WindowPoint,
} from '../types/window'

const MIN_WIDTH = 360
const MIN_HEIGHT = 240

const WindowManagerContext = createContext<WindowManagerValue | undefined>(
  undefined
)

type WindowManagerValue = {
  windows: WindowState[]
  activeWindowId: string | null
  openWindow: (appId: WindowAppId, options?: OpenWindowOptions) => string
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  toggleMinimize: (id: string) => void
  toggleMaximize: (id: string, bounds: WindowSize) => void
  setWindowPosition: (id: string, position: WindowPoint) => void
  setWindowSize: (id: string, size: WindowSize, position?: WindowPoint) => void
  setWindowTitle: (id: string, title: string) => void
  apps: typeof WINDOW_APPS
}

const randomId = () => Math.random().toString(36).slice(2, 7)

export function WindowManagerProvider({ children }: PropsWithChildren) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowIdState] = useState<string | null>(null)
  const activeIdRef = useRef<string | null>(null)
  const zIndexRef = useRef(100)

  const setActiveWindowId = useCallback((id: string | null) => {
    activeIdRef.current = id
    setActiveWindowIdState(id)
  }, [])

  const getNextZIndex = useCallback(() => {
    zIndexRef.current += 1
    return zIndexRef.current
  }, [])

  const focusWindow = useCallback(
    (id: string) => {
      const zIndex = getNextZIndex()
      setWindows(prev =>
        prev.map(window =>
          window.id === id ? { ...window, minimized: false, zIndex } : window
        )
      )
      setActiveWindowId(id)
    },
    [getNextZIndex, setActiveWindowId]
  )

  const openWindow = useCallback(
    (appId: WindowAppId, options?: OpenWindowOptions) => {
      const definition = WINDOW_APPS[appId]
      if (!definition) {
        throw new Error(`Unknown window app: ${appId}`)
      }

      let createdId = ''
      const zIndex = getNextZIndex()

      setWindows(prev => {
        const existing = prev.find(
          window =>
            window.appId === appId &&
            (!options?.instanceId || window.instanceId === options.instanceId)
        )

        if (existing) {
          createdId = existing.id
          return prev.map(window =>
            window.id === existing.id
              ? {
                  ...window,
                  minimized: false,
                  zIndex,
                  context: options?.context ?? window.context,
                }
              : window
          )
        }

        const position = options?.position ?? {
          x: 80 + prev.length * 24,
          y: 80 + prev.length * 24,
        }

        const size = {
          width: Math.max(
            MIN_WIDTH,
            options?.size?.width ?? definition.defaultSize.width
          ),
          height: Math.max(
            MIN_HEIGHT,
            options?.size?.height ?? definition.defaultSize.height
          ),
        }

        const id = `${appId}-${Date.now()}-${randomId()}`
        createdId = id

        const newWindow: WindowState = {
          id,
          appId,
          title: definition.title,
          position,
          size,
          minimized: false,
          maximized: false,
          zIndex,
          context: options?.context,
          instanceId: options?.instanceId,
          previous: null,
        }

        return [...prev, newWindow]
      })

      setActiveWindowId(createdId)
      return createdId
    },
    [getNextZIndex, setActiveWindowId]
  )

  const toggleMinimize = useCallback(
    (id: string) => {
      let nextActive: string | null = activeIdRef.current
      let restoredZ: number | null = null

      setWindows(prev =>
        prev.map(window => {
          if (window.id !== id) {
            return window
          }

          if (window.minimized) {
            if (restoredZ === null) {
              restoredZ = getNextZIndex()
            }
            nextActive = id
            return { ...window, minimized: false, zIndex: restoredZ }
          }

          if (nextActive === id) {
            nextActive = null
          }
          return { ...window, minimized: true }
        })
      )

      setActiveWindowId(nextActive)
    },
    [getNextZIndex, setActiveWindowId]
  )

  const toggleMaximize = useCallback(
    (id: string, bounds: WindowSize) => {
      const maximizeSize = {
        width: Math.max(MIN_WIDTH, bounds.width),
        height: Math.max(MIN_HEIGHT, bounds.height),
      }
      const zIndex = getNextZIndex()
      setWindows(prev =>
        prev.map(window => {
          if (window.id !== id) {
            return window
          }

          if (window.maximized) {
            return window.previous
              ? {
                  ...window,
                  maximized: false,
                  minimized: false,
                  position: window.previous.position,
                  size: window.previous.size,
                  previous: null,
                  zIndex,
                }
              : { ...window, maximized: false, minimized: false, zIndex }
          }

          return {
            ...window,
            maximized: true,
            minimized: false,
            previous: {
              position: window.position,
              size: window.size,
            },
            position: { x: 0, y: 0 },
            size: maximizeSize,
            zIndex,
          }
        })
      )

      setActiveWindowId(id)
    },
    [getNextZIndex, setActiveWindowId]
  )

  const setWindowPosition = useCallback((id: string, position: WindowPoint) => {
    setWindows(prev =>
      prev.map(window =>
        window.id === id && !window.maximized ? { ...window, position } : window
      )
    )
  }, [])

  const setWindowSize = useCallback(
    (id: string, size: WindowSize, position?: WindowPoint) => {
      setWindows(prev =>
        prev.map(window => {
          if (window.id !== id || window.maximized) {
            return window
          }

          return {
            ...window,
            size: {
              width: Math.max(MIN_WIDTH, size.width),
              height: Math.max(MIN_HEIGHT, size.height),
            },
            position: position ?? window.position,
          }
        })
      )
    },
    []
  )

  const closeWindow = useCallback(
    (id: string) => {
      let nextActiveId: string | null = activeIdRef.current
      setWindows(prev => {
        const filtered = prev.filter(window => window.id !== id)
        if (nextActiveId === id) {
          const topWindow = filtered.reduce<WindowState | null>(
            (acc, window) =>
              !acc || window.zIndex > acc.zIndex ? window : acc,
            null
          )
          nextActiveId = topWindow ? topWindow.id : null
        }
        return filtered
      })
      setActiveWindowId(nextActiveId ?? null)
    },
    [setActiveWindowId]
  )

  const setWindowTitle = useCallback((id: string, title: string) => {
    setWindows(prev =>
      prev.map(window => (window.id === id ? { ...window, title } : window))
    )
  }, [])

  const value = useMemo<WindowManagerValue>(
    () => ({
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      focusWindow,
      toggleMinimize,
      toggleMaximize,
      setWindowPosition,
      setWindowSize,
      setWindowTitle,
      apps: WINDOW_APPS,
    }),
    [
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      focusWindow,
      toggleMinimize,
      toggleMaximize,
      setWindowPosition,
      setWindowSize,
      setWindowTitle,
    ]
  )

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  )
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext)
  if (!context) {
    throw new Error(
      'useWindowManager must be used within WindowManagerProvider'
    )
  }
  return context
}
