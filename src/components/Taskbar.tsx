import { useEffect, useState } from 'react'
import { raised, sunken } from '../utils/win95'
import type { TaskbarProps } from '../types/taskbar-props'

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function Taskbar({
  windowTitle,
  minimized,
  onToggle,
}: TaskbarProps) {
  const [time, setTime] = useState(getTime())

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className={`h-8 bg-[#C0C0C0] flex items-center px-1 justify-between ${sunken}`}
    >
      <button
        className={`flex items-center h-6 px-2 gap-1 bg-[#C0C0C0] ${raised} active:${sunken}`}
      >
        <span className="w-3 h-3 bg-[#000080]" />
        <span className="text-sm font-bold">Start</span>
      </button>
      <div className="flex-1 flex items-center px-1">
        <button
          onClick={onToggle}
          className={`h-6 px-2 flex items-center truncate bg-[#C0C0C0] ${raised} ${
            minimized ? '' : sunken
          } active:${sunken}`}
        >
          {windowTitle}
        </button>
      </div>
      <div className={`h-6 px-2 bg-[#C0C0C0] ${raised} font-mono text-sm`}>
        {time}
      </div>
    </div>
  )
}
