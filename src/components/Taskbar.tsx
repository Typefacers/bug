import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { raised, sunken } from '../utils/win95'
import StartMenu from './StartMenu'
import Win95Button from './win95/Button'
import { useDesktop } from '../contexts/DesktopContext'

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function Taskbar() {
  const {
    windows,
    activeWindowId,
    toggleMinimize,
    focusWindow,
    startMenuOpen,
    toggleStartMenu,
  } = useDesktop()
  const [time, setTime] = useState(getTime())

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [])

  const orderedWindows = useMemo(
    () => windows.filter(window => window.isOpen),
    [windows]
  )

  const activeClasses = useMemo(
    () =>
      sunken
        .split(' ')
        .map(cls => `active:${cls}`)
        .join(' '),
    []
  )

  const handleTaskbarClick = (windowId: string, minimized: boolean) => {
    if (minimized) {
      toggleMinimize(windowId)
      return
    }

    if (activeWindowId === windowId) {
      toggleMinimize(windowId)
    } else {
      focusWindow(windowId)
    }
  }

  return (
    <div
      className={`relative flex h-8 shrink-0 items-center justify-between bg-[#C0C0C0] px-1 ${sunken}`}
    >
      <Win95Button
        onClick={() => toggleStartMenu()}
        className={clsx(
          'flex h-6 items-center gap-1 bg-[#C0C0C0] px-2',
          startMenuOpen ? sunken : '',
          !startMenuOpen && activeClasses
        )}
      >
        <span className="w-3 h-3 bg-[#000080]" />
        <span className="text-sm font-bold">Start</span>
      </Win95Button>
      <div className="flex flex-1 items-center gap-1 px-2">
        {orderedWindows.map(window => {
          const isActive = activeWindowId === window.id && !window.isMinimized
          return (
            <Win95Button
              key={window.id}
              onClick={() => handleTaskbarClick(window.id, window.isMinimized)}
              className={clsx(
                'flex h-6 min-w-[8rem] items-center gap-2 truncate px-2 text-left',
                isActive ? sunken : '',
                !isActive && !window.isMinimized && activeClasses
              )}
            >
              <span aria-hidden="true">{window.icon}</span>
              <span className="truncate text-sm">{window.title}</span>
            </Win95Button>
          )
        })}
      </div>
      <div className={`h-6 px-2 bg-[#C0C0C0] ${raised} font-mono text-sm`}>
        {time}
      </div>
      {startMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => toggleStartMenu(false)}
          />
          <StartMenu />
        </>
      )}
    </div>
  )
}
