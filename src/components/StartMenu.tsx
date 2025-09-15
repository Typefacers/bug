import { raised, windowShadow } from '../utils/win95'
import { START_MENU_APPS } from '../utils/window-apps'
import { useWindowManager } from '../contexts/WindowManagerContext'

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindowManager()
  const itemClass =
    'flex w-full items-center gap-2 px-3 py-2 text-left text-black hover:bg-[#000080] hover:text-white focus-visible:bg-[#000080] focus-visible:text-white'

  return (
    <div
      className={`absolute bottom-[calc(100%+6px)] left-0 flex w-64 bg-[#C0C0C0] ${raised} ${windowShadow} text-sm z-50`}
    >
      <div className="flex flex-col items-center justify-between bg-gradient-to-b from-[#000080] via-[#000060] to-[#000040] px-3 py-4 text-white">
        <span className="grid h-6 w-6 grid-cols-2 grid-rows-2 gap-[1px]">
          <span className="bg-[#01017A]" />
          <span className="bg-[#D80000]" />
          <span className="bg-[#008001]" />
          <span className="bg-[#F4F100]" />
        </span>
        <span className="-rotate-90 origin-bottom-left whitespace-nowrap text-lg font-bold tracking-[0.35em]">
          Windows 95
        </span>
      </div>
      <div className="flex-1 p-3">
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
                <span aria-hidden>{app.icon}</span>
                {app.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
