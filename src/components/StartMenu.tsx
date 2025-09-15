import { MenuList, MenuListItem, Window } from 'react95'
import { START_MENU_APPS } from '../utils/window-apps'
import { useWindowManager } from '../contexts/WindowManagerContext'

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindowManager()

  return (
    <Window
      className="absolute left-[4px] bottom-[calc(100%+4px)] z-50 w-48 p-0"
      shadow
    >
      <MenuList className="p-2" fullWidth>
        {START_MENU_APPS.map(app => (
          <MenuListItem
            key={app.id}
            as="button"
            type="button"
            onClick={() => {
              openWindow(app.id)
              onClose()
            }}
            className="flex w-full items-center gap-2 px-2 py-1 text-left"
          >
            <span aria-hidden>{app.icon}</span>
            <span className="truncate">{app.title}</span>
          </MenuListItem>
        ))}
      </MenuList>
    </Window>
  )
}
