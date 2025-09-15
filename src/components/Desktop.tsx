import { useMemo, useState } from 'react'
import DesktopIcon from './DesktopIcon'
import DesktopWindow from './DesktopWindow'
import { useDesktop } from '../contexts/DesktopContext'

const CONTEXT_MENU_WIDTH = 160
const CONTEXT_MENU_HEIGHT = 110

export default function Desktop() {
  const { definitions, openWindow, windows, toggleStartMenu, startMenuOpen } =
    useDesktop()
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
  } | null>(null)

  const shortcuts = useMemo(
    () => definitions.filter(definition => definition.desktopShortcut),
    [definitions]
  )

  const visibleWindows = useMemo(
    () =>
      windows
        .filter(window => !window.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex),
    [windows]
  )

  const handleDesktopClick = () => {
    setSelectedIcon(null)
    setContextMenu(null)
    if (startMenuOpen) {
      toggleStartMenu(false)
    }
  }

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const x = Math.min(event.clientX, viewportWidth - CONTEXT_MENU_WIDTH)
    const y = Math.min(event.clientY, viewportHeight - CONTEXT_MENU_HEIGHT - 32)
    setContextMenu({ x, y })
    setSelectedIcon(null)
  }

  const handleMenuAction = (action: 'refresh' | 'arrange' | 'properties') => {
    setContextMenu(null)
    switch (action) {
      case 'refresh':
        window.location.reload()
        break
      case 'arrange':
        setSelectedIcon(null)
        break
      case 'properties':
        openWindow('/job-description')
        break
      default:
        break
    }
  }

  return (
    <div
      className="relative flex-1 overflow-hidden bg-[#008080]"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {shortcuts.map((shortcut, index) => (
        <DesktopIcon
          key={shortcut.id}
          id={shortcut.id}
          icon={shortcut.icon}
          label={shortcut.title}
          top={32 + index * 92}
          selected={selectedIcon === shortcut.id}
          onSelect={setSelectedIcon}
          onOpen={() => openWindow(shortcut.path)}
        />
      ))}

      {visibleWindows.map(window => (
        <DesktopWindow key={window.id} windowState={window} />
      ))}

      {contextMenu && (
        <div
          className="absolute z-[999] w-40 border-2 border-white bg-[#C0C0C0] text-sm shadow-[inset_-2px_-2px_0_0_rgba(0,0,0,0.55),inset_2px_2px_0_0_rgba(255,255,255,0.8)]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <ul className="divide-y divide-gray-400">
            <li>
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-[#000080] hover:text-white"
                onClick={() => handleMenuAction('refresh')}
              >
                🔄 Refresh
              </button>
            </li>
            <li>
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-[#000080] hover:text-white"
                onClick={() => handleMenuAction('arrange')}
              >
                📁 Arrange Icons
              </button>
            </li>
            <li>
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-[#000080] hover:text-white"
                onClick={() => handleMenuAction('properties')}
              >
                📋 Properties
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
