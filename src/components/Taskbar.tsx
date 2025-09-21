import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { styled } from 'styled-components'
import { AppBar, Toolbar, Button, Frame, Separator } from 'react95'
import StartMenu from './StartMenu'
import { useWindowManager } from '../contexts/WindowManagerContext'

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const TaskbarAppBar = styled(AppBar)`
  position: relative;
  top: auto;
  bottom: 0;
  left: 0;
  right: auto;
`

const TaskbarToolbar = styled(Toolbar)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
`

const StyledStartButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 14px;
  font-weight: 700;
  font-size: 13px;
`

const WindowButtonsFrame = styled(Frame).attrs({ variant: 'status' as const })`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  min-height: 36px;
`

const WindowButton = styled(Button).attrs({
  variant: 'thin' as const,
  size: 'sm' as const,
})`
  min-width: 140px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
`

const StatusGroup = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
`

const StatusIconsFrame = styled(Frame).attrs({ variant: 'status' as const })`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
`

const ClockFrame = styled(Frame).attrs({ variant: 'status' as const })`
  min-width: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  font-variant-numeric: tabular-nums;
`

const StartMenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
`

type StartButtonProps = {
  open: boolean
  onClick: () => void
}

const StartButton = forwardRef<HTMLButtonElement, StartButtonProps>(
  ({ open, onClick }, ref) => (
    <StyledStartButton
      ref={ref}
      onClick={onClick}
      active={open}
      aria-pressed={open}
    >
      <Windows95Logo />
      Start
    </StyledStartButton>
  )
)

StartButton.displayName = 'StartButton'

function Windows95Logo() {
  return (
    <svg viewBox="0 0 26 26" role="presentation" aria-hidden="true">
      <path d="M1 8L9 6.8V12.5L1 13.8V8Z" fill="#d40000" />
      <path d="M11 6.3L25 4V12.8L11 11.2V6.3Z" fill="#00a2e8" />
      <path d="M1 15.4L9 16.3V22L1 20.8V15.4Z" fill="#ffc20e" />
      <path d="M11 17L25 18.2V26L11 23.8V17Z" fill="#00a651" />
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 16 16" role="presentation" aria-hidden="true">
      <path d="M1.5 6.5h2.9L7.5 4v8L4.4 9.5H1.5v-3Z" fill="#000" />
      <path
        d="M10 6v4M12 5v6"
        stroke="#000"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg viewBox="0 0 16 16" role="presentation" aria-hidden="true">
      <rect x="1" y="3" width="14" height="9" fill="#000" />
      <rect x="2" y="4" width="12" height="7" fill="#c0c0c0" />
      <rect x="5" y="13" width="6" height="1.5" fill="#000" />
      <rect x="4" y="14.5" width="8" height="1" fill="#808080" />
    </svg>
  )
}

export default function Taskbar() {
  const { windows, activeWindowId, toggleMinimize, focusWindow, apps } =
    useWindowManager()
  const [time, setTime] = useState(getTime())
  const [open, setOpen] = useState(false)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
  const startButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setAnchorRect(null)
      return
    }

    const button = startButtonRef.current
    if (!button) return

    const updateRect = () => {
      setAnchorRect(button.getBoundingClientRect())
    }

    updateRect()

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateRect)
        : null

    resizeObserver?.observe(button)
    window.addEventListener('resize', updateRect)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updateRect)
    }
  }, [open])

  const orderedWindows = useMemo(
    () => [...windows].sort((a, b) => a.zIndex - b.zIndex),
    [windows]
  )

  return (
    <TaskbarAppBar position="relative">
      <TaskbarToolbar>
        <StartButton
          ref={startButtonRef}
          open={open}
          onClick={() => setOpen(value => !value)}
        />

        <Separator orientation="vertical" size={28} />

        <WindowButtonsFrame>
          {orderedWindows.map(window => {
            const definition = apps[window.appId]
            const isActive = activeWindowId === window.id && !window.minimized

            return (
              <WindowButton
                key={window.id}
                active={isActive}
                onClick={() => {
                  if (window.minimized || isActive) {
                    toggleMinimize(window.id)
                  } else {
                    focusWindow(window.id)
                  }
                }}
                title={window.title}
              >
                <span aria-hidden>{definition?.icon ?? '🪟'}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {window.title}
                </span>
              </WindowButton>
            )
          })}
        </WindowButtonsFrame>

        <Separator orientation="vertical" size={28} />

        <StatusGroup>
          <StatusIconsFrame>
            <MonitorIcon />
            <SpeakerIcon />
          </StatusIconsFrame>
          <ClockFrame>{time}</ClockFrame>
        </StatusGroup>
      </TaskbarToolbar>

      {open && (
        <>
          <StartMenuBackdrop onClick={() => setOpen(false)} />
          <StartMenu anchorRect={anchorRect} onClose={() => setOpen(false)} />
        </>
      )}
    </TaskbarAppBar>
  )
}
