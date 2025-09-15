import type { ReactNode } from 'react'
import { WindowHeader } from 'react95'

type Props = {
  title: string
  controls?: ReactNode
  className?: string
  onDoubleClick?: () => void
  active?: boolean
}

export default function TitleBar({
  title,
  controls,
  className = '',
  onDoubleClick,
  active = true,
}: Props) {
  return (
    <WindowHeader
      active={active}
      className={`win95-title-bar flex items-center justify-between gap-2 pr-1 ${className}`}
      onDoubleClick={onDoubleClick}
    >
      <span className="truncate">{title}</span>
      {controls}
    </WindowHeader>
  )
}
