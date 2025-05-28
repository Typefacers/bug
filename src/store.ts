import { create } from 'zustand'
import { bugs as mockBugs } from './mock/bugs.ts'
import { users as mockUsers } from './mock/users.ts'
import type { Bug } from './types/bug.ts'
import type { User } from './types/user.ts'

interface State {
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

// Configuration for automatic systems
const CONFIG = {
  CLEANUP_DELAY: 10000, // Remove squashed bugs after 10 seconds
  RESPAWN_INTERVAL: 3000, // Spawn new bug every 3 seconds
  MAX_ACTIVE_BUGS: 15, // Maximum number of active bugs
  MIN_ACTIVE_BUGS: 8, // Minimum number of active bugs to maintain
}

// Bug titles and descriptions for random generation
const BUG_TEMPLATES = [
  {
    title: 'Memory Leak Monster',
    description: 'RAM consumption grows exponentially with each click.',
  },
  {
    title: 'Async Nightmare',
    description: 'Promise never resolves, callbacks lost in the void.',
  },
  {
    title: 'CSS Chaos',
    description: 'Styles randomly flip upside down on Tuesdays.',
  },
  {
    title: 'Database Disappearing Act',
    description: 'Query returns undefined for no apparent reason.',
  },
  {
    title: 'Timezone Tornado',
    description: 'Dates jump between timezones like a confused traveler.',
  },
  {
    title: 'Form Field Phantom',
    description: 'Input accepts text but data vanishes on submit.',
  },
  {
    title: 'Loading Loop Limbo',
    description: 'Spinner spins forever, user patience expires.',
  },
  {
    title: 'Cookie Crumble Crisis',
    description: 'Session data randomly evaporates mid-transaction.',
  },
  {
    title: 'Mobile Mayhem',
    description: 'App works perfectly on desktop, panics on mobile.',
  },
  {
    title: 'Error 500 Surprise',
    description: 'Server throws tantrums when processing valid requests.',
  },
]

let cleanupTimer: ReturnType<typeof setInterval> | null = null
let respawnTimer: ReturnType<typeof setInterval> | null = null

export const useBugStore = create<State>((set, get) => ({
  bugs: mockBugs,
  users: mockUsers.sort((a, b) => b.bounty - a.bounty),
  activeUserId: 1, // assume first user is the current hacker
  inspectedId: null,
  addBug: bug => set(state => ({ bugs: [...state.bugs, bug] })),
  inspectBug: id => set({ inspectedId: id }),
  removeBug: id =>
    set(state => ({
      bugs: state.bugs.filter(b => b.id !== id),
    })),
  squashBug: id =>
    set(state => {
      // mark bug inactive + award bounty
      let updatedBug: Bug | undefined
      const bugs = state.bugs.map(b => {
        if (b.id === id && b.active) {
          updatedBug = {
            ...b,
            active: false,
            resolvedAt: new Date().toISOString(),
          }
          return updatedBug
        }
        return b
      })

      const users = updatedBug
        ? state.users
            .map(u =>
              u.id === state.activeUserId
                ? {
                    ...u,
                    score: (u.score || 0) + (updatedBug!.bounty || 0),
                    bugsSquashed: [...(u.bugsSquashed || []), updatedBug!.id],
                  }
                : u
            )
            .sort((a, b) => (b.score || b.bounty) - (a.score || a.bounty))
        : state.users

      return { bugs, users, inspectedId: null }
    }),
  startAutomaticSystems: () => {
    // Start cleanup timer for squashed bugs
    if (!cleanupTimer) {
      cleanupTimer = setInterval(() => {
        const state = get()
        const cutoffTime = Date.now() - CONFIG.CLEANUP_DELAY

        const bugsToRemove = state.bugs.filter(bug => {
          if (!bug.active && bug.resolvedAt) {
            const resolvedTime = new Date(bug.resolvedAt).getTime()
            return resolvedTime < cutoffTime
          }
          return false
        })

        bugsToRemove.forEach(bug => {
          get().removeBug(bug.id)
        })
      }, 2000) // Check every 2 seconds
    }

    // Start respawn timer for new bugs
    if (!respawnTimer) {
      respawnTimer = setInterval(() => {
        const state = get()
        const activeBugs = state.bugs.filter(b => b.active)

        // Determine how many bugs to spawn
        let bugsToSpawn = 0
        if (activeBugs.length < CONFIG.MIN_ACTIVE_BUGS) {
          // Spawn multiple bugs to reach minimum quickly
          bugsToSpawn = CONFIG.MIN_ACTIVE_BUGS - activeBugs.length
        } else if (activeBugs.length < CONFIG.MAX_ACTIVE_BUGS) {
          // Spawn one bug if below max
          bugsToSpawn = 1
        }

        // Create the bugs
        for (let i = 0; i < bugsToSpawn; i++) {
          const template =
            BUG_TEMPLATES[Math.floor(Math.random() * BUG_TEMPLATES.length)]
          const priorities: ('high' | 'medium' | 'low')[] = [
            'high',
            'medium',
            'low',
          ]
          const priority =
            priorities[Math.floor(Math.random() * priorities.length)]

          const newBug: Bug = {
            id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: template.title,
            description: template.description,
            bounty: Math.floor(Math.random() * 180) + 20, // 20-200 bounty
            active: true,
            priority,
            createdAt: new Date().toISOString(),
          }

          get().addBug(newBug)
        }
      }, CONFIG.RESPAWN_INTERVAL)
    }
  },
  stopAutomaticSystems: () => {
    if (cleanupTimer) {
      clearInterval(cleanupTimer)
      cleanupTimer = null
    }
    if (respawnTimer) {
      clearInterval(respawnTimer)
      respawnTimer = null
    }
  },
}))
