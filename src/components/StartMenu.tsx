import { useEffect } from 'react'
import { styled } from 'styled-components'
import { Frame, MenuList, MenuListItem } from 'react95'
import { START_MENU_APPS } from '../utils/window-apps'
import { useWindowManager } from '../contexts/WindowManagerContext'

type StartMenuProps = {
  anchorRect: DOMRect | null
  onClose: () => void
}

const MENU_WIDTH = 260

const StartMenuPositioner = styled.div`
  position: fixed;
  z-index: 50;
  width: ${MENU_WIDTH}px;
`

const StartMenuFrame = styled(Frame).attrs({
  variant: 'window' as const,
  shadow: true,
})`
  display: flex;
  overflow: hidden;
`

const BrandColumn = styled.div`
  width: 40px;
  background: linear-gradient(180deg, #00007b 0%, #008080 60%, #4ea0c6 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
`

const BrandText = styled.span`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: 'ms_sans_serif', 'Microsoft Sans Serif', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.canvasTextInvert};
  padding: 6px 0;
`

const MenuBody = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.material};
  border-left: 1px solid ${({ theme }) => theme.borderDark};
`

const StyledMenuList = styled(MenuList)`
  margin: 0;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StyledMenuItem = styled(MenuListItem)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-weight: 600;
  cursor: pointer;
`

const ItemIcon = styled.span`
  font-size: 18px;
`

const ItemLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

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
    <StartMenuPositioner
      style={{ left, bottom }}
      role="menu"
      aria-label="Start menu"
    >
      <StartMenuFrame>
        <BrandColumn>
          <BrandText>Windows 95</BrandText>
        </BrandColumn>
        <MenuBody>
          <StyledMenuList fullWidth>
            {START_MENU_APPS.map(item => (
              <StyledMenuItem
                key={item.id}
                onClick={() => {
                  openWindow(item.id)
                  onClose()
                }}
              >
                <ItemIcon aria-hidden>{item.icon}</ItemIcon>
                <ItemLabel>{item.title}</ItemLabel>
              </StyledMenuItem>
            ))}
          </StyledMenuList>
        </MenuBody>
      </StartMenuFrame>
    </StartMenuPositioner>
  )
}
