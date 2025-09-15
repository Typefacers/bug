import { Frame, MenuList, MenuListItem } from 'react95'
import { START_MENU_APPS } from '../utils/window-apps'
import { useWindowManager } from '../contexts/WindowManagerContext'

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindowManager()

  return (
    <Frame
      variant="window"
      shadow
      className="absolute left-[4px] bottom-[calc(100%+4px)] w-56 bg-[#c6c6c6] p-2 text-sm z-50"
    >
      <MenuList fullWidth>
        {START_MENU_APPS.map(app => (
          <MenuListItem
            key={app.id}
            className="flex items-center gap-2"
            onClick={() => {
              openWindow(app.id)
              onClose()
            }}
          >
            <span aria-hidden>{app.icon}</span>
            <span className="truncate">{app.title}</span>
          </MenuListItem>
        ))}
      </MenuList>
    </Frame>
  )
}
