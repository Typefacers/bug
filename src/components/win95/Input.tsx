import { forwardRef } from 'react'
import { TextInput, type TextInputProps } from 'react95'

const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>(function Input(props, ref) {
  return <TextInput ref={ref} {...props} />
})

export default Input
