import { test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import Leaderboard, {
  levelFromBounty,
  levelTier,
  sortUsers,
} from './Leaderboard.tsx'
import { MemoryRouter } from 'react-router-dom'
import { users as mockUsers } from '../mock/users.ts'
import { useBugStore } from '../store'
import { bugs as mockBugs } from '../mock/bugs.ts'

const h = React.createElement

// Basic users for sorting tests
const sampleUsers = [
  { id: 1, name: 'Bravo', bugs: new Array(2), bounty: 3000 },
  { id: 2, name: 'Alpha', bugs: new Array(1), bounty: 5000 },
  { id: 3, name: 'Charlie', bugs: new Array(4), bounty: 1000 },
]

const resetStore = () => {
  useBugStore.setState({
    bugs: structuredClone(mockBugs),
    users: structuredClone(mockUsers),
    activeUserId: 1,
    inspectedId: null,
  })
}

test('level helpers map bounty to correct tier', () => {
  assert.strictEqual(levelFromBounty(7000), 'Platinum')
  assert.strictEqual(levelFromBounty(4500), 'Gold')
  assert.strictEqual(levelFromBounty(2500), 'Silver')
  assert.strictEqual(levelFromBounty(100), 'Bronze')

  assert.strictEqual(levelTier(7000), 4)
  assert.strictEqual(levelTier(4500), 3)
  assert.strictEqual(levelTier(2500), 2)
  assert.strictEqual(levelTier(100), 1)
})

test('sortUsers orders users by various keys', () => {
  const byName = sortUsers(sampleUsers, 'name', true)
  assert.deepStrictEqual(
    byName.map(u => u.id),
    [2, 1, 3]
  )

  const byBounty = sortUsers(sampleUsers, 'bounty', false)
  assert.deepStrictEqual(
    byBounty.map(u => u.id),
    [2, 1, 3]
  )

  const byEfficiency = sortUsers(sampleUsers, 'efficiency', false)
  // efficiencies: Bravo 1500, Alpha 5000, Charlie 250
  assert.deepStrictEqual(
    byEfficiency.map(u => u.id),
    [2, 1, 3]
  )

  const byLevel = sortUsers(sampleUsers, 'level', false)
  assert.deepStrictEqual(
    byLevel.map(u => u.id),
    [2, 1, 3]
  )
})

test('Leaderboard component renders user rows', () => {
  resetStore()
  const html = renderToStaticMarkup(h(MemoryRouter, null, h(Leaderboard)))
  const first = mockUsers[0]
  assert.ok(html.includes(first.name))
  assert.ok(html.includes('Gold'))
})
