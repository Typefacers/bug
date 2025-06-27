import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../utils/cn'
import { raised, sunken } from '../utils/win95'

interface Win95ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
  variant?: 'default' | 'start'
}

const Win95Button = forwardRef<HTMLButtonElement, Win95ButtonProps>(
  ({ className, pressed = false, variant = 'default', children, ...props }, ref) => {
    const baseClasses = 'bg-[#C0C0C0] font-["MS_Sans_Serif",_sans-serif] text-xs font-normal text-black cursor-pointer select-none outline-none'
    const borderClasses = pressed ? sunken : raised
    
    const variantClasses = {
      default: 'px-1.5 py-0.5',
      start: 'h-5 px-1.5 flex items-center gap-1'
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          borderClasses,
          variantClasses[variant],
          `active:${sunken}`,
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Win95Button.displayName = 'Win95Button'

export default Win95Button