import { test } from 'node:test'
import assert from 'node:assert/strict'
import { forecastBugCounts } from './bug-forecast.ts'
import { bugs } from '../mock/bugs.ts'

test('forecast returns requested number of days', () => {
  const result = forecastBugCounts(bugs, 5)
  assert.strictEqual(result.length, 5)
  result.forEach(point => assert.ok(typeof point.count === 'number'))
})
