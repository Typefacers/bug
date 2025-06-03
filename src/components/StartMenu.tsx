import { Link } from 'react-router-dom'
import { raised, sunken, windowShadow } from '../utils/win95'

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const itemClass = `block px-2 py-1 ${raised} bg-[#E0E0E0] hover:${sunken}`
  return (
    <div
      className={`absolute bottom-8 left-0 w-40 p-2 bg-[#C0C0C0] ${raised} ${windowShadow} text-sm`}
    >
      <ul className="space-y-1">
        <li>
          <Link to="/" onClick={onClose} className={itemClass}>
            🐛 Bugs
          </Link>
        </li>
        <li>
          <Link to="/dashboard" onClick={onClose} className={itemClass}>
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/bounty-leaderboard"
            onClick={onClose}
            className={itemClass}
          >
            🏆 Leaderboard
          </Link>
        </li>
        <li>
          <Link to="/weather" onClick={onClose} className={itemClass}>
            🌦️ Weather
          </Link>
        </li>
        <li>
          <Link to="/sign-up" onClick={onClose} className={itemClass}>
            ✍️ Sign Up
          </Link>
        </li>
      </ul>
    </div>
  )
}
