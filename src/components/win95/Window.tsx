import clsx from 'clsx'
import { forwardRef } from 'react'
import { Window as React95Window, type WindowProps } from 'react95'

type Props = WindowProps

const Window = forwardRef<HTMLDivElement, Props>(function Window(
  { className, shadow = true, ...props },
  ref
) {
  return (
    <React95Window
      ref={ref}
      shadow={shadow}
      className={clsx('flex flex-col overflow-hidden', className)}
      {...props}
    />
  )
})

export type { Props as Win95WindowProps }
export default Window
