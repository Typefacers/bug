import type { PointerEventHandler, MouseEventHandler, ReactNode } from 'react'

type Props = {
  title: string
  controls?: ReactNode
  onPointerDown?: PointerEventHandler<HTMLDivElement>
  onDoubleClick?: MouseEventHandler<HTMLDivElement>
}

export default function TitleBar({
  title,
  controls,
  onPointerDown,
  onDoubleClick,
}: Props) {
  return (
    <div
      className="h-8 select-none border-b-2 border-b-white bg-[#000080] px-2 text-white"
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex h-full items-center justify-between">
        <span className="font-bold tracking-wider">{title}</span>
        {controls}
      </div>
    </div>
  )
}
