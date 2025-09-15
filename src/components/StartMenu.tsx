import { Link } from 'react-router-dom'
import { raised, sunken, windowShadow } from '../utils/win95'

type Props = {
  onClose: () => void
  onOpenWindow?: () => void
}

const items = [
  { to: '/', label: '🐛 Bugs' },
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/bounty-leaderboard', label: '🏆 Leaderboard' },
  { to: '/weather', label: '🌦️ Weather' },
  { to: '/fortune', label: '🥠 Fortune' },
  { to: '/sign-up', label: '✍️ Sign Up' },
  { to: '/job-description', label: '📄 Job Description' },
]

export default function StartMenu({ onClose, onOpenWindow }: Props) {
  const itemClass = `block px-2 py-1 ${raised} bg-[#E0E0E0] hover:${sunken}`
  return (
    <div
      className={`absolute bottom-8 left-0 w-44 p-2 bg-[#C0C0C0] ${raised} ${windowShadow} text-sm`}
    >
      <ul className="space-y-1">
        {items.map(item => (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={() => {
                onOpenWindow?.()
                onClose()
              }}
              className={itemClass}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
