import { InputHTMLAttributes, forwardRef } from 'react'
import { sunken } from '../../utils/win95'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

const Input = forwardRef<HTMLInputElement, Props>(function Input({ className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={`bg-[#E0E0E0] ${sunken} px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${className}`}
    />
  )
})

export default Input
