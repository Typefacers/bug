import { useEffect, useState } from 'react'
import { raised, sunken } from '../utils/win95'

interface TaskbarProps {
  minimized: boolean
  hidden: boolean
  title: string
  onShow: () => void
}

export default function Taskbar({
  minimized,
  hidden,
  title,
  onShow,
}: TaskbarProps) {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-8 bg-[#C0C0C0] flex items-center px-1 border-t-2 border-t-white border-l-2 border-l-white border-b-2 border-b-gray-500 border-r-2 border-r-gray-500">
      <button
        className={`h-6 px-2 pr-3 flex items-center gap-1 bg-[#C0C0C0] text-black ${raised}`}
      >
        <span className="text-lg leading-none">🪟</span>
        <span className="text-sm font-bold text-[#000080]">Start</span>
      </button>
      {!hidden && (
        <button
          onClick={onShow}
          className={`h-6 px-2 mx-1 bg-[#C0C0C0] ${minimized ? raised : sunken}`}
        >
          {title}
        </button>
      )}
      <div
        className={`ml-auto h-6 px-2 flex items-center justify-center bg-[#C0C0C0] ${raised} font-mono text-xs`}
      >
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
