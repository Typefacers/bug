import * as React from 'react'

export interface SelectContextType<T extends string> {
  value: T
  onValueChange: (value: T) => void
  open: boolean
  setOpen: (open: boolean) => void
}

export interface SelectProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  children: React.ReactNode
}

export interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

export interface SelectValueProps {
  placeholder: string
}

export interface SelectContentProps {
  className?: string
  children: React.ReactNode
}

export interface SelectItemProps<T extends string> {
  value: T
  children: React.ReactNode
}
