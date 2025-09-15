export type WindowDefinition = {
  id: string
  /** Base title shown in taskbar/start menu */
  title: string
  /** Emoji or icon used for shortcuts */
  icon: string
  /** Canonical route path for this window */
  path: string
  /** Whether to render a shortcut on the desktop */
  desktopShortcut?: boolean
  /** Whether to list this window inside the start menu */
  startMenu?: boolean
  /** Optional label override for the start menu */
  startLabel?: string
  /** Initial position for the window */
  defaultPosition: { x: number; y: number }
  /** Initial size for the window */
  defaultSize: { width: number; height: number }
  /** Allow resizing via corner handle */
  resizable?: boolean
  /** Predicate for matching dynamic routes (e.g. /user/:id) */
  match?: (path: string) => boolean
  /** Optional dynamic title derivation based on path */
  getTitle?: (path: string) => string
}

export type WindowState = {
  id: string
  definitionId: string
  path: string
  title: string
  icon: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  canResize: boolean
  restoreBounds?: {
    position: { x: number; y: number }
    size: { width: number; height: number }
  }
}
