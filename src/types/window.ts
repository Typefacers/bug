export type WindowAppId =
  | 'bugs'
  | 'dashboard'
  | 'leaderboard'
  | 'weather'
  | 'fortune'
  | 'signUp'
  | 'newBug'
  | 'jobDescription'
  | 'easterEgg'
  | 'userProfile'
  | 'notFound'

export type WindowPoint = {
  x: number
  y: number
}

export type WindowSize = {
  width: number
  height: number
}

export type WindowContextData = Record<string, unknown>

export type OpenWindowOptions = {
  context?: WindowContextData
  position?: WindowPoint
  size?: WindowSize
  instanceId?: string
}

export type WindowState = {
  id: string
  appId: WindowAppId
  title: string
  position: WindowPoint
  size: WindowSize
  minimized: boolean
  maximized: boolean
  zIndex: number
  context?: WindowContextData
  instanceId?: string
  previous?: {
    position: WindowPoint
    size: WindowSize
  } | null
}

export type WindowComponentProps<
  TContext extends WindowContextData | undefined =
    | WindowContextData
    | undefined,
> = {
  windowId?: string
  context?: TContext
  setTitle?: (title: string) => void
}
