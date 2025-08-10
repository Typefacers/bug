import { SelectHTMLAttributes, forwardRef } from 'react'
import { sunken } from '../../utils/win95'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string
}

const Select = forwardRef<HTMLSelectElement, Props>(function Select({ className = '', ...props }, ref) {
  return (
    <select
      ref={ref}
      {...props}
      className={`bg-[#E0E0E0] ${sunken} px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${className}`}
    />
  )
})

export default Select
