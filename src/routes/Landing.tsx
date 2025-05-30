import { Link } from 'react-router-dom'
import Meta from '../components/Meta'
import { raised } from '../utils/win95'

export default function Landing() {
  return (
    <>
      <Meta
        title="Bug Basher - Welcome"
        description="Start squashing bugs and earning bounties."
      />
      <div className="flex flex-col items-center justify-center gap-6 flex-grow text-center">
        <h1 className="text-3xl font-bold">Welcome to Bug Basher</h1>
        <p className="text-lg max-w-md">
          Join the ultimate bug bounty experience and climb the leaderboard by
          squashing pesky critters.
        </p>
        <Link
          to="/bugs"
          className={`px-4 py-2 bg-[#C0C0C0] ${raised} hover:bg-[#A0A0A0]`}
        >
          Start Squashing
        </Link>
      </div>
    </>
  )
}
