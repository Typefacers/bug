import { Link } from 'react-router-dom'
import { raised, windowShadow } from '../utils/win95'

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const itemClass = `block px-2 py-1 bg-[#C0C0C0] hover:bg-[#0000FF] hover:text-white text-black font-['MS_Sans_Serif',_sans-serif] text-xs transition-none`
  return (
    <div
      className={`absolute bottom-7 left-0 w-36 p-1 bg-[#C0C0C0] ${raised} ${windowShadow} text-xs font-['MS_Sans_Serif',_sans-serif] z-50`}
    >
      <ul className="space-y-0">
        <li>
          <Link to="/" onClick={onClose} className={itemClass}>
            Bugs
          </Link>
        </li>
        <li>
          <Link to="/dashboard" onClick={onClose} className={itemClass}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/bounty-leaderboard"
            onClick={onClose}
            className={itemClass}
          >
            Leaderboard
          </Link>
        </li>
        <li>
          <Link to="/weather" onClick={onClose} className={itemClass}>
            Weather
          </Link>
        </li>
        <li>
          <Link to="/sign-up" onClick={onClose} className={itemClass}>
            Sign Up
          </Link>
        </li>
      </ul>
    </div>
  )
}
