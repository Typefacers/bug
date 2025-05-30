import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { useBugStore } from './store.ts'
import { bugs as mockBugs } from './mock/bugs.ts'
import { users as mockUsers } from './mock/users.ts'

const resetStore = () => {
  useBugStore.getState().stopAutomaticSystems()
  useBugStore.setState({
    bugs: structuredClone(mockBugs),
    users: structuredClone(mockUsers).sort((a, b) => b.bounty - a.bounty),
    activeUserId: 1,
    inspectedId: null,
  })
}

const timers = mock.timers

// Test that squashBug updates score and bug cleanup works

test('squashBug updates score and removes bug after cleanup', () => {
  timers.enable()
  resetStore()

  useBugStore.getState().startAutomaticSystems()

  const id = mockBugs[0].id
  const bounty = mockBugs[0].bounty

  useBugStore.getState().squashBug(id)

  let bug = useBugStore.getState().bugs.find(b => b.id === id)
  assert.ok(bug)
  assert.strictEqual(bug!.active, false)

  const user = useBugStore.getState().users.find(u => u.id === 1)
  assert.ok(user)
  assert.strictEqual(user!.score, bounty)
  assert.ok(user!.bugsSquashed?.includes(id))

  timers.tick(12000)

  bug = useBugStore.getState().bugs.find(b => b.id === id)
  assert.strictEqual(bug, undefined)

  useBugStore.getState().stopAutomaticSystems()
  timers.reset()
})

// Test that respawn timer adds bugs when below minimum

test('respawn timer adds bugs when below minimum', () => {
  timers.enable()
  resetStore()

  useBugStore.setState({ bugs: [] })
  useBugStore.getState().startAutomaticSystems()

  timers.tick(3000)

  const activeBugs = useBugStore.getState().bugs.filter(b => b.active)
  assert.ok(activeBugs.length >= 8)

  useBugStore.getState().stopAutomaticSystems()
  timers.reset()
})

// Test that addUser inserts user and updates activeUserId

test('addUser adds user and sets active user', () => {
  resetStore()

  const user = { id: 123, name: 'Tester', avatar: '', bugs: [], bounty: 0 }

  useBugStore.getState().addUser(user)

  const users = useBugStore.getState().users
  assert.ok(users.find(u => u.id === 123))
  assert.strictEqual(useBugStore.getState().activeUserId, 123)
})
