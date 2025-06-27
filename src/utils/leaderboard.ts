import type { Bug } from '../types/bug'

/** Map bounty → tier name */
export const levelFromBounty = (bounty: number): string => {
  if (bounty >= 6000) return 'Platinum'
  if (bounty >= 4000) return 'Gold'
  if (bounty >= 2000) return 'Silver'
  return 'Bronze'
}

/** Rank level tiers so they can be numerically compared */
export const levelTier = (bounty: number): number => {
  if (bounty >= 6000) return 4
  if (bounty >= 4000) return 3
  if (bounty >= 2000) return 2
  return 1
}

export type SortKey =
  | 'rank'
  | 'name'
  | 'bugs'
  | 'bounty'
  | 'efficiency'
  | 'level'

export interface SortableUser {
  id: number
  name: string
  avatar?: string
  bugs: Bug[] | number[]
  bounty?: number
}

export const sortUsers = (
  users: SortableUser[],
  sortKey: SortKey,
  ascending: boolean
): SortableUser[] => {
  const list = [...users]

  list.sort((a, b) => {
    const bugCountA =
      (Array.isArray(a.bugs) ? a.bugs.length : (a.bugs ?? 0)) ?? 0
    const bugCountB =
      (Array.isArray(b.bugs) ? b.bugs.length : (b.bugs ?? 0)) ?? 0
    const bountyA = a.bounty ?? 0
    const bountyB = b.bounty ?? 0
    const efficiencyA = bugCountA > 0 ? bountyA / bugCountA : 0
    const efficiencyB = bugCountB > 0 ? bountyB / bugCountB : 0

    let valA: number | string = 0
    let valB: number | string = 0

    switch (sortKey) {
      case 'rank':
        // Rank is the default bounty-desc ordering
        valA = bountyA
        valB = bountyB
        break
      case 'name':
        valA = a.name.toLowerCase()
        valB = b.name.toLowerCase()
        break
      case 'bugs':
        valA = bugCountA
        valB = bugCountB
        break
      case 'bounty':
        valA = bountyA
        valB = bountyB
        break
      case 'efficiency':
        valA = efficiencyA
        valB = efficiencyB
        break
      case 'level':
        valA = levelTier(bountyA)
        valB = levelTier(bountyB)
        break
    }

    if (valA < valB) return ascending ? -1 : 1
    if (valA > valB) return ascending ? 1 : -1
    return 0
  })

  return list
}