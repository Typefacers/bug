import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateTotalBounty, formatDate } from '../utils/dashboard'

test('calculateTotalBounty sums bug bounties', () => {
  const bugs: Array<{ bounty: number }> = [
    { bounty: 100 },
    { bounty: 200 },
    { bounty: 50 },
  ]
  assert.strictEqual(calculateTotalBounty(bugs), 350)
})

test('formatDate outputs a readable string', () => {
  const date = new Date('2024-05-18T12:34:56Z')
  const result = formatDate(date)
  assert.ok(/\d{4}/.test(result))
  assert.ok(result.length > 0)
})
