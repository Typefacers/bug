import { useEffect, useMemo, useState } from 'react'
import { raised, sunken } from '../utils/win95'
import StartMenu from './StartMenu'
import Win95Button from './win95/Button'
import { useWindowManager } from '../contexts/WindowManagerContext'

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

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
      className={`relative h-10 bg-[#C0C0C0] flex items-center px-2 ${sunken}`}
    >
      <Win95Button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center h-7 px-3 gap-2 bg-[#C0C0C0] ${raised} active:${sunken}`}
      >
        <span className="w-3 h-3 bg-[#000080]" />
        <span className="text-sm font-bold">Start</span>
      </Win95Button>

      <div className="flex-1 flex items-center px-2 gap-2 overflow-x-auto">
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
              className={`h-7 px-3 flex items-center gap-2 truncate bg-[#C0C0C0] ${raised} ${
                isActive ? sunken : ''
              }`}
            >
              <span aria-hidden>{definition?.icon ?? '🪟'}</span>
              <span className="truncate max-w-[12rem] text-left">
                {window.title}
              </span>
            </Win95Button>
          )
        })}
      </div>

      <div className={`h-7 px-3 bg-[#C0C0C0] ${raised} font-mono text-sm`}>
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
