import type { CSSProperties, HTMLAttributes } from 'react'
import { PropsWithChildren } from 'react'
import { raised, windowShadow } from '../../utils/win95'

type Props = {
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>

export default function Window({
  children,
  className = '',
  style,
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <div
      className={`w-full bg-[#C0C0C0] ${raised} ${windowShadow} flex flex-col ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}
