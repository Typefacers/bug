import BugArea from '../components/BugArea'
import { useBugStore } from '../store'
import { Frame } from 'react95'
import Meta from '../components/Meta'
import { memo, type FC } from 'react'
import type { WindowComponentProps } from '../types/window'

const Bugs: FC<WindowComponentProps> = () => {
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
        <Frame
          variant="window"
          className="relative flex-grow bg-material p-2"
          style={{ minHeight: '60vh' }}
        >
          <BugArea bugs={bugs} />
        </Frame>

        <p className="text-center text-sm text-gray-800 py-2">
          Click to squash a bug&nbsp;&amp;&nbsp;earn its bounty 👆
        </p>
      </div>
    </>
  )
}

export default memo(Bugs)
