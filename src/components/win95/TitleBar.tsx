import { ReactNode } from 'react'

type Props = {
  title: string
  controls?: ReactNode
}

export default function TitleBar({ title, controls }: Props) {
  return (
    <div className="h-8 select-none border-b-2 border-b-white bg-[#000080] px-2 text-white z-10">
      <div className="flex h-full items-center justify-between">
        <span className="font-bold tracking-wider">{title}</span>
        {controls}
      </div>
    </div>
  )
}
