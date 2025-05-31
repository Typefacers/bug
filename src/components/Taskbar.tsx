import { useEffect, useState, useRef } from 'react'
import { raised, sunken } from '../utils/win95'
import type { TaskbarProps } from '../types/taskbar-props'
import StartMenu from './StartMenu'
// import Win95Logo from '../assets/win95-logo.png'; // Removed logo import

// Define the structure for an application window
interface AppWindow {
  id: string
  title: string
  icon: string // For now, a string placeholder for an icon
  isActive: boolean
}

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function Taskbar({
  windowTitle, // This might represent the main application window title
  minimized, // This might relate to the main application window
  onToggle, // This might relate to the main application window
}: TaskbarProps) {
  const [time, setTime] = useState(getTime())
  // State for simulated open applications
  const [openApps, setOpenApps] = useState<AppWindow[]>([
    { id: '1', title: 'My Computer', icon: '[C]', isActive: true },
    { id: '2', title: 'Recycle Bin', icon: '[RB]', isActive: false },
    { id: '3', title: 'Notepad - Untitled', icon: '[N]', isActive: false },
  ])
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const startButtonRef = useRef<HTMLButtonElement>(null)
  const startMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [])

  const toggleStartMenu = () => {
    setIsStartMenuOpen(prev => !prev)
  }

  const handleAppButtonClick = (appId: string) => {
    setOpenApps(prevApps =>
      prevApps.map(app => ({
        ...app,
        isActive: app.id === appId,
      }))
    )
    // Note: If the main `windowTitle` prop functionality needs to interact with this,
    // further logic might be needed here or in how `onToggle` and `minimized` are handled.
  }

  // Effect to handle clicks outside the StartMenu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isStartMenuOpen &&
        startButtonRef.current &&
        !startButtonRef.current.contains(event.target as Node) &&
        startMenuRef.current &&
        !startMenuRef.current.contains(event.target as Node)
      ) {
        setIsStartMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isStartMenuOpen])

  return (
    <div
      className={`h-8 bg-[#C0C0C0] flex items-center px-1 justify-between ${sunken} relative`} // Added relative for positioning StartMenu
    >
      {/* Start Button with Tooltip */}
      <div className="relative has-tooltip">
        {' '}
        {/* Ensure this outer div is relative if not already by parent */}
        <button
          ref={startButtonRef}
          onClick={toggleStartMenu}
          className={`flex items-center h-6 px-2 gap-1 bg-[#C0C0C0] ${raised} active:${sunken} win95-button`}
        >
          <span className="mr-1 text-base" role="img" aria-label="Start menu icon">🪟</span> {/* Emoji with styling */}
          <span className="text-sm font-bold">Start</span>
        </button>
        <span className="win95-tooltip-text">Click here to begin.</span>
        {/* Render StartMenu conditionally */}
        <div ref={startMenuRef}>
          <StartMenu
            isOpen={isStartMenuOpen}
            onClose={() => setIsStartMenuOpen(false)}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center px-1 space-x-1 overflow-hidden">
        {/* Button for the main application window passed via props, if title exists */}
        {windowTitle && (
          <div className="has-tooltip">
            <button
              onClick={onToggle}
              className={`h-6 px-2 flex items-center max-w-[150px] truncate bg-[#C0C0C0] ${
                minimized ? raised : sunken
              } active:${sunken} win95-button text-xs`}
              // title={windowTitle} // Replaced by custom tooltip
            >
              <span className="text-xs">{windowTitle}</span>
            </button>
            <span className="win95-tooltip-text">{windowTitle}</span>
          </div>
        )}

        {/* Buttons for simulated open applications */}
        {openApps.map(app => (
          <div key={app.id} className="has-tooltip">
            <button
              onClick={() => handleAppButtonClick(app.id)}
              className={`h-6 px-1 md:px-2 flex items-center max-w-[100px] md:max-w-[150px] truncate bg-[#C0C0C0] ${
                app.isActive ? sunken : raised
              } active:${sunken} win95-button text-xs`}
              // title={app.title} // Replaced by custom tooltip
            >
              <span className="mr-1 hidden sm:inline">{app.icon}</span>
              <span className="text-xs">{app.title}</span>
            </button>
            <span className="win95-tooltip-text">{app.title}</span>
          </div>
        ))}
      </div>

      {/* System Tray and Clock grouped together */}
      <div className="flex items-center">
        <div
          className={`h-6 px-1 mr-1 flex items-center space-x-1 bg-[#C0C0C0] ${sunken}`}
        >
          {/* Placeholder System Tray Icons with Tooltips */}
          <div className="has-tooltip">
            <span className="text-sm cursor-default">🔊</span>
            <span className="win95-tooltip-text">Volume</span>
          </div>
          <div className="has-tooltip">
            <span className="text-sm cursor-default">📶</span>
            <span className="win95-tooltip-text">Network Status</span>
          </div>
        </div>
        <div
          className={`h-6 px-2 bg-[#C0C0C0] ${raised} win95-button font-mono text-sm flex items-center`}
        >
          {time}
        </div>
      </div>
    </div>
  )
}
