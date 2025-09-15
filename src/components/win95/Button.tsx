import { forwardRef } from 'react'
import { Button as React95Button, type ButtonProps } from 'react95'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    return <React95Button ref={ref} {...props} />
  }
)

export default Button
