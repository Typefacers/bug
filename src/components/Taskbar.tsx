import { useEffect, useMemo, useState } from 'react'
import { Button, Frame, Toolbar } from 'react95'
import StartMenu from './StartMenu'
import { useWindowManager } from '../contexts/WindowManagerContext'

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

type StartButtonProps = {
  open: boolean
  onClick: () => void
}

function StartButton({ open, onClick }: StartButtonProps) {
  const base =
    'relative flex h-9 items-center gap-2 px-4 text-[13px] font-semibold tracking-tight select-none'
  const gradient =
    'bg-[linear-gradient(180deg,#3fc162_0%,#35a854_35%,#2b8a45_70%,#1f6d37_100%)]'

  return (
    <Button
      type="button"
      aria-pressed={open}
      onClick={onClick}
      active={open}
      className={`${base} ${gradient}`}
    >
      <WindowsLogo className="h-4 w-4" />
      <span className="tracking-[0.02em]">Start</span>
    </Button>
  )
}

function WindowsLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 6.5L12.5 4v7L1 12.5V6.5Z" fill="#f35325" />
      <path d="M14 3.5L27 1v10.5L14 11.5V3.5Z" fill="#07a6f0" />
      <path d="M1 14L12.5 15.5v7L1 19.5V14Z" fill="#ffba08" />
      <path d="M14 16l13 1.5V27L14 24.5V16Z" fill="#00b050" />
    </svg>
  )
}

function Divider() {
  return (
    <div className="flex h-9 w-[3px] items-stretch" aria-hidden="true">
      <div className="w-px bg-[#808080]" />
      <div className="w-px bg-white" />
    </div>
  )
}

function SpeakerIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
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

function MonitorIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1" y="3" width="14" height="9" fill="#000" />
      <rect x="2" y="4" width="12" height="7" fill="#C0C0C0" />
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

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [])

  const orderedWindows = useMemo(
    () => [...windows].sort((a, b) => a.zIndex - b.zIndex),
    [windows]
  )

  return (
    <Frame
      variant="status"
      className="relative flex h-12 items-center gap-2 bg-material px-3"
      shadow
    >
      <StartButton open={open} onClick={() => setOpen(value => !value)} />

      <Divider />

      <Frame
        variant="field"
        className="flex h-9 flex-1 items-center overflow-hidden bg-material"
      >
        <Toolbar
          className="h-full w-full gap-1 overflow-x-auto overflow-y-hidden px-2"
          noPadding
        >
          {orderedWindows.map(window => {
            const definition = apps[window.appId]
            const isActive = activeWindowId === window.id && !window.minimized

            return (
              <Button
                key={window.id}
                onClick={() => {
                  if (window.minimized || isActive) {
                    toggleMinimize(window.id)
                  } else {
                    focusWindow(window.id)
                  }
                }}
                active={isActive}
                className="flex h-7 min-w-[140px] flex-shrink-0 items-center gap-2 truncate justify-start"
              >
                <span aria-hidden>{definition?.icon ?? '🪟'}</span>
                <span className="truncate text-left">{window.title}</span>
              </Button>
            )
          })}
        </Toolbar>
      </Frame>

      <Divider />

      <Toolbar className="flex h-9 items-center gap-2" noPadding>
        <Frame
          variant="field"
          className="flex h-full items-center gap-2 bg-material px-2"
        >
          <MonitorIcon className="h-4 w-4" />
          <SpeakerIcon className="h-4 w-4" />
        </Frame>
        <Frame
          variant="field"
          className="flex h-full min-w-[88px] items-center justify-center bg-material px-3 font-['ms_sans_serif','Tahoma',sans-serif]"
        >
          {time}
        </Frame>
      </Toolbar>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <StartMenu onClose={() => setOpen(false)} />
        </>
      )}
    </Frame>
  )
}
