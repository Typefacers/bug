import { forwardRef } from 'react'
import { Button as React95Button, type ButtonProps } from 'react95'

type Props = ButtonProps

const Button = forwardRef<HTMLButtonElement, Props>(
  function Button(props, ref) {
    return <React95Button ref={ref} {...props} />
  }
)

export type { Props as Win95ButtonProps }
export default Button
