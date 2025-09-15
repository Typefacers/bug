import { useEffect } from 'react'
import { useKonamiDarkMode } from './hooks/use-konami-dark-mode'
import { useAudio } from './hooks/use-audio'
import { useBugStore } from './store'
import { AudioContext } from './contexts/AudioContext'
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
    <AudioContext.Provider value={useAudio()}>
      <WindowManagerProvider>
        <AppContent />
      </WindowManagerProvider>
    </AudioContext.Provider>
  )
}
