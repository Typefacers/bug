import BugArea from '../components/BugArea'
import { useBugStore } from '../store'
import { raised } from '../utils/win95'
import { Button } from '../components/ui/button'
import Meta from '../components/Meta'

export default function Bugs() {
  const bugs = useBugStore(s => s.bugs)
  const triggerQuantumApocalypse = useBugStore(s => s.triggerQuantumApocalypse)
  const quantumMode = useBugStore(s => s.quantumMode)

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
        <div className="text-center">
          <Button
            variant="default"
            onClick={triggerQuantumApocalypse}
            disabled={quantumMode}
            className="mt-2 bg-purple-600 text-white hover:bg-purple-700"
          >
            {quantumMode ? 'Quantum Storm!' : 'Start Quantum Apocalypse'}
          </Button>
        </div>
      </div>
    </>
  )
}
