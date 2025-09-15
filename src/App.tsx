import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { Suspense, lazy, useEffect, useState, useRef, useCallback } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Minus, Square, X as CloseIcon } from 'lucide-react'
import { useKonamiDarkMode } from './hooks/use-konami-dark-mode'
import { useAudio } from './hooks/use-audio'
import { useBugStore } from './store'

const Bugs = lazy(() => import('./routes/Bugs'))
const Leaderboard = lazy(() => import('./routes/Leaderboard'))
const UserProfile = lazy(() => import('./routes/UserProfile'))
const Dashboard = lazy(() => import('./routes/Dashboard'))
const NewBug = lazy(() => import('./routes/NewBug'))
const NotFound = lazy(() => import('./routes/NotFound'))
const EasterEgg = lazy(() => import('./routes/EasterEgg'))
const Weather = lazy(() => import('./routes/Weather'))
const SignUp = lazy(() => import('./routes/SignUp'))
const Fortune = lazy(() => import('./routes/Fortune'))
const JobDescription = lazy(() => import('./routes/JobDescription'))

import Taskbar from './components/Taskbar'
import { AudioContext } from './contexts/AudioContext'
import Window from './components/win95/Window'
import TitleBar from './components/win95/TitleBar'
import TabLink from './components/win95/TabLink'
import Win95Button from './components/win95/Button'
import DesktopIcon from './components/win95/DesktopIcon'

type DesktopShortcut = {
  id: string
  label: string
  icon: string
  path: string
}

const DESKTOP_SHORTCUTS: DesktopShortcut[] = [
  { id: 'bugs', label: 'Bug Basher', icon: '🐛', path: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    icon: '🏆',
    path: '/bounty-leaderboard',
  },
  { id: 'weather', label: 'Weather', icon: '🌦️', path: '/weather' },
  { id: 'fortune', label: 'Fortune', icon: '🥠', path: '/fortune' },
  { id: 'sign-up', label: 'Sign Up', icon: '✍️', path: '/sign-up' },
  {
    id: 'job-description',
    label: 'Job Description',
    icon: '📄',
    path: '/job-description',
  },
]

const DEFAULT_WINDOW_POSITION = { x: 48, y: 48 }
const DEFAULT_WINDOW_SIZE = { width: 960, height: 620 }
const MIN_WINDOW_SIZE = { width: 560, height: 380 }

type ResizeDirection =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

type ResizeState = {
  direction: ResizeDirection
  startX: number
  startY: number
  startWidth: number
  startHeight: number
  startLeft: number
  startTop: number
  desktopWidth: number
  desktopHeight: number
}

type DragState = {
  offsetX: number
  offsetY: number
}

const clamp = (value: number, min: number, max: number) => {
  if (max < min) return min
  return Math.min(Math.max(value, min), max)
}

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { startAutomaticSystems, stopAutomaticSystems } = useBugStore()
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [windowPosition, setWindowPosition] = useState(() => ({
    ...DEFAULT_WINDOW_POSITION,
  }))
  const [windowSize, setWindowSize] = useState(() => ({
    ...DEFAULT_WINDOW_SIZE,
  }))
  const desktopRef = useRef<HTMLDivElement | null>(null)
  const windowPositionRef = useRef(windowPosition)
  const windowSizeRef = useRef(windowSize)
  const previousBoundsRef = useRef({
    position: { ...DEFAULT_WINDOW_POSITION },
    size: { ...DEFAULT_WINDOW_SIZE },
  })
  const dragState = useRef<DragState | null>(null)
  const resizeState = useRef<ResizeState | null>(null)
  const dragCleanupRef = useRef<(() => void) | null>(null)
  const resizeCleanupRef = useRef<(() => void) | null>(null)

  useKonamiDarkMode()

  useEffect(() => {
    startAutomaticSystems()
    return () => stopAutomaticSystems()
  }, [startAutomaticSystems, stopAutomaticSystems])

  useEffect(() => {
    windowPositionRef.current = windowPosition
  }, [windowPosition])

  useEffect(() => {
    windowSizeRef.current = windowSize
  }, [windowSize])

  useEffect(() => {
    const desktop = desktopRef.current
    if (!desktop) return
    const rect = desktop.getBoundingClientRect()
    const currentSize = windowSizeRef.current
    const currentPos = windowPositionRef.current

    const nextWidth = clamp(
      currentSize.width,
      MIN_WINDOW_SIZE.width,
      rect.width
    )
    const nextHeight = clamp(
      currentSize.height,
      MIN_WINDOW_SIZE.height,
      rect.height
    )
    const maxX = Math.max(0, rect.width - nextWidth)
    const maxY = Math.max(0, rect.height - nextHeight)
    const nextX = clamp(currentPos.x, 0, maxX)
    const nextY = clamp(currentPos.y, 0, maxY)

    if (nextWidth !== currentSize.width || nextHeight !== currentSize.height) {
      windowSizeRef.current = { width: nextWidth, height: nextHeight }
      setWindowSize({ width: nextWidth, height: nextHeight })
    }
    if (nextX !== currentPos.x || nextY !== currentPos.y) {
      windowPositionRef.current = { x: nextX, y: nextY }
      setWindowPosition({ x: nextX, y: nextY })
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const desktop = desktopRef.current
      if (!desktop) return
      const rect = desktop.getBoundingClientRect()

      if (maximized) {
        const stored = previousBoundsRef.current
        const nextWidth = clamp(
          stored.size.width,
          MIN_WINDOW_SIZE.width,
          rect.width
        )
        const nextHeight = clamp(
          stored.size.height,
          MIN_WINDOW_SIZE.height,
          rect.height
        )
        const maxX = Math.max(0, rect.width - nextWidth)
        const maxY = Math.max(0, rect.height - nextHeight)
        const nextX = clamp(stored.position.x, 0, maxX)
        const nextY = clamp(stored.position.y, 0, maxY)
        previousBoundsRef.current = {
          position: { x: nextX, y: nextY },
          size: { width: nextWidth, height: nextHeight },
        }
        return
      }

      const currentSize = windowSizeRef.current
      const currentPos = windowPositionRef.current

      const nextWidth = clamp(
        currentSize.width,
        MIN_WINDOW_SIZE.width,
        rect.width
      )
      const nextHeight = clamp(
        currentSize.height,
        MIN_WINDOW_SIZE.height,
        rect.height
      )
      const maxX = Math.max(0, rect.width - nextWidth)
      const maxY = Math.max(0, rect.height - nextHeight)
      const nextX = clamp(currentPos.x, 0, maxX)
      const nextY = clamp(currentPos.y, 0, maxY)

      if (
        nextWidth !== currentSize.width ||
        nextHeight !== currentSize.height
      ) {
        windowSizeRef.current = { width: nextWidth, height: nextHeight }
        setWindowSize({ width: nextWidth, height: nextHeight })
      }
      if (nextX !== currentPos.x || nextY !== currentPos.y) {
        windowPositionRef.current = { x: nextX, y: nextY }
        setWindowPosition({ x: nextX, y: nextY })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [maximized])

  useEffect(
    () => () => {
      dragCleanupRef.current?.()
      resizeCleanupRef.current?.()
    },
    []
  )

  const showWindow = useCallback(() => {
    setHidden(false)
    setMinimized(false)
  }, [])

  const handleToggleMaximize = useCallback(() => {
    setMaximized(previous => {
      if (previous) {
        const { position, size } = previousBoundsRef.current
        const restoredPosition = { ...position }
        const restoredSize = { ...size }
        windowPositionRef.current = restoredPosition
        windowSizeRef.current = restoredSize
        setWindowPosition(restoredPosition)
        setWindowSize(restoredSize)
        return false
      }
      previousBoundsRef.current = {
        position: { ...windowPositionRef.current },
        size: { ...windowSizeRef.current },
      }
      return true
    })
  }, [])

  const handleTitleBarPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || maximized) return
      const desktop = desktopRef.current
      if (!desktop) return
      event.preventDefault()
      event.stopPropagation()
      setSelectedIcon(null)
      setMinimized(false)

      const rect = desktop.getBoundingClientRect()
      dragState.current = {
        offsetX: event.clientX - rect.left - windowPositionRef.current.x,
        offsetY: event.clientY - rect.top - windowPositionRef.current.y,
      }

      dragCleanupRef.current?.()

      const handleMove = (moveEvent: PointerEvent) => {
        const state = dragState.current
        if (!state) return
        const desktopRect = desktop.getBoundingClientRect()
        const { width, height } = windowSizeRef.current
        const rawX = moveEvent.clientX - desktopRect.left - state.offsetX
        const rawY = moveEvent.clientY - desktopRect.top - state.offsetY
        const maxX = Math.max(0, desktopRect.width - width)
        const maxY = Math.max(0, desktopRect.height - height)
        const nextX = clamp(rawX, 0, maxX)
        const nextY = clamp(rawY, 0, maxY)
        if (
          nextX !== windowPositionRef.current.x ||
          nextY !== windowPositionRef.current.y
        ) {
          windowPositionRef.current = { x: nextX, y: nextY }
          setWindowPosition({ x: nextX, y: nextY })
        }
      }

      const handlePointerUp = () => {
        dragCleanupRef.current?.()
        dragCleanupRef.current = null
        dragState.current = null
      }

      document.addEventListener('pointermove', handleMove)
      document.addEventListener('pointerup', handlePointerUp)
      dragCleanupRef.current = () => {
        document.removeEventListener('pointermove', handleMove)
        document.removeEventListener('pointerup', handlePointerUp)
      }
    },
    [maximized]
  )

  const handleResizeStart = useCallback(
    (direction: ResizeDirection, event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || maximized) return
      const desktop = desktopRef.current
      if (!desktop) return
      event.preventDefault()
      event.stopPropagation()

      const rect = desktop.getBoundingClientRect()
      resizeState.current = {
        direction,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: windowSizeRef.current.width,
        startHeight: windowSizeRef.current.height,
        startLeft: windowPositionRef.current.x,
        startTop: windowPositionRef.current.y,
        desktopWidth: rect.width,
        desktopHeight: rect.height,
      }

      resizeCleanupRef.current?.()

      const handleMove = (moveEvent: PointerEvent) => {
        const state = resizeState.current
        if (!state) return
        const deltaX = moveEvent.clientX - state.startX
        const deltaY = moveEvent.clientY - state.startY

        const prevPos = windowPositionRef.current
        const prevSize = windowSizeRef.current

        let nextLeft = prevPos.x
        let nextTop = prevPos.y
        let nextWidth = prevSize.width
        let nextHeight = prevSize.height

        const isLeft = state.direction.includes('left')
        const isRight = state.direction.includes('right')
        const isTop = state.direction.includes('top')
        const isBottom = state.direction.includes('bottom')

        if (isRight) {
          const maxWidth = state.desktopWidth - state.startLeft
          nextWidth = clamp(
            state.startWidth + deltaX,
            MIN_WINDOW_SIZE.width,
            maxWidth
          )
        }

        if (isBottom) {
          const maxHeight = state.desktopHeight - state.startTop
          nextHeight = clamp(
            state.startHeight + deltaY,
            MIN_WINDOW_SIZE.height,
            maxHeight
          )
        }

        if (isLeft) {
          const rawLeft = state.startLeft + deltaX
          const maxLeft =
            state.startLeft + state.startWidth - MIN_WINDOW_SIZE.width
          nextLeft = clamp(rawLeft, 0, maxLeft)
          const maxWidth = state.desktopWidth - nextLeft
          nextWidth = clamp(
            state.startWidth + (state.startLeft - nextLeft),
            MIN_WINDOW_SIZE.width,
            maxWidth
          )
        }

        if (isTop) {
          const rawTop = state.startTop + deltaY
          const maxTop =
            state.startTop + state.startHeight - MIN_WINDOW_SIZE.height
          nextTop = clamp(rawTop, 0, maxTop)
          const maxHeight = state.desktopHeight - nextTop
          nextHeight = clamp(
            state.startHeight + (state.startTop - nextTop),
            MIN_WINDOW_SIZE.height,
            maxHeight
          )
        }

        const maxX = Math.max(0, state.desktopWidth - nextWidth)
        const maxY = Math.max(0, state.desktopHeight - nextHeight)
        nextLeft = clamp(nextLeft, 0, maxX)
        nextTop = clamp(nextTop, 0, maxY)

        if (nextLeft !== prevPos.x || nextTop !== prevPos.y) {
          windowPositionRef.current = { x: nextLeft, y: nextTop }
          setWindowPosition({ x: nextLeft, y: nextTop })
        }
        if (nextWidth !== prevSize.width || nextHeight !== prevSize.height) {
          windowSizeRef.current = { width: nextWidth, height: nextHeight }
          setWindowSize({ width: nextWidth, height: nextHeight })
        }
      }

      const handlePointerUp = () => {
        resizeCleanupRef.current?.()
        resizeCleanupRef.current = null
        resizeState.current = null
      }

      document.addEventListener('pointermove', handleMove)
      document.addEventListener('pointerup', handlePointerUp)
      resizeCleanupRef.current = () => {
        document.removeEventListener('pointermove', handleMove)
        document.removeEventListener('pointerup', handlePointerUp)
      }
    },
    [maximized]
  )

  const getWindowTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Bug Basher'
      case '/dashboard':
        return 'Bug Dashboard'
      case '/bounty-leaderboard':
        return 'Bug Bounty Leaderboard'
      case '/bug/new':
        return 'File a Bug'
      case '/sign-up':
        return 'Sign Up'
      case '/easter-egg':
        return 'Secret Bug Found'
      case '/weather':
        return 'Weather Forecast'
      case '/fortune':
        return 'Fortune Cookie'
      case '/job-description':
        return 'Job Description'
      default:
        if (location.pathname.startsWith('/user/')) return 'User Profile'
        return 'Page Not Found'
    }
  }

  const windowTitle = getWindowTitle()

  const resizeHandles = maximized
    ? null
    : [
        {
          direction: 'top' as ResizeDirection,
          style: {
            top: 0,
            left: '50%',
            width: '40%',
            height: 8,
            transform: 'translate(-50%, -50%)',
            cursor: 'n-resize',
          },
        },
        {
          direction: 'bottom' as ResizeDirection,
          style: {
            bottom: 0,
            left: '50%',
            width: '40%',
            height: 8,
            transform: 'translate(-50%, 50%)',
            cursor: 's-resize',
          },
        },
        {
          direction: 'left' as ResizeDirection,
          style: {
            top: '50%',
            left: 0,
            width: 8,
            height: '40%',
            transform: 'translate(-50%, -50%)',
            cursor: 'w-resize',
          },
        },
        {
          direction: 'right' as ResizeDirection,
          style: {
            top: '50%',
            right: 0,
            width: 8,
            height: '40%',
            transform: 'translate(50%, -50%)',
            cursor: 'e-resize',
          },
        },
        {
          direction: 'top-left' as ResizeDirection,
          style: {
            top: 0,
            left: 0,
            width: 12,
            height: 12,
            transform: 'translate(-50%, -50%)',
            cursor: 'nw-resize',
          },
        },
        {
          direction: 'top-right' as ResizeDirection,
          style: {
            top: 0,
            right: 0,
            width: 12,
            height: 12,
            transform: 'translate(50%, -50%)',
            cursor: 'ne-resize',
          },
        },
        {
          direction: 'bottom-left' as ResizeDirection,
          style: {
            bottom: 0,
            left: 0,
            width: 12,
            height: 12,
            transform: 'translate(-50%, 50%)',
            cursor: 'sw-resize',
          },
        },
        {
          direction: 'bottom-right' as ResizeDirection,
          style: {
            bottom: 0,
            right: 0,
            width: 12,
            height: 12,
            transform: 'translate(50%, 50%)',
            cursor: 'se-resize',
          },
        },
      ].map(({ direction, style }) => (
        <div
          key={direction}
          className="absolute z-30"
          style={{ ...style, touchAction: 'none' }}
          aria-hidden
          onPointerDown={event => handleResizeStart(direction, event)}
        />
      ))

  return (
    <div className="min-h-screen bg-[#008080] font-['MS_Sans_Serif','Tahoma',sans-serif] flex flex-col">
      <div
        ref={desktopRef}
        className="relative flex-1 p-4"
        onClick={() => setSelectedIcon(null)}
      >
        <div
          className="relative z-10 flex flex-col gap-4"
          aria-label="Desktop shortcuts"
        >
          {DESKTOP_SHORTCUTS.map(shortcut => (
            <DesktopIcon
              key={shortcut.id}
              icon={shortcut.icon}
              label={shortcut.label}
              selected={selectedIcon === shortcut.id}
              onSelect={() => setSelectedIcon(shortcut.id)}
              onOpen={() => {
                setSelectedIcon(shortcut.id)
                showWindow()
                navigate(shortcut.path)
              }}
            />
          ))}
        </div>
        {!hidden && !minimized && (
          <div
            className="absolute z-20"
            style={
              maximized
                ? { inset: 0 }
                : {
                    top: windowPosition.y,
                    left: windowPosition.x,
                    width: windowSize.width,
                    height: windowSize.height,
                    minWidth: MIN_WINDOW_SIZE.width,
                    minHeight: MIN_WINDOW_SIZE.height,
                  }
            }
            onPointerDown={() => setSelectedIcon(null)}
          >
            <Window className="h-full">
              <TitleBar
                title={windowTitle}
                onPointerDown={handleTitleBarPointerDown}
                onDoubleClick={handleToggleMaximize}
                active={!minimized}
                controls={
                  <div className="flex gap-px">
                    {[
                      {
                        Icon: Minus,
                        label: 'Minimize',
                        onClick: () => setMinimized(true),
                      },
                      {
                        Icon: Square,
                        label: maximized ? 'Restore' : 'Maximize',
                        onClick: handleToggleMaximize,
                      },
                      {
                        Icon: CloseIcon,
                        label: 'Close',
                        onClick: () => {
                          if (maximized) {
                            handleToggleMaximize()
                          }
                          setHidden(true)
                          setMinimized(false)
                        },
                      },
                    ].map(({ Icon, label, onClick }) => (
                      <Win95Button
                        key={label}
                        aria-label={label}
                        onClick={event => {
                          event.stopPropagation()
                          onClick()
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Icon className="h-3 w-3 text-black" />
                      </Win95Button>
                    ))}
                  </div>
                }
              />
              <div className="bg-[#E0E0E0] flex flex-col flex-1 overflow-hidden p-3">
                <div className="mb-4 flex gap-1 bg-[#C0C0C0] p-1 sticky top-0 z-10">
                  <TabLink to="/" active={location.pathname === '/'}>
                    🐛 Bugs
                  </TabLink>
                  <TabLink
                    to="/dashboard"
                    active={location.pathname === '/dashboard'}
                  >
                    📊 Dashboard
                  </TabLink>
                  <TabLink
                    to="/bounty-leaderboard"
                    active={location.pathname === '/bounty-leaderboard'}
                  >
                    🏆 Leaderboard
                  </TabLink>
                  <TabLink
                    to="/weather"
                    active={location.pathname === '/weather'}
                  >
                    🌦️ Weather
                  </TabLink>
                  <TabLink
                    to="/fortune"
                    active={location.pathname === '/fortune'}
                  >
                    🥠 Fortune
                  </TabLink>
                  <TabLink
                    to="/sign-up"
                    active={location.pathname === '/sign-up'}
                  >
                    ✍️ Sign Up
                  </TabLink>
                  <TabLink
                    to="/job-description"
                    active={location.pathname === '/job-description'}
                  >
                    📄 Job Description
                  </TabLink>
                </div>
                <div className="relative z-0 flex flex-1 flex-col overflow-auto p-2">
                  <Suspense fallback={<div className="p-4">Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Bugs />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route
                        path="/bounty-leaderboard"
                        element={<Leaderboard />}
                      />
                      <Route path="/weather" element={<Weather />} />
                      <Route path="/fortune" element={<Fortune />} />
                      <Route path="/user/:userId" element={<UserProfile />} />
                      <Route path="/bug/new" element={<NewBug />} />
                      <Route path="/sign-up" element={<SignUp />} />
                      <Route
                        path="/job-description"
                        element={<JobDescription />}
                      />
                      <Route path="/easter-egg" element={<EasterEgg />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </div>
              </div>
            </Window>
            {resizeHandles}
          </div>
        )}
      </div>
      <Taskbar
        windowTitle={windowTitle}
        minimized={minimized}
        hidden={hidden}
        onToggle={() => {
          if (hidden) {
            showWindow()
            return
          }
          setMinimized(value => !value)
        }}
        onOpenWindow={showWindow}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AudioContext.Provider value={useAudio()}>
        <AppContent />
      </AudioContext.Provider>
    </BrowserRouter>
  )
}
