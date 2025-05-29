import type { Bug } from './bug'

export interface User {
  id: number
  name: string
  avatar: string
  bugs: Bug[] | number[]
  bounty: number
  score?: number
  bugsSquashed?: string[]
}
