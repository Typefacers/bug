import { PropsWithChildren } from 'react'
import { raised, sunken } from '../../utils/win95'

type Props = {
  variant?: 'sunken' | 'raised'
  className?: string
}

export default function Panel({ children, variant = 'sunken', className = '' }: PropsWithChildren<Props>) {
  const border = variant === 'sunken' ? sunken : raised
  return <div className={`bg-[#E0E0E0] ${border} p-2 ${className}`}>{children}</div>
}
