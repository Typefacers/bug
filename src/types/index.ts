export interface Bug {
  id: string
  title: string
  description: string
  bounty: number
  active: boolean
  priority?: 'high' | 'medium' | 'low'
  createdAt?: string
  resolvedAt?: string
  assignee?: string
}

export interface User {
  id: number
  name: string
  avatar: string
  bugs: Bug[] | number[]
  bounty: number
  score?: number
  bugsSquashed?: string[]
  survivor?: boolean
}

export interface AimCursorProps {
  x: number
  y: number
}

export interface BugAreaProps {
  bugs: Bug[]
}

export interface BugCardProps {
  bug: Bug
  /** Compact hover preview when true */
  preview?: boolean
}

export interface BugCrawlerProps {
  x: number
  y: number
  bug: Bug
  containerWidth: number
  containerHeight: number
}

export interface MetaProps {
  title: string
  description: string
  image?: string
  structuredData?: Record<string, unknown>
}

export interface TaskbarProps {
  windowTitle: string
  minimized: boolean
  onToggle: () => void
}

export interface BugStoreState {
  bugs: Bug[]
  users: User[]
  activeUserId: number
  inspectedId: string | null
  quantumStormActive: boolean
  inspectBug: (id: string | null) => void
  squashBug: (id: string) => void
  addBug: (bug: Bug) => void
  removeBug: (id: string) => void
  startQuantumStorm: () => void
  stopQuantumStorm: () => void
  startAutomaticSystems: () => void
  stopAutomaticSystems: () => void
}

export type SortKey =
  | 'rank'
  | 'name'
  | 'bugs'
  | 'bounty'
  | 'efficiency'
  | 'level'

export interface BugTrendsDataPoint {
  date: Date
  created: number
  resolved: number
}

import type {
  ReactNode,
  TextareaHTMLAttributes,
  InputHTMLAttributes,
  ButtonHTMLAttributes,
  LabelHTMLAttributes,
} from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '../components/ui/button-variants'
import type { badgeVariants } from '../components/ui/badge-variants'

export interface SelectContextType<T extends string> {
  value: T
  onValueChange: (value: T) => void
  open: boolean
  setOpen: (open: boolean) => void
}

export interface SelectProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  children: ReactNode
}

export interface SelectTriggerProps {
  className?: string
  children: ReactNode
}

export interface SelectValueProps {
  placeholder: string
}

export interface SelectContentProps {
  className?: string
  children: ReactNode
}

export interface SelectItemProps<T extends string> {
  value: T
  children: ReactNode
}

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}
