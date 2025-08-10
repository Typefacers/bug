import { ButtonHTMLAttributes } from 'react'
import { raised } from '../../utils/win95'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
}

export default function Button({ className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center bg-[#C0C0C0] ${raised} transition-colors hover:bg-[#A0A0A0] active:bg-[#A0A0A0] focus:outline-none focus-visible:ring-2 focus-visible:ring-black px-3 py-1 ${className}`}
    />
  )
}
