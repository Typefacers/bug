import { useEffect, useState } from 'react'
import { raised, sunken } from '../utils/win95'
import StartMenu from './StartMenu'
import type { TaskbarProps } from '../types/taskbar-props'
import { Button } from '@nattui/react-components'

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
      className={`h-8 bg-[#C0C0C0] flex items-center px-1 justify-between ${sunken}`}
    >
      <Button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center h-6 px-2 gap-1 bg-[#C0C0C0] ${raised} active:${sunken}`}
      >
        <span className="w-3 h-3 bg-[#000080]" />
        <span className="text-sm font-bold">Start</span>
      </Button>
      <div className="flex-1 flex items-center px-1">
        <Button
          onClick={onToggle}
          className={`h-6 px-2 flex items-center truncate bg-[#C0C0C0] ${raised} ${
            minimized ? '' : sunken
          } active:${sunken}`}
        >
          {windowTitle}
        </Button>
      </div>
      <div className={`h-6 px-2 bg-[#C0C0C0] ${raised} font-mono text-sm`}>
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
