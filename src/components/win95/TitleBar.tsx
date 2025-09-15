import clsx from 'clsx'
import { ReactNode } from 'react'
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
      className={clsx(
        'win95-title-bar flex select-none items-center justify-between gap-2 px-2 py-1 text-black',
        className
      )}
      active={active}
      onDoubleClick={onDoubleClick}
    >
      <span className="font-bold tracking-wider text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
        {title}
      </span>
      {controls}
    </WindowHeader>
  )
}
