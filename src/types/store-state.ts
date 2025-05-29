import type { Bug } from './bug'
import type { User } from './user'

export interface StoreState {
  bugs: Bug[]
  users: User[]
  activeUserId: number
  inspectedId: string | null
  inspectBug: (id: string | null) => void
  squashBug: (id: string) => void
  addBug: (bug: Bug) => void
  removeBug: (id: string) => void
  startAutomaticSystems: () => void
  stopAutomaticSystems: () => void
}
