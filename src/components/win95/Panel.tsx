import { forwardRef, type PropsWithChildren } from 'react'
import { Frame, type FrameProps } from 'react95'

type Props = {
  variant?: 'sunken' | 'raised'
} & Omit<FrameProps, 'variant'>

const Panel = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  function Panel({ variant = 'sunken', children, ...props }, ref) {
    const mappedVariant = variant === 'sunken' ? 'well' : 'window'
    return (
      <Frame ref={ref} variant={mappedVariant} {...props}>
        {children}
      </Frame>
    )
  }
)

export default Panel
