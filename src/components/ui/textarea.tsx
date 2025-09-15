import { forwardRef, type Ref } from 'react'
import { TextInput } from 'react95'
import type { TextareaProps } from '../../types/textarea-props'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        multiline
        fullWidth
        className={className}
        ref={ref as unknown as Ref<HTMLTextAreaElement>}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
