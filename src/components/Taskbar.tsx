import { useEffect, useState } from 'react'
import { raised, sunken } from '../utils/win95'
import StartMenu from './StartMenu'
import type { TaskbarProps } from '../types/taskbar-props'
import Win95Button from './Win95Button'

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function Taskbar({
  windowTitle,
  minimized,
  onToggle,
}: TaskbarProps) {
  const [time, setTime] = useState(getTime())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-7 bg-[#C0C0C0] flex items-center px-0.5 justify-between ${sunken} z-50`}
    >
      <Win95Button
        onClick={() => setOpen(v => !v)}
        variant="start"
        pressed={open}
      >
        <div className="w-4 h-3 win95-start-icon"></div>
        <span className="font-bold">Start</span>
      </Win95Button>
      <div className="flex-1 flex items-center px-0.5">
        <Win95Button
          onClick={onToggle}
          pressed={!minimized}
          className="flex-1 h-5 flex items-center justify-start truncate"
        >
          {windowTitle}
        </Win95Button>
      </div>
      <div className={`h-5 px-1.5 bg-[#C0C0C0] ${raised} font-['MS_Sans_Serif',_sans-serif] text-xs flex items-center`}>
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
