import { MenuList, MenuListItem, Window } from 'react95'
import { START_MENU_APPS } from '../utils/window-apps'
import { useWindowManager } from '../contexts/WindowManagerContext'

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindowManager()

  return (
    <Window
      className="absolute left-[4px] bottom-[calc(100%+4px)] w-52 z-50"
      shadow
    >
      <MenuList fullWidth>
        {START_MENU_APPS.map(app => (
          <MenuListItem
            key={app.id}
            onClick={() => {
              openWindow(app.id)
              onClose()
            }}
          >
            <div className="flex w-full items-center gap-2">
              <span aria-hidden>{app.icon}</span>
              <span className="flex-1 text-left">{app.title}</span>
            </div>
          </MenuListItem>
        ))}
      </MenuList>
    </Window>
  )
}
