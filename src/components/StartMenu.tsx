import { raised, sunken, windowShadow } from '../utils/win95'
import { useDesktop } from '../contexts/DesktopContext'

export default function StartMenu() {
  const { definitions, openWindow, toggleStartMenu } = useDesktop()
  const items = definitions.filter(definition => definition.startMenu !== false)

  return (
    <div
      className={`absolute bottom-8 left-0 z-50 w-48 p-2 bg-[#C0C0C0] ${raised} ${windowShadow} text-sm`}
    >
      <ul className="space-y-1">
        {items.map(item => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                openWindow(item.path)
                toggleStartMenu(false)
              }}
              className={`flex w-full items-center gap-2 px-2 py-1 ${raised} bg-[#E0E0E0] text-left hover:${sunken}`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.startLabel ?? item.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
