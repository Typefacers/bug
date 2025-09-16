import clsx from 'clsx'
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import StartMenu from './StartMenu'
import { useWindowManager } from '../contexts/WindowManagerContext'

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const taskbarFrame =
  'shadow-[inset_0_1px_0_0_#ffffff,inset_0_2px_0_0_#dfdfdf,inset_0_-1px_0_0_#808080,inset_0_-2px_0_0_#404040]'

type StartButtonProps = {
  open: boolean
  onClick: () => void
}

const StartButton = forwardRef<HTMLButtonElement, StartButtonProps>(
  ({ open, onClick }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-pressed={open}
        className={clsx(
          'flex h-[32px] items-center gap-2 px-4 text-[13px] font-semibold tracking-tight text-black transition-colors',
          "font-['MS_Sans_Serif','Tahoma',sans-serif]",
          open
            ? 'border-t-[2px] border-l-[2px] border-[#404040] border-b border-r border-white bg-[#9C9C9C] shadow-[inset_1px_1px_0_0_#cfcfcf,inset_-1px_-1px_0_0_#707070]'
            : 'border-t-[2px] border-l-[2px] border-white border-b border-r border-[#404040] bg-[#C0C0C0] shadow-[inset_-1px_-1px_0_0_#808080,inset_1px_1px_0_0_#dfdfdf] hover:bg-[#d6d6d6]'
        )}
      >
        <Windows95Logo className="h-5 w-5" />
        <span className="tracking-[0.03em]">Start</span>
      </button>
    )
  }
)

StartButton.displayName = 'StartButton'

function Windows95Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 26 26"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 8L9 6.8V12.5L1 13.8V8Z" fill="#d40000" />
      <path d="M11 6.3L25 4V12.8L11 11.2V6.3Z" fill="#00a2e8" />
      <path d="M1 15.4L9 16.3V22L1 20.8V15.4Z" fill="#ffc20e" />
      <path d="M11 17L25 18.2V26L11 23.8V17Z" fill="#00a651" />
    </svg>
  )
}

function Divider() {
  return (
    <div className="flex h-[32px] w-[3px] items-stretch" aria-hidden="true">
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
        ? new ResizeObserver(() => updateRect())
        : null

    resizeObserver?.observe(button)
    window.addEventListener('resize', updateRect)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updateRect)
    }
  }, [open])

  return (
    <div
      className={`relative flex h-[40px] items-center gap-2 bg-[#C0C0C0] px-3 text-[13px] ${taskbarFrame}`}
    >
      <StartButton
        ref={startButtonRef}
        open={open}
        onClick={() => setOpen(value => !value)}
      />

      <Divider />

      <div className="flex h-9 flex-1 items-center gap-1 overflow-x-auto overflow-y-hidden border-t border-l border-white border-b-[2px] border-r-[2px] border-[#808080] bg-[#C0C0C0] px-2">
        {windows.map(window => {
          const definition = apps[window.appId]
          const isActive = activeWindowId === window.id && !window.minimized

          return (
            <button
              key={window.id}
              onClick={() => {
                if (window.minimized || isActive) {
                  toggleMinimize(window.id)
                } else {
                  focusWindow(window.id)
                }
              }}
              className={clsx(
                'flex h-7 min-w-[140px] flex-shrink-0 items-center gap-2 truncate px-3 text-left text-[12px] font-semibold transition-colors',
                isActive
                  ? 'border-t border-l border-[#404040] border-b-[2px] border-r-[2px] border-white bg-[#9C9C9C] text-black shadow-[inset_1px_1px_0_0_#dfdfdf,inset_-1px_-1px_0_0_#808080]'
                  : 'border-t border-l border-white border-b-[2px] border-r-[2px] border-[#404040] bg-[#C3C3C3] text-black hover:bg-[#d9d9d9]'
              )}
            >
              <span aria-hidden>{definition?.icon ?? '🪟'}</span>
              <span className="truncate text-left">{window.title}</span>
            </button>
          )
        })}
      </div>

      <Divider />

      <div className="flex h-9 items-center gap-2">
        <div className="flex h-full items-center gap-2 border-t border-l border-white border-b-[2px] border-r-[2px] border-[#808080] bg-[#C0C0C0] px-2">
          <MonitorIcon className="h-4 w-4" />
          <SpeakerIcon className="h-4 w-4" />
        </div>
        <div className="flex h-full min-w-[88px] items-center justify-center border-t border-l border-white border-b-[2px] border-r-[2px] border-[#808080] bg-[#C0C0C0] px-3 font-['MS_Sans_Serif','Tahoma',sans-serif]">
          {time}
        </div>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <StartMenu anchorRect={anchorRect} onClose={() => setOpen(false)} />
        </>
      )}
    </div>
  )
}
