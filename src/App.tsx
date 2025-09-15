import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import { AudioContext } from './contexts/AudioContext'
import { DesktopProvider } from './contexts/DesktopContext'
import { useAudio } from './hooks/use-audio'
import { useKonamiDarkMode } from './hooks/use-konami-dark-mode'
import { useBugStore } from './store'

function Win95Shell() {
  useKonamiDarkMode()
  const { startAutomaticSystems, stopAutomaticSystems } = useBugStore()

  useEffect(() => {
    startAutomaticSystems()
    return () => stopAutomaticSystems()
  }, [startAutomaticSystems, stopAutomaticSystems])

  return (
    <div className="min-h-screen bg-[#008080] font-['MS_Sans_Serif','Tahoma',sans-serif]">
      <div className="flex min-h-screen flex-col gap-2 px-4 py-4">
        <Desktop />
        <Taskbar />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AudioContext.Provider value={useAudio()}>
        <DesktopProvider>
          <Win95Shell />
        </DesktopProvider>
      </AudioContext.Provider>
    </BrowserRouter>
  )
}
