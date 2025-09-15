import { Frame, MenuList, MenuListItem } from 'react95'
import { START_MENU_APPS } from '../utils/window-apps'
import { useWindowManager } from '../contexts/WindowManagerContext'

type Props = { onClose: () => void }

export default function StartMenu({ onClose }: Props) {
  const { openWindow } = useWindowManager()

  return (
    <Frame
      variant="window"
      shadow
      className="absolute left-[4px] bottom-[calc(100%+4px)] w-48 p-2"
    >
      <MenuList className="space-y-1 text-sm">
        {START_MENU_APPS.map(app => (
          <MenuListItem
            key={app.id}
            onClick={() => {
              openWindow(app.id)
              onClose()
            }}
            className="flex cursor-pointer items-center gap-2"
          >
            <span aria-hidden>{app.icon}</span>
            {app.title}
          </MenuListItem>
        ))}
      </MenuList>
    </Frame>
  )
}
