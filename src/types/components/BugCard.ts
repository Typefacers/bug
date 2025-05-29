import type { Bug } from '../bug'

export interface BugCardProps {
  bug: Bug
  /** Compact hover preview when true */
  preview?: boolean
}
