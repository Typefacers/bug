import { Link } from 'react-router-dom'
import Meta from '../components/Meta'
import { memo } from 'react'

function EasterEgg() {
  return (
    <>
      <Meta
        title="Secret Bug Found - Bug Basher"
        description="You've discovered a hidden page in Bug Basher."
      />
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">\uD83E\uDD5A Easter Egg</h1>
        <p>
          You found the hidden page! There isn't much here, but enjoy the
          bragging rights.
        </p>
        <Link to="/" className="text-indigo-600 hover:underline">
          Back to squashing bugs
        </Link>
      </div>
    </>
  )
}

export default memo(EasterEgg)
