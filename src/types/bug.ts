export interface Bug {
  id: string
  title: string
  description: string
  bounty: number
  /** Paid time off earned for squashing this bug (hours, Infinity = unlimited) */
  pto: number
  active: boolean
  priority?: 'high' | 'medium' | 'low'
  createdAt?: string
  resolvedAt?: string
  assignee?: string
}
