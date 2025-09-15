import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import type {
  WindowAppId,
  WindowComponentProps,
  WindowSize,
} from '../types/window'

export type WindowAppDefinition = {
  id: WindowAppId
  title: string
  icon: string
  Component: LazyExoticComponent<ComponentType<WindowComponentProps>>
  defaultSize: WindowSize
  desktopShortcut?: boolean
  startMenuShortcut?: boolean
  allowMultiple?: boolean
}

const Bugs = lazy(() => import('../routes/Bugs'))
const Dashboard = lazy(() => import('../routes/Dashboard'))
const Leaderboard = lazy(() => import('../routes/Leaderboard'))
const Weather = lazy(() => import('../routes/Weather'))
const Fortune = lazy(() => import('../routes/Fortune'))
const SignUp = lazy(() => import('../routes/SignUp'))
const NewBug = lazy(() => import('../routes/NewBug'))
const JobDescription = lazy(() => import('../routes/JobDescription'))
const EasterEgg = lazy(() => import('../routes/EasterEgg'))
const UserProfile = lazy(() => import('../routes/UserProfile'))
const NotFound = lazy(() => import('../routes/NotFound'))

export const WINDOW_APPS: Record<WindowAppId, WindowAppDefinition> = {
  bugs: {
    id: 'bugs',
    title: 'Bug Basher',
    icon: '🐛',
    Component: Bugs,
    defaultSize: { width: 960, height: 640 },
    desktopShortcut: true,
    startMenuShortcut: true,
  },
  dashboard: {
    id: 'dashboard',
    title: 'Bug Dashboard',
    icon: '📊',
    Component: Dashboard,
    defaultSize: { width: 1100, height: 720 },
    desktopShortcut: true,
    startMenuShortcut: true,
  },
  leaderboard: {
    id: 'leaderboard',
    title: 'Bounty Leaderboard',
    icon: '🏆',
    Component: Leaderboard,
    defaultSize: { width: 960, height: 620 },
    desktopShortcut: true,
    startMenuShortcut: true,
  },
  weather: {
    id: 'weather',
    title: 'Weather Forecast',
    icon: '🌦️',
    Component: Weather,
    defaultSize: { width: 640, height: 520 },
    desktopShortcut: true,
    startMenuShortcut: true,
  },
  fortune: {
    id: 'fortune',
    title: 'Fortune Cookie',
    icon: '🥠',
    Component: Fortune,
    defaultSize: { width: 520, height: 480 },
    desktopShortcut: false,
    startMenuShortcut: true,
  },
  signUp: {
    id: 'signUp',
    title: 'Sign Up',
    icon: '✍️',
    Component: SignUp,
    defaultSize: { width: 560, height: 620 },
    desktopShortcut: false,
    startMenuShortcut: true,
  },
  newBug: {
    id: 'newBug',
    title: 'File a Bug',
    icon: '🪳',
    Component: NewBug,
    defaultSize: { width: 640, height: 720 },
    desktopShortcut: false,
    startMenuShortcut: true,
  },
  jobDescription: {
    id: 'jobDescription',
    title: 'Job Description',
    icon: '📄',
    Component: JobDescription,
    defaultSize: { width: 720, height: 640 },
    desktopShortcut: false,
    startMenuShortcut: true,
  },
  easterEgg: {
    id: 'easterEgg',
    title: 'Secret Bug Found',
    icon: '🥚',
    Component: EasterEgg,
    defaultSize: { width: 560, height: 480 },
    desktopShortcut: false,
    startMenuShortcut: false,
  },
  userProfile: {
    id: 'userProfile',
    title: 'User Profile',
    icon: '🧑‍💻',
    Component: UserProfile,
    defaultSize: { width: 520, height: 640 },
    desktopShortcut: false,
    startMenuShortcut: false,
    allowMultiple: true,
  },
  notFound: {
    id: 'notFound',
    title: 'Page Not Found',
    icon: '⚠️',
    Component: NotFound,
    defaultSize: { width: 480, height: 360 },
    desktopShortcut: false,
    startMenuShortcut: false,
  },
}

export const DESKTOP_SHORTCUTS = Object.values(WINDOW_APPS).filter(
  app => app.desktopShortcut
)

export const START_MENU_APPS = Object.values(WINDOW_APPS).filter(
  app => app.startMenuShortcut
)
