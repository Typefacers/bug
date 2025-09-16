import { useEffect } from 'react'
import { useKonamiDarkMode } from './hooks/use-konami-dark-mode'
import { useBugStore } from './store'
import Desktop from './components/Desktop'
import { WindowManagerProvider } from './contexts/WindowManagerContext'

function AppContent() {
  const { startAutomaticSystems, stopAutomaticSystems } = useBugStore()
  useKonamiDarkMode()

  useEffect(() => {
    startAutomaticSystems()
    return () => stopAutomaticSystems()
  }, [startAutomaticSystems, stopAutomaticSystems])

  return <Desktop />
}

export default function App() {
  return (
    <WindowManagerProvider>
      <AppContent />
    </WindowManagerProvider>
  )
}
