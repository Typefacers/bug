import BugArea from '../components/BugArea'
import { useBugStore } from '../store'
import { raised } from '../utils/win95'
import Meta from '../components/Meta'
import FortuneCookie from '../components/FortuneCookie'

export default function Bugs() {
  const bugs = useBugStore(s => s.bugs)

  return (
    <>
      <Meta
        title="Bug Basher - Squash Bugs"
        description="Play Bug Basher and earn bounties by squashing pesky bugs."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Bug Basher',
        }}
      />
      <div className="flex flex-col h-full">
        <div
          className={`bg-[#E0E0E0] ${raised} p-2 flex-grow relative`}
          style={{ minHeight: '60vh' }}
        >
          <BugArea bugs={bugs} />
        </div>

        <p className="text-center text-sm text-gray-800 py-2">
          Click to squash a bug&nbsp;&amp;&nbsp;earn its bounty 👆
        </p>
        <FortuneCookie />
      </div>
    </>
  )
}
