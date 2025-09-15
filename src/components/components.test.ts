import { test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WindowManagerProvider } from '../contexts/WindowManagerContext.tsx'

import AimCursor from './AimCursor.tsx'
import BugArea from './BugArea.tsx'
import { BugCard } from './BugCard.tsx'
import BugCrawler from './BugCrawler.tsx'
import BugForecast from './BugForecast.tsx'
import BugTrendsChart from './BugTrendsChart.tsx'
import Captcha from './Captcha.tsx'
import FortuneCookie from './FortuneCookie.tsx'
import Meta from './Meta.tsx'
import StartMenu from './StartMenu.tsx'
import Taskbar from './Taskbar.tsx'
import { bugs } from '../mock/bugs.ts'

const sampleBug = bugs[0]

const h = React.createElement

const wrap = (element: React.ReactElement) => renderToStaticMarkup(element)
const withProvider = (element: React.ReactElement) =>
  renderToStaticMarkup(h(WindowManagerProvider, null, element))

test('AimCursor renders', () => {
  const html = wrap(h(AimCursor, { x: 5, y: 5 }))
  assert.ok(html.includes('pointer-events-none'))
})

test('BugArea renders', () => {
  const html = wrap(h(BugArea, { bugs: [sampleBug] }))
  assert.ok(html.includes('cursor-none'))
})

test('BugCard renders', () => {
  const html = wrap(h(BugCard, { bug: sampleBug }))
  assert.ok(html.includes(sampleBug.title))
})

test('BugCrawler renders', () => {
  const html = wrap(
    h(BugCrawler, {
      bug: sampleBug,
      x: 0,
      y: 0,
      containerWidth: 100,
      containerHeight: 100,
    })
  )
  assert.ok(html.includes('img'))
})

test('BugForecast renders', () => {
  const html = wrap(h(BugForecast, { bugs: [sampleBug] }))
  assert.ok(html.includes('svg'))
})

test('BugTrendsChart renders', () => {
  const html = wrap(h(BugTrendsChart, { bugs: [sampleBug] }))
  assert.ok(html.includes('svg'))
})

test('Captcha renders', () => {
  const html = wrap(h(Captcha, { onChange: () => {} }))
  assert.ok(html.includes('What is'))
})

test('FortuneCookie renders', () => {
  const html = wrap(h(FortuneCookie))
  assert.ok(html.includes('New Fortune'))
})

test('Meta renders', () => {
  const html = wrap(h(Meta, { title: 'Test title', description: 'Test desc' }))
  assert.strictEqual(html, '')
})

test('StartMenu renders', () => {
  const html = withProvider(h(StartMenu, { onClose: () => {} }))
  assert.ok(html.includes('Bugs'))
})

test('Taskbar renders', () => {
  const html = withProvider(h(Taskbar))
  assert.ok(html.includes('Start'))
})
