import { raised, sunken, windowShadow } from '../utils/win95'
import { START_MENU_APPS } from '../utils/window-apps'
import { useWindowManager } from '../contexts/WindowManagerContext'

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindowManager()
  const itemClass = `block w-full text-left px-2 py-1 ${raised} bg-[#E0E0E0] hover:${sunken}`

  return (
    <div
      className={`absolute bottom-8 left-0 w-48 p-2 bg-[#C0C0C0] ${raised} ${windowShadow} text-sm z-50`}
    >
      <ul className="space-y-1">
        {START_MENU_APPS.map(app => (
          <li key={app.id}>
            <button
              type="button"
              className={itemClass}
              onClick={() => {
                openWindow(app.id)
                onClose()
              }}
            >
              <span className="mr-2" aria-hidden>
                {app.icon}
              </span>
              {app.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
