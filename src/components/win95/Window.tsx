import { PropsWithChildren } from 'react'
import { raised, windowShadow } from '../../utils/win95'

type Props = {
  className?: string
}

export default function Window({
  children,
  className = '',
}: PropsWithChildren<Props>) {
  return (
    <div
      className={`w-full bg-[#C0C0C0] ${raised} ${windowShadow} flex flex-col ${className}`}
    >
      {children}
    </div>
  )
}
