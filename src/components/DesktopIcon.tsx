import clsx from 'clsx'
import { useCallback } from 'react'
import type { MouseEvent, KeyboardEvent } from 'react'

type DesktopIconProps = {
  id: string
  icon: string
  label: string
  top: number
  left?: number
  selected: boolean
  onOpen: () => void
  onSelect: (id: string) => void
}

export default function DesktopIcon({
  id,
  icon,
  label,
  top,
  left = 16,
  selected,
  onOpen,
  onSelect,
}: DesktopIconProps) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onSelect(id)
    },
    [id, onSelect]
  )

  const handleDoubleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onOpen()
    },
    [onOpen]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        onOpen()
      }
    },
    [onOpen]
  )

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        'absolute flex w-24 flex-col items-center gap-2 rounded px-2 py-3 text-xs text-white focus:outline-none',
        selected
          ? 'bg-[rgba(0,0,128,0.6)]'
          : 'bg-transparent hover:bg-[rgba(0,0,128,0.3)]'
      )}
      style={{ top, left }}
    >
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-center leading-tight drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </button>
  )
}
