import { useBugStore } from '../store'
import type { WindowDefinition } from '../types/window'

export const WINDOW_DEFINITIONS: WindowDefinition[] = [
  {
    id: 'bugs',
    title: 'Bug Basher',
    icon: '🐛',
    path: '/',
    desktopShortcut: true,
    startMenu: true,
    defaultPosition: { x: 120, y: 80 },
    defaultSize: { width: 960, height: 640 },
  },
  {
    id: 'dashboard',
    title: 'Bug Dashboard',
    icon: '📊',
    path: '/dashboard',
    desktopShortcut: true,
    startMenu: true,
    defaultPosition: { x: 180, y: 120 },
    defaultSize: { width: 900, height: 600 },
  },
  {
    id: 'leaderboard',
    title: 'Bug Bounty Leaderboard',
    icon: '🏆',
    path: '/bounty-leaderboard',
    desktopShortcut: true,
    startMenu: true,
    defaultPosition: { x: 240, y: 140 },
    defaultSize: { width: 840, height: 560 },
  },
  {
    id: 'weather',
    title: 'Weather Forecast',
    icon: '🌦️',
    path: '/weather',
    desktopShortcut: true,
    startMenu: true,
    defaultPosition: { x: 300, y: 160 },
    defaultSize: { width: 720, height: 520 },
  },
  {
    id: 'fortune',
    title: 'Fortune Cookie',
    icon: '🥠',
    path: '/fortune',
    desktopShortcut: true,
    startMenu: true,
    defaultPosition: { x: 340, y: 200 },
    defaultSize: { width: 620, height: 480 },
  },
  {
    id: 'sign-up',
    title: 'Bug Basher Sign Up',
    icon: '✍️',
    path: '/sign-up',
    desktopShortcut: true,
    startMenu: true,
    startLabel: 'Sign Up',
    defaultPosition: { x: 380, y: 220 },
    defaultSize: { width: 640, height: 540 },
  },
  {
    id: 'new-bug',
    title: 'File a Bug',
    icon: '🪲',
    path: '/bug/new',
    startMenu: true,
    defaultPosition: { x: 420, y: 240 },
    defaultSize: { width: 720, height: 560 },
  },
  {
    id: 'job-description',
    title: 'Job Description',
    icon: '📄',
    path: '/job-description',
    desktopShortcut: true,
    startMenu: true,
    defaultPosition: { x: 160, y: 200 },
    defaultSize: { width: 720, height: 520 },
  },
  {
    id: 'easter-egg',
    title: 'Secret Bug Found',
    icon: '🥚',
    path: '/easter-egg',
    startMenu: true,
    defaultPosition: { x: 200, y: 240 },
    defaultSize: { width: 520, height: 420 },
  },
  {
    id: 'user-profile',
    title: 'User Profile',
    icon: '👤',
    path: '/user/:id',
    startMenu: false,
    defaultPosition: { x: 260, y: 260 },
    defaultSize: { width: 720, height: 520 },
    getTitle: path => {
      const segments = path.split('/')
      const userId = segments[segments.length - 1]
      if (!userId) return 'User Profile'
      const user = useBugStore
        .getState()
        .users.find(candidate => String(candidate.id) === userId)
      return user ? `${user.name}` : 'User Profile'
    },
    match: path => /^\/user\//.test(path),
  },
  {
    id: 'not-found',
    title: 'Page Not Found',
    icon: '💥',
    path: '*',
    startMenu: false,
    defaultPosition: { x: 200, y: 160 },
    defaultSize: { width: 540, height: 420 },
  },
]

export const findDefinitionForPath = (
  path: string
): WindowDefinition | undefined => {
  const exactMatch = WINDOW_DEFINITIONS.find(
    definition => definition.path === path
  )
  if (exactMatch) {
    return exactMatch
  }

  return WINDOW_DEFINITIONS.find(definition => definition.match?.(path))
}
