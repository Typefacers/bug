import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

type Props = {
  location?: string
}

const Bugs = lazy(() => import('./Bugs'))
const Leaderboard = lazy(() => import('./Leaderboard'))
const UserProfile = lazy(() => import('./UserProfile'))
const Dashboard = lazy(() => import('./Dashboard'))
const NewBug = lazy(() => import('./NewBug'))
const NotFound = lazy(() => import('./NotFound'))
const EasterEgg = lazy(() => import('./EasterEgg'))
const Weather = lazy(() => import('./Weather'))
const SignUp = lazy(() => import('./SignUp'))
const Fortune = lazy(() => import('./Fortune'))
const JobDescription = lazy(() => import('./JobDescription'))

export default function AppRoutes({ location }: Props) {
  return (
    <Suspense fallback={<div className="p-4 text-sm">Loading...</div>}>
      <Routes location={location}>
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
  )
}
