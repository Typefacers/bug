import { Link } from 'react-router-dom'
import Meta from '../components/Meta'

export default function NotFound() {
  return (
    <>
      <Meta
        title="Page Not Found - Bug Bounty"
        description="This route is more elusive than a bug-free codebase."
      />
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg">
          Well, this is embarrassing. You found the page even we can&apos;t
          find.
        </p>
        <p>
          Either it never existed or a hungry bug devoured it in a midnight
          snack.
        </p>
        <Link to="/" className="text-indigo-600 hover:underline">
          Back to the bug hunt
        </Link>
      </div>
    </>
  )
}
