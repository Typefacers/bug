import type { Bug } from './bug'
import type { User } from './user'

export interface State {
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
