import { ButtonHTMLAttributes } from 'react'
import { raised, sunken } from '../../utils/win95'

type Variant = 'raised' | 'sunken'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
  variant?: Variant
}

export default function Button({
  className = '',
  variant = 'raised',
  ...props
}: Props) {
  const appearance = variant === 'sunken' ? sunken : raised

  return (
    <button
      {...props}
      className={`flex items-center justify-center bg-[#C0C0C0] ${appearance} transition-colors hover:bg-[#A0A0A0] active:bg-[#A0A0A0] focus:outline-none focus-visible:ring-2 focus-visible:ring-black px-3 py-1 ${className}`}
    />
  )
}
