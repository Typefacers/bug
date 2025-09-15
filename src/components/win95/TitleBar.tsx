import { ReactNode, PointerEventHandler } from 'react'

type Props = {
  title: string
  controls?: ReactNode
  onPointerDown?: PointerEventHandler<HTMLDivElement>
  onDoubleClick?: () => void
  active?: boolean
}

export default function TitleBar({
  title,
  controls,
  onPointerDown,
  onDoubleClick,
  active = true,
}: Props) {
  return (
    <div
      className={`h-8 select-none border-b-2 px-2 z-10 ${
        active
          ? 'border-b-white bg-[#000080] text-white'
          : 'border-b-[#C0C0C0] bg-[#808080] text-[#E8E8E8]'
      }`}
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
