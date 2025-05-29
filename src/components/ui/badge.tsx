import * as React from 'react'
import { cn } from '../../lib/utils'
import { badgeVariants } from './badge-variants'
import type { BadgeProps } from '../../types/badge-props'

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
