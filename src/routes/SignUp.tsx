import { useState, memo, type ChangeEvent } from 'react'
import Win95Button from '../components/win95/Button'
import Input from '../components/win95/Input'
import { Label } from '../components/ui/label'
import { Frame } from 'react95'
import { useBugStore } from '../store'
import Meta from '../components/Meta'
import ladybugAvatar from '../assets/profile-ladybug.png'
import beeAvatar from '../assets/profile-bee.png'
import spiderAvatar from '../assets/spider.png'
import flyAvatar from '../assets/fly.png'
import mosquitoAvatar from '../assets/mosquito.png'
import beetleAvatar from '../assets/brown-beetle.png'
import antAvatar from '../assets/ant.png'
import mothAvatar from '../assets/moth.png'
import cockroachAvatar from '../assets/cockroach.png'
import caterpillarAvatar from '../assets/caterpillar.png'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

function SignUp({ windowId }: WindowComponentProps = {}) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const addUser = useBugStore(s => s.addUser)
  const { openWindow, closeWindow } = useWindowManager()

  const avatars = [
    ladybugAvatar,
    beeAvatar,
    spiderAvatar,
    flyAvatar,
    mosquitoAvatar,
    beetleAvatar,
    antAvatar,
    mothAvatar,
    cockroachAvatar,
    caterpillarAvatar,
  ]

  const createUser = () => {
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }

    const avatar = avatars[Math.floor(Math.random() * avatars.length)]

    addUser({
      id: Date.now(),
      name: name.trim(),
      avatar,
      bugs: [],
      bounty: 0,
      score: 0,
      bugsSquashed: [],
    })

    openWindow('leaderboard')
    if (windowId) {
      closeWindow(windowId)
    }
  }

  return (
    <>
      <Meta title="Sign Up" description="Create a new Bug Basher account." />
      <div className="mx-auto max-w-md">
        <Frame
          variant="window"
          shadow
          className="space-y-4 bg-[#d1d1d1] p-6 text-left"
        >
          <header>
            <h2 className="text-2xl font-bold text-black">Sign Up</h2>
          </header>
          {error && (
            <Frame
              variant="well"
              className="bg-[#ffeaea] px-3 py-2 text-sm text-red-700"
            >
              {error}
            </Frame>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-left text-sm font-semibold">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              fullWidth
            />
          </div>
          <div className="flex justify-between gap-2">
            <Win95Button
              size="sm"
              onClick={() => {
                openWindow('leaderboard')
                if (windowId) {
                  closeWindow(windowId)
                }
              }}
            >
              Cancel
            </Win95Button>
            <Win95Button size="sm" primary onClick={createUser}>
              Create Account
            </Win95Button>
          </div>
        </Frame>
      </div>
    </>
  )
}

export default memo(SignUp)
