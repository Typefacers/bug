import type { VariantProps } from 'class-variance-authority'
import { badgeVariants } from '../components/ui/badge-variants'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
