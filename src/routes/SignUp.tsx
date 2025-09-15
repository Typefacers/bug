import { useState, memo } from 'react'
import { Button, Frame, TextInput } from 'react95'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Label } from '../components/ui/label'
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
      <div className="max-w-md mx-auto">
        <Card className="bg-[#E0E0E0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Frame
                variant="well"
                className="bg-red-100 p-2 text-sm text-red-800"
              >
                {error}
              </Frame>
            )}
            <div className="space-y-1">
              <Label htmlFor="name">Your Name</Label>
              <TextInput
                id="name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                fullWidth
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={() => {
                openWindow('leaderboard')
                if (windowId) {
                  closeWindow(windowId)
                }
              }}
            >
              Cancel
            </Button>
            <Button primary onClick={createUser}>
              Create Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default memo(SignUp)
