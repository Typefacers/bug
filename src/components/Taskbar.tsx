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
  return (
    <div className="h-8 bg-[#C0C0C0] flex items-center px-1 border-t-2 border-t-white border-l-2 border-l-white border-b-2 border-b-gray-500 border-r-2 border-r-gray-500">
      <button className={`h-6 px-3 bg-[#C0C0C0] mr-1 ${raised}`}>Start</button>
      {!hidden && (
        <button
          onClick={onShow}
          className={`h-6 px-2 bg-[#C0C0C0] ${minimized ? raised : sunken}`}
        >
          {title}
        </button>
      )}
    </div>
  )
}
