import Meta from '../components/Meta'
import { memo } from 'react'

function JobDescription() {
  return (
    <>
      <Meta
        title="Job Description"
        description="Learn about the prestigious Bug Basher position."
      />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Bug Basher Role</h1>
        <p>
          We're looking for fearless developers to squash imaginary bugs in our
          retro-inspired arena. Duties include clicking frantically, sipping
          copious coffee, and laughing at our codebase.
        </p>
        <p>
          Benefits include bragging rights, unlimited virtual PTO, and the
          occasional congratulatory meme.
        </p>
      </div>
    </>
  )
}

export default memo(JobDescription)
