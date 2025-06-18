import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
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
import { raised, windowShadow } from './utils/win95'
import Taskbar from './components/Taskbar'
import { Button } from '@nattui/react-components'
import { AudioContext } from './contexts/AudioContext'

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
          <Button
            className={`px-4 py-2 bg-[#C0C0C0] ${raised} ${windowShadow}`}
            onClick={() => setHidden(false)}
          >
            Reopen Window
          </Button>
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
          <div
            className={`mx-auto w-full flex-grow flex ${maximized ? '' : 'max-w-7xl'}`}
          >
            {/* Single Win95 Window */}
            <div
              className={`w-full bg-[#C0C0C0] ${raised} ${windowShadow} flex flex-col`}
            >
              {/* Title-bar */}
              <div className="h-8 select-none border-b-2 border-b-white bg-[#000080] px-2 text-white z-10">
                <div className="flex h-full items-center justify-between">
                  <span className="font-bold tracking-wider">
                    {getWindowTitle()}
                  </span>
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
                      <Button
                        key={label}
                        aria-label={label}
                        onClick={onClick}
                        className={`flex h-6 w-6 items-center justify-center bg-[#C0C0C0] ${raised} transition-colors hover:bg-[#A0A0A0] active:bg-[#A0A0A0]`}
                      >
                        <Icon className="h-3 w-3 text-black" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Window Content Area */}
              <div className="bg-[#E0E0E0] p-3 flex flex-col flex-grow">
                {/* Navigation Tabs */}
                <div className="mb-4 bg-[#C0C0C0] flex gap-1 p-1 sticky top-0 z-10">
                  <Link
                    to="/"
                    className={`px-4 py-1 ${location.pathname === '/' ? 'bg-[#E0E0E0] font-semibold' : 'hover:bg-[#D0D0D0]'}`}
                  >
                    🐛 Bugs
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-1 ${location.pathname === '/dashboard' ? 'bg-[#E0E0E0] font-semibold' : 'hover:bg-[#D0D0D0]'}`}
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    to="/bounty-leaderboard"
                    className={`px-4 py-1 ${location.pathname === '/bounty-leaderboard' ? 'bg-[#E0E0E0] font-semibold' : 'hover:bg-[#D0D0D0]'}`}
                  >
                    🏆 Leaderboard
                  </Link>
                  <Link
                    to="/weather"
                    className={`px-4 py-1 ${location.pathname === '/weather' ? 'bg-[#E0E0E0] font-semibold' : 'hover:bg-[#D0D0D0]'}`}
                  >
                    🌦️ Weather
                  </Link>
                  <Link
                    to="/fortune"
                    className={`px-4 py-1 ${location.pathname === '/fortune' ? 'bg-[#E0E0E0] font-semibold' : 'hover:bg-[#D0D0D0]'}`}
                  >
                    🥠 Fortune
                  </Link>
                  <Link
                    to="/sign-up"
                    className={`px-4 py-1 ${location.pathname === '/sign-up' ? 'bg-[#E0E0E0] font-semibold' : 'hover:bg-[#D0D0D0]'}`}
                  >
                    ✍️ Sign Up
                  </Link>
                  <Link
                    to="/job-description"
                    className={`px-4 py-1 ${location.pathname === '/job-description' ? 'bg-[#E0E0E0] font-semibold' : 'hover:bg-[#D0D0D0]'}`}
                  >
                    📄 Job Description
                  </Link>
                </div>

                {/* Route Content */}
                <div className="p-2 overflow-auto relative z-0 flex-grow flex flex-col">
                  <Suspense fallback={<div className="p-4">Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Bugs />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route
                        path="/bounty-leaderboard"
                        element={<Leaderboard />}
                      />
                      <Route path="/weather" element={<Weather />} />
                      <Route path="/fortune" element={<Fortune />} />
                      <Route path="/user/:userId" element={<UserProfile />} />
                      <Route path="/bug/new" element={<NewBug />} />
                      <Route path="/sign-up" element={<SignUp />} />
                      <Route
                        path="/job-description"
                        element={<JobDescription />}
                      />
                      <Route path="/easter-egg" element={<EasterEgg />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </div>
              </div>
            </div>
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
