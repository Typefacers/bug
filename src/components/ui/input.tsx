import { forwardRef, type Ref } from 'react'
import { TextInput } from 'react95'
import type { InputProps } from '../../types/input-props'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref as unknown as Ref<HTMLInputElement>}
        className={className}
        fullWidth
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
