import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  WINDOW_DEFINITIONS,
  findDefinitionForPath,
} from '../lib/window-definitions'
import type { WindowDefinition, WindowState } from '../types/window'

const MIN_WINDOW_WIDTH = 360
const MIN_WINDOW_HEIGHT = 260

type DesktopContextValue = {
  windows: WindowState[]
  activeWindowId: string | null
  definitions: WindowDefinition[]
  startMenuOpen: boolean
  openWindow: (path: string) => void
  focusWindow: (id: string) => void
  closeWindow: (id: string) => void
  toggleMinimize: (id: string) => void
  toggleMaximize: (id: string) => void
  setWindowPosition: (id: string, position: { x: number; y: number }) => void
  setWindowSize: (id: string, size: { width: number; height: number }) => void
  toggleStartMenu: (open?: boolean) => void
}

const DesktopContext = createContext<DesktopContextValue | undefined>(undefined)

const getFallbackDefinition = () =>
  WINDOW_DEFINITIONS.find(definition => definition.id === 'not-found')

export function DesktopProvider({ children }: PropsWithChildren) {
  const location = useLocation()
  const navigate = useNavigate()
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const zIndexRef = useRef(1)
  const cascadeRef = useRef(0)
  const suppressedPathsRef = useRef(new Set<string>())
  const previousPathRef = useRef<string | undefined>()

  const getDefinitionForPath = useCallback((path: string) => {
    return findDefinitionForPath(path) ?? getFallbackDefinition()
  }, [])

  const openWindow = useCallback(
    (path: string) => {
      const definition = getDefinitionForPath(path)
      if (!definition) return

      let nextActive: string | null = null

      setWindows(prev => {
        const existing = prev.find(window => window.path === path)
        if (existing) {
          nextActive = existing.id
          const derivedTitle = definition.getTitle?.(path) ?? existing.title
          const nextZ = ++zIndexRef.current
          return prev.map(window =>
            window.id === existing.id
              ? {
                  ...window,
                  isMinimized: false,
                  zIndex: nextZ,
                  title: derivedTitle,
                }
              : window
          )
        }

        const offset = cascadeRef.current
        cascadeRef.current = (cascadeRef.current + 32) % 192
        const nextZ = ++zIndexRef.current

        const newWindow: WindowState = {
          id: crypto.randomUUID(),
          definitionId: definition.id,
          path,
          title: definition.getTitle?.(path) ?? definition.title,
          icon: definition.icon,
          position: {
            x: definition.defaultPosition.x + offset,
            y: definition.defaultPosition.y + offset,
          },
          size: { ...definition.defaultSize },
          zIndex: nextZ,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          canResize: definition.resizable ?? true,
        }

        nextActive = newWindow.id
        return [...prev, newWindow]
      })

      if (nextActive) {
        setActiveWindowId(nextActive)
      }

      setStartMenuOpen(false)
    },
    [getDefinitionForPath]
  )

  const focusWindow = useCallback((id: string) => {
    let found = false
    setWindows(prev =>
      prev.map(window => {
        if (window.id !== id) return window
        found = true
        const nextZ = ++zIndexRef.current
        return { ...window, isMinimized: false, zIndex: nextZ }
      })
    )
    if (found) {
      setActiveWindowId(id)
      setStartMenuOpen(false)
    }
  }, [])

  const toggleMinimize = useCallback((id: string) => {
    let shouldActivate = false
    let shouldDeactivate = false

    setWindows(prev =>
      prev.map(window => {
        if (window.id !== id) return window
        if (window.isMinimized) {
          shouldActivate = true
          const nextZ = ++zIndexRef.current
          return { ...window, isMinimized: false, zIndex: nextZ }
        }
        shouldDeactivate = true
        return { ...window, isMinimized: true }
      })
    )

    if (shouldActivate) {
      setActiveWindowId(id)
    } else if (shouldDeactivate) {
      setActiveWindowId(previous => (previous === id ? null : previous))
    }

    setStartMenuOpen(false)
  }, [])

  const toggleMaximize = useCallback((id: string) => {
    let toggled = false
    setWindows(prev =>
      prev.map(window => {
        if (window.id !== id) return window
        toggled = true
        if (window.isMaximized) {
          const restore = window.restoreBounds
          const nextZ = ++zIndexRef.current
          return {
            ...window,
            isMaximized: false,
            position: restore?.position ?? window.position,
            size: restore?.size ?? window.size,
            restoreBounds: undefined,
            zIndex: nextZ,
          }
        }
        const nextZ = ++zIndexRef.current
        return {
          ...window,
          isMaximized: true,
          restoreBounds: {
            position: window.position,
            size: window.size,
          },
          zIndex: nextZ,
        }
      })
    )

    if (toggled) {
      setActiveWindowId(id)
    }
  }, [])

  const closeWindow = useCallback((id: string) => {
    let closedPath: string | null = null
    let nextActive: string | null = null

    setWindows(prev => {
      const closing = prev.find(window => window.id === id)
      if (closing) {
        closedPath = closing.path
      }

      const remaining = prev.filter(window => window.id !== id)
      const next = remaining
        .filter(window => !window.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0]

      nextActive = next?.id ?? null
      return remaining
    })

    if (closedPath) {
      suppressedPathsRef.current.add(closedPath)
    }

    setActiveWindowId(previous => (previous === id ? nextActive : previous))
    setStartMenuOpen(false)
  }, [])

  const setWindowPosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows(prev =>
        prev.map(window =>
          window.id === id && !window.isMaximized
            ? { ...window, position }
            : window
        )
      )
    },
    []
  )

  const setWindowSize = useCallback(
    (id: string, size: { width: number; height: number }) => {
      setWindows(prev =>
        prev.map(window => {
          if (window.id !== id || window.isMaximized || !window.canResize) {
            return window
          }
          return {
            ...window,
            size: {
              width: Math.max(MIN_WINDOW_WIDTH, size.width),
              height: Math.max(MIN_WINDOW_HEIGHT, size.height),
            },
          }
        })
      )
    },
    []
  )

  const toggleStartMenu = useCallback((open?: boolean) => {
    setStartMenuOpen(previous => (typeof open === 'boolean' ? open : !previous))
  }, [])

  useEffect(() => {
    const active = windows.find(
      window => window.id === activeWindowId && !window.isMinimized
    )

    if (active) {
      if (location.pathname !== active.path) {
        navigate(active.path, { replace: true })
      }
      return
    }

    if (!windows.length) {
      if (location.pathname !== '/') {
        navigate('/', { replace: true })
      }
      return
    }

    const next = windows
      .filter(window => !window.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex)[0]

    if (next && location.pathname !== next.path) {
      navigate(next.path, { replace: true })
    }
  }, [activeWindowId, windows, navigate, location.pathname])

  useEffect(() => {
    const path = location.pathname || '/'
    const hasWindow = windows.some(window => window.path === path)

    if (previousPathRef.current === path && hasWindow) {
      return
    }

    previousPathRef.current = path

    if (suppressedPathsRef.current.has(path)) {
      suppressedPathsRef.current.delete(path)
      return
    }

    if (hasWindow) {
      const existing = windows.find(window => window.path === path)
      if (existing) {
        focusWindow(existing.id)
      }
      return
    }

    openWindow(path)
  }, [location.pathname, windows, focusWindow, openWindow])

  const value = useMemo<DesktopContextValue>(
    () => ({
      windows,
      activeWindowId,
      definitions: WINDOW_DEFINITIONS,
      startMenuOpen,
      openWindow,
      focusWindow,
      closeWindow,
      toggleMinimize,
      toggleMaximize,
      setWindowPosition,
      setWindowSize,
      toggleStartMenu,
    }),
    [
      windows,
      activeWindowId,
      startMenuOpen,
      openWindow,
      focusWindow,
      closeWindow,
      toggleMinimize,
      toggleMaximize,
      setWindowPosition,
      setWindowSize,
      toggleStartMenu,
    ]
  )

  return (
    <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
  )
}

/* eslint-disable-next-line react-refresh/only-export-components */
export const useDesktop = () => {
  const context = useContext(DesktopContext)
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider')
  }
  return context
}

