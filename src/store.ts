import { create } from 'zustand'
import { bugs as mockBugs } from './mock/bugs.ts'
import { users as mockUsers } from './mock/users.ts'
import { CONFIG, BUG_TEMPLATES } from './lib/store-constants.ts'
import type { Bug } from './types/bug.ts'
import type { State } from './types/store.ts'
import { trainPriorityModel, predictPriority } from './lib/bug-priority-ml.ts'
import type { PriorityModel } from './lib/bug-priority-ml.ts'

// Configuration and bug templates are defined in src/lib/store-constants.ts

let cleanupTimer: ReturnType<typeof setInterval> | null = null
let respawnTimer: ReturnType<typeof setInterval> | null = null
let stormTimer: ReturnType<typeof setInterval> | null = null
let stormBugIds: string[] = []

// Train a simple logistic regression model using the mock bugs
export let priorityModel: PriorityModel | null = null
if (mockBugs.length) {
  priorityModel = trainPriorityModel(mockBugs)
}

export const useBugStore = create<State>((set, get) => ({
  bugs: mockBugs,
  users: mockUsers.sort((a, b) => b.bounty - a.bounty),
  activeUserId: 1, // assume first user is the current hacker
  inspectedId: null,
  quantumStormActive: false,
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
  startQuantumStorm: () => {
    if (get().quantumStormActive) return
    stormBugIds = []
    const extras: Bug[] = []
    for (let i = 0; i < CONFIG.STORM_BUGS; i++) {
      const template =
        BUG_TEMPLATES[Math.floor(Math.random() * BUG_TEMPLATES.length)]
      const id = `storm-${Date.now()}-${i}`
      stormBugIds.push(id)

      const bounty = Math.floor(Math.random() * 50) + 10
      const priority = priorityModel
        ? predictPriority({ bounty } as Bug, priorityModel)
        : 'low'

      extras.push({
        id,
        title: template.title,
        description: template.description,
        bounty,
        active: true,
        priority,
        createdAt: new Date().toISOString(),
      })
    }
    set(state => ({
      bugs: [...state.bugs, ...extras],
      quantumStormActive: true,
    }))
    setTimeout(() => get().stopQuantumStorm(), CONFIG.STORM_DURATION)
  },
  stopQuantumStorm: () => {
    set(state => {
      const bugs = state.bugs.filter(b => !stormBugIds.includes(b.id))
      const users = state.users.map(u =>
        u.id === state.activeUserId ? { ...u, survivor: true } : u
      )
      stormBugIds = []
      return { bugs, users, quantumStormActive: false }
    })
  },
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

          const bounty = Math.floor(Math.random() * 180) + 20 // 20-200 bounty
          let priority: 'high' | 'medium' | 'low'
          if (priorityModel) {
            priority = predictPriority({ bounty } as Bug, priorityModel)
          } else {
            const priorities: ('high' | 'medium' | 'low')[] = [
              'high',
              'medium',
              'low',
            ]
            priority = priorities[Math.floor(Math.random() * priorities.length)]
          }

          const newBug: Bug = {
            id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: template.title,
            description: template.description,
            bounty,
            active: true,
            priority,
            createdAt: new Date().toISOString(),
          }

          get().addBug(newBug)
        }
      }, CONFIG.RESPAWN_INTERVAL)
    }

    if (!stormTimer) {
      stormTimer = setInterval(() => {
        if (Math.random() < CONFIG.STORM_CHANCE) {
          get().startQuantumStorm()
        }
      }, CONFIG.STORM_CHECK_INTERVAL)
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
    if (stormTimer) {
      clearInterval(stormTimer)
      stormTimer = null
    }
  },
}))
