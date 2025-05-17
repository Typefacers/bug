import { test } from 'node:test';
import assert from 'node:assert';
import { getBugImage } from './utils.ts';

test('getBugImage returns consistent image for identical bug IDs', () => {
  const id = 'bug-id-123';
  const first = getBugImage(id);
  const second = getBugImage(id);
  assert.strictEqual(second, first);
});
