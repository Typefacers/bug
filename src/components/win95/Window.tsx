import { forwardRef, type PropsWithChildren } from 'react'
import { Window as React95Window, type WindowProps } from 'react95'

type Props = WindowProps

const Window = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  function Window({ children, ...props }, ref) {
    return (
      <React95Window ref={ref} {...props}>
        {children}
      </React95Window>
    )
  }
)

export default Window
