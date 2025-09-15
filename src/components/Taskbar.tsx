import { useEffect, useMemo, useState } from 'react'
import { raised, sunken, taskbarDivider, taskbarSurface } from '../utils/win95'
import StartMenu from './StartMenu'
import Win95Button from './win95/Button'
import { useWindowManager } from '../contexts/WindowManagerContext'

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const GRIP_DOTS = Array.from({ length: 6 }, (_, index) => index)

function StartLogo() {
  return (
    <svg
      viewBox="0 0 14 14"
      role="presentation"
      aria-hidden
      className="h-3.5 w-3.5"
      shapeRendering="crispEdges"
    >
      <rect width="6" height="6" fill="#ff0000" />
      <rect x="7" width="6" height="6" fill="#00a000" />
      <rect x="1" y="7" width="6" height="6" fill="#0000ff" />
      <rect x="8" y="7" width="6" height="6" fill="#ffff00" />
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
    <div
      className={`relative h-10 w-full bg-[#C0C0C0] px-2 flex items-center gap-2 ${taskbarSurface}`}
    >
      <Win95Button
        onClick={() => setOpen(v => !v)}
        aria-pressed={open}
        variant={open ? 'sunken' : 'raised'}
        className="h-9 min-w-[96px] justify-start gap-2 px-3 pr-4 py-0 text-sm font-bold italic leading-none tracking-tight text-black"
      >
        <StartLogo />
        <span className="pt-px">Start</span>
      </Win95Button>

      <div aria-hidden className={`h-9 w-[2px] ${taskbarDivider}`} />

      <div
        className={`flex-1 h-9 flex items-center gap-1 overflow-x-auto overflow-y-hidden px-2 whitespace-nowrap bg-[#BDBDBD] ${sunken}`}
      >
        <div
          aria-hidden
          className="mr-2 flex h-full flex-shrink-0 items-center pl-1 pr-2"
        >
          <div className="grid grid-cols-2 gap-[1px]">
            {GRIP_DOTS.map(dot => (
              <span
                key={dot}
                className="block h-1 w-1 bg-[#404040] shadow-[1px_1px_0_0_#ffffff]"
              />
            ))}
          </div>
        </div>

        {orderedWindows.map(window => {
          const definition = apps[window.appId]
          const isActive = activeWindowId === window.id && !window.minimized

          return (
            <Win95Button
              key={window.id}
              onClick={() => {
                if (window.minimized || isActive) {
                  toggleMinimize(window.id)
                } else {
                  focusWindow(window.id)
                }
              }}
              variant={isActive ? 'sunken' : 'raised'}
              className="h-7 min-w-[140px] shrink-0 justify-start gap-2 truncate px-3 py-0 text-sm leading-tight"
            >
              <span aria-hidden>{definition?.icon ?? '🪟'}</span>
              <span className="truncate text-left">{window.title}</span>
            </Win95Button>
          )
        })}
      </div>

      <div aria-hidden className={`h-9 w-[2px] ${taskbarDivider}`} />

      <div
        className={`flex h-9 min-w-[96px] items-center justify-center px-3 text-sm font-normal leading-none font-mono bg-[#C0C0C0] ${raised}`}
      >
        {time}
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <StartMenu onClose={() => setOpen(false)} />
        </>
      )}
    </div>
  )
}
