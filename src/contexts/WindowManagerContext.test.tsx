import { test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  WindowManagerProvider,
  useWindowManager,
} from './WindowManagerContext.tsx'
import type { WindowSize } from '../types/window.ts'

const h = React.createElement

type CaptureComponent = (() => null) & {
  lastValue?: (bounds: WindowSize) => void
}

const Capture: CaptureComponent = () => {
  const manager = useWindowManager()
  Capture.lastValue = manager.setDesktopBounds
  return null
}

test('WindowManagerProvider exposes setDesktopBounds', () => {
  Capture.lastValue = undefined
  renderToStaticMarkup(h(WindowManagerProvider, null, h(Capture)))

  assert.equal(typeof Capture.lastValue, 'function')
})
