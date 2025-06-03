import Meta from '../components/Meta'
import FortuneCookie from '../components/FortuneCookie'

export default function Fortune() {
  return (
    <>
      <Meta
        title="Fortune Cookie"
        description="Get a random bug-themed fortune."
      />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Fortune Cookie</h1>
        <FortuneCookie />
      </div>
    </>
  )
}
