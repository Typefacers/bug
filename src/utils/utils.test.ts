import { test } from 'node:test'
import assert from 'node:assert'
import { getBugImage } from './utils.ts'

test('getBugImage returns consistent image for identical bug IDs', () => {
  const id = 'bug-id-123'
  const first = getBugImage(id)
  const second = getBugImage(id)
  assert.strictEqual(second, first)
})

test('getBugImage returns different images for distinct bug IDs', () => {
  const id1 = 'bug-id-1'
  const id2 = 'bug-id-2'
  const img1 = getBugImage(id1)
  const img2 = getBugImage(id2)
  assert.notStrictEqual(img1, img2)
})
