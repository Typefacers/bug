import { useEffect } from 'react'
import { START_MENU_APPS } from '../utils/window-apps'
import { useWindowManager } from '../contexts/WindowManagerContext'

type StartMenuProps = {
  anchorRect: DOMRect | null
  onClose: () => void
}

const MENU_WIDTH = 260

export default function StartMenu({ anchorRect, onClose }: StartMenuProps) {
  const { openWindow } = useWindowManager()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024
  const viewportHeight =
    typeof window !== 'undefined' ? window.innerHeight : 768

  const anchorLeft = anchorRect?.left ?? 8
  const anchorTop = anchorRect?.top ?? viewportHeight - 40

  const left = Math.min(anchorLeft, viewportWidth - MENU_WIDTH - 12)
  const bottom = Math.max(viewportHeight - anchorTop + 2, 8)

  return (
    <div
      className="pointer-events-auto fixed z-50 w-[260px] text-[13px]"
      style={{ left, bottom }}
      role="menu"
      aria-label="Start menu"
    >
      <div className="start-menu-shadow border-t border-l border-white border-b-[2px] border-r-[2px] border-[#404040] bg-[#C0C0C0] text-black">
        <div className="flex">
          <div className="start-menu__brand flex w-[36px] items-end justify-center bg-gradient-to-b from-[#00007B] via-[#008080] to-[#4EA0C6] text-white">
            <span className="start-menu__brand-text">Windows 95</span>
          </div>
          <div className="flex-1 border-l border-[#808080] bg-[#C0C0C0] p-1">
            <ul className="flex flex-col gap-1">
              {START_MENU_APPS.map(item => (
                <li key={item.id}>
                  <StartMenuItem
                    icon={item.icon}
                    title={item.title}
                    onSelect={() => {
                      openWindow(item.id)
                      onClose()
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type StartMenuItemProps = {
  icon: string
  title: string
  onSelect: () => void
}

function StartMenuItem({ icon, title, onSelect }: StartMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-8 w-full items-center gap-3 truncate border-t border-l border-white border-b border-r border-[#808080] bg-[#C0C0C0] px-3 text-left font-['MS_Sans_Serif','Tahoma',sans-serif] text-[13px] font-semibold text-black transition-colors hover:bg-[#000080] hover:text-white focus:outline-none focus-visible:bg-[#000080] focus-visible:text-white"
    >
      <span aria-hidden className="text-lg">
        {icon}
      </span>
      <span className="truncate">{title}</span>
    </button>
  )
}
