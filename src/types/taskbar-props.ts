export interface TaskbarProps {
  windowTitle: string
  minimized: boolean
  onToggle: () => void
  hidden?: boolean
  onOpenWindow?: () => void
}
