import { forwardRef, useState } from 'react'
import { styled } from 'styled-components'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowAppDefinition } from '../utils/window-apps'

const IconButton = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 96px;
  background: transparent;
  border: none;
  padding: 12px 4px;
  color: ${({ theme }) => theme.canvasTextInvert};
  cursor: default;
  user-select: none;
  font-family: 'ms_sans_serif', 'Microsoft Sans Serif', sans-serif;

  &:focus-visible {
    outline: 1px dotted ${({ theme }) => theme.canvasTextInvert};
    outline-offset: 4px;
  }
`

const IconGlyph = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 28px;
  border: ${({ $selected, theme }) =>
    $selected
      ? `1px solid ${theme.canvasTextInvert}`
      : '1px solid transparent'};
  background: ${({ $selected }) => ($selected ? '#000080' : 'transparent')};
`

const IconLabel = styled.span<{ $selected: boolean }>`
  padding: 2px 6px;
  text-align: center;
  font-size: 13px;
  line-height: 1.2;
  color: ${({ $selected, theme }) =>
    $selected ? theme.canvasTextInvert : theme.canvasTextInvert};
  background: ${({ $selected }) => ($selected ? '#000080' : 'transparent')};
  border: ${({ $selected, theme }) =>
    $selected
      ? `1px solid ${theme.canvasTextInvert}`
      : '1px solid transparent'};
`

const DesktopIcon = forwardRef<HTMLButtonElement, { app: WindowAppDefinition }>(
  ({ app }, ref) => {
    const { openWindow } = useWindowManager()
    const [selected, setSelected] = useState(false)

    return (
      <IconButton
        type="button"
        ref={ref}
        $selected={selected}
        onClick={() => setSelected(true)}
        onDoubleClick={() => {
          openWindow(app.id)
          setSelected(false)
        }}
        onBlur={() => setSelected(false)}
      >
        <IconGlyph $selected={selected} aria-hidden>
          {app.icon}
        </IconGlyph>
        <IconLabel $selected={selected}>{app.title}</IconLabel>
      </IconButton>
    )
  }
)

DesktopIcon.displayName = 'DesktopIcon'

export default DesktopIcon
