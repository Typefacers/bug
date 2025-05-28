import { raised, sunken } from '../utils/win95'
import { useEffect, useState } from 'react'

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
        className={`h-6 px-2 flex items-center gap-1 bg-[#C0C0C0] mr-1 ${raised} active:${sunken}`}
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
          <path fill="#F35325" d="M0 0h7v7H0z" />
          <path fill="#81BC06" d="M0 9h7v7H0z" />
          <path fill="#05A6F0" d="M9 0h7v7H9z" />
          <path fill="#FFBA08" d="M9 9h7v7H9z" />
        </svg>
        Start
      </button>
      {!hidden && (
        <button
          onClick={onShow}
          className={`h-6 px-2 bg-[#C0C0C0] ${minimized ? raised : sunken}`}
        >
          {title}
        </button>
      )}
      <div className="ml-auto px-2 text-xs">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
