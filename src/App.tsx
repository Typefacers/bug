import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { Suspense, lazy, useEffect, useState } from 'react'
import { useKonamiDarkMode } from './hooks/use-konami-dark-mode'
import { useAudio } from './hooks/use-audio'
import { useBugStore } from './store'

const Bugs = lazy(() => import('./routes/Bugs'))
const Leaderboard = lazy(() => import('./routes/Leaderboard'))
const UserProfile = lazy(() => import('./routes/UserProfile'))
const Dashboard = lazy(() => import('./routes/Dashboard'))
const NewBug = lazy(() => import('./routes/NewBug'))
const NotFound = lazy(() => import('./routes/NotFound'))
const EasterEgg = lazy(() => import('./routes/EasterEgg'))
const Weather = lazy(() => import('./routes/Weather'))
const SignUp = lazy(() => import('./routes/SignUp'))
const Fortune = lazy(() => import('./routes/Fortune'))
const JobDescription = lazy(() => import('./routes/JobDescription'))
import { Minus, Square, X as CloseIcon } from 'lucide-react'
import Taskbar from './components/Taskbar'
import { AudioContext } from './contexts/AudioContext'
import Window from './components/win95/Window'
import TitleBar from './components/win95/TitleBar'
import TabLink from './components/win95/TabLink'
import Win95Button from './components/win95/Button'
function AppContent() {
  const location = useLocation()
  const { startAutomaticSystems, stopAutomaticSystems } = useBugStore()
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [hidden, setHidden] = useState(false)
  useKonamiDarkMode()

  useEffect(() => {
    startAutomaticSystems()
    return () => stopAutomaticSystems()
  }, [startAutomaticSystems, stopAutomaticSystems])

  const getWindowTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Bug Basher'
      case '/dashboard':
        return 'Bug Dashboard'
      case '/bounty-leaderboard':
        return 'Bug Bounty Leaderboard'
      case '/bug/new':
        return 'File a Bug'
      case '/sign-up':
        return 'Sign Up'
      case '/easter-egg':
        return 'Secret Bug Found'
      case '/weather':
        return 'Weather Forecast'
      case '/fortune':
        return 'Fortune Cookie'
      case '/job-description':
        return 'Job Description'
      default:
        if (location.pathname.startsWith('/user/')) return 'User Profile'
        return 'Page Not Found'
    }
  }

  if (hidden) {
    return (
      <div className="min-h-screen bg-[#008080] p-4 font-['MS_Sans_Serif','Tahoma',sans-serif] flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <Win95Button onClick={() => setHidden(false)}>
            Reopen Window
          </Win95Button>
        </div>
        <Taskbar
          windowTitle={getWindowTitle()}
          minimized
          onToggle={() => setHidden(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#008080] p-4 font-['MS_Sans_Serif','Tahoma',sans-serif] flex flex-col">
      <div className="flex-grow flex">
        {!minimized && (
          <div className={`mx-auto w-full flex-grow flex ${maximized ? '' : 'max-w-7xl'}`}>
            <Window>
              <TitleBar
                title={getWindowTitle()}
                controls={
                  <div className="flex gap-px">
                    {[
                      {
                        Icon: Minus,
                        label: 'Minimize',
                        onClick: () => setMinimized(true),
                      },
                      {
                        Icon: Square,
                        label: maximized ? 'Restore' : 'Maximize',
                        onClick: () => setMaximized(v => !v),
                      },
                      {
                        Icon: CloseIcon,
                        label: 'Close',
                        onClick: () => setHidden(true),
                      },
                    ].map(({ Icon, label, onClick }) => (
                      <Win95Button
                        key={label}
                        aria-label={label}
                        onClick={onClick}
                        className="h-6 w-6 p-0"
                      >
                        <Icon className="h-3 w-3 text-black" />
                      </Win95Button>
                    ))}
                  </div>
                }
              />
              <div className="bg-[#E0E0E0] p-3 flex flex-col flex-grow">
                <div className="mb-4 bg-[#C0C0C0] flex gap-1 p-1 sticky top-0 z-10">
                  <TabLink to="/" active={location.pathname === '/'}>🐛 Bugs</TabLink>
                  <TabLink to="/dashboard" active={location.pathname === '/dashboard'}>📊 Dashboard</TabLink>
                  <TabLink to="/bounty-leaderboard" active={location.pathname === '/bounty-leaderboard'}>🏆 Leaderboard</TabLink>
                  <TabLink to="/weather" active={location.pathname === '/weather'}>🌦️ Weather</TabLink>
                  <TabLink to="/fortune" active={location.pathname === '/fortune'}>🥠 Fortune</TabLink>
                  <TabLink to="/sign-up" active={location.pathname === '/sign-up'}>✍️ Sign Up</TabLink>
                  <TabLink to="/job-description" active={location.pathname === '/job-description'}>📄 Job Description</TabLink>
                </div>
                <div className="p-2 overflow-auto relative z-0 flex-grow flex flex-col">
                  <Suspense fallback={<div className="p-4">Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Bugs />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/bounty-leaderboard" element={<Leaderboard />} />
                      <Route path="/weather" element={<Weather />} />
                      <Route path="/fortune" element={<Fortune />} />
                      <Route path="/user/:userId" element={<UserProfile />} />
                      <Route path="/bug/new" element={<NewBug />} />
                      <Route path="/sign-up" element={<SignUp />} />
                      <Route path="/job-description" element={<JobDescription />} />
                      <Route path="/easter-egg" element={<EasterEgg />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </div>
              </div>
            </Window>
          </div>
        )}
      </div>
      <Taskbar
        windowTitle={getWindowTitle()}
        minimized={minimized}
        onToggle={() => setMinimized(v => !v)}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AudioContext.Provider value={useAudio()}>
        <AppContent />
      </AudioContext.Provider>
    </BrowserRouter>
  )
}
