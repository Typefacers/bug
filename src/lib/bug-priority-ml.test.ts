import { test } from 'node:test'
import assert from 'node:assert/strict'
import { trainPriorityModel, predictPriority } from './bug-priority-ml.ts'
import { bugs } from '../mock/bugs.ts'

test('priority model predicts high priority for large bounty', () => {
  const model = trainPriorityModel(bugs)
  const highBug = { ...bugs[0], bounty: 250 }
  assert.strictEqual(predictPriority(highBug, model), 'high')
})

test('priority model predicts low or medium for small bounty', () => {
  const model = trainPriorityModel(bugs)
  const lowBug = { ...bugs[0], bounty: 20 }
  const result = predictPriority(lowBug, model)
  assert.ok(result === 'low' || result === 'medium')
})
