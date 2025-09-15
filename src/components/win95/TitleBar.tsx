import { ReactNode } from 'react'

type Props = {
  title: string
  controls?: ReactNode
  className?: string
  onDoubleClick?: () => void
}

export default function TitleBar({
  title,
  controls,
  className = '',
  onDoubleClick,
}: Props) {
  return (
    <div
      className={`win95-title-bar h-8 select-none border-b-2 border-b-white bg-[#000080] px-2 text-white z-10 ${className}`}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex h-full items-center justify-between">
        <span className="font-bold tracking-wider">{title}</span>
        {controls}
      </div>
    </div>
  )
}
