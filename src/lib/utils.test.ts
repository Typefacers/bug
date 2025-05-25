import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cn } from './utils.ts'

test('cn merges duplicate Tailwind classes', () => {
  const result = cn('p-2', 'p-4')
  assert.strictEqual(result, 'p-4')
})

test('cn handles conditional values like clsx', () => {
  const result = cn('p-2', { 'font-bold': true, hidden: false }, [
    'text-lg',
    false,
  ])
  assert.strictEqual(result, 'p-2 font-bold text-lg')
})
