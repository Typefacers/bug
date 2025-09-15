import { test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WindowManagerProvider } from '../contexts/WindowManagerContext.tsx'

import Bugs from './Bugs.tsx'
import Dashboard from './Dashboard.tsx'
import EasterEgg from './EasterEgg.tsx'
import Fortune from './Fortune.tsx'
import JobDescription from './JobDescription.tsx'
import Leaderboard from './Leaderboard.tsx'
import NewBug from './NewBug.tsx'
import NotFound from './NotFound.tsx'
import SignUp from './SignUp.tsx'
import UserProfile from './UserProfile.tsx'
import Weather from './Weather.tsx'

const h = React.createElement

const wrap = (element: React.ReactElement) =>
  renderToStaticMarkup(h(WindowManagerProvider, null, element))

test('Bugs page renders', () => {
  const html = wrap(h(Bugs))
  assert.ok(html.includes('squash a bug'))
})

test('Dashboard page renders', () => {
  const html = wrap(h(Dashboard))
  assert.ok(html.includes('Bug Bounty Dashboard'))
})

test('EasterEgg page renders', () => {
  const html = wrap(h(EasterEgg))
  assert.ok(html.includes('Easter Egg'))
})

test('Fortune page renders', () => {
  const html = wrap(h(Fortune))
  assert.ok(html.includes('Fortune Cookie'))
})

test('JobDescription page renders', () => {
  const html = wrap(h(JobDescription))
  assert.ok(html.includes('Bug Basher Role'))
})

test('Leaderboard page renders', () => {
  const html = wrap(h(Leaderboard))
  assert.ok(html.includes('Search'))
})

test('NewBug page renders', () => {
  const html = wrap(h(NewBug))
  assert.ok(html.includes('File a New Bug'))
})

test('NotFound page renders', () => {
  const html = wrap(h(NotFound))
  assert.ok(html.includes('Page Not Found'))
})

test('SignUp page renders', () => {
  const html = wrap(h(SignUp))
  assert.ok(html.includes('Sign Up'))
})

test('UserProfile page renders', () => {
  const html = wrap(h(UserProfile, { context: { userId: 1 } }))
  assert.ok(html.length > 0)
})

test('Weather page renders', () => {
  const html = wrap(h(Weather))
  assert.ok(html.includes('Weather Forecast'))
})
