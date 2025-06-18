import { useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@nattui/react-components'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useBugStore } from '../store'
import { raised as raisedBase, sunken as sunkenBase } from '../utils/win95'
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

function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const addUser = useBugStore(s => s.addUser)

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

    navigate('/bounty-leaderboard')
  }

  const raised = `${raisedBase} shadow-sm`
  const sunken = `${sunkenBase} shadow-inner`

  return (
    <>
      <Meta title="Sign Up" description="Create a new Bug Basher account." />
      <div className="max-w-md mx-auto">
        <Card className={`bg-[#E0E0E0] ${raised}`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className={`${sunken} bg-red-100 text-red-800 p-2 text-sm`}>
                {error}
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                className={`bg-white ${sunken}`}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              className={`${raised} bg-[#C0C0C0] hover:bg-[#A0A0A0] text-black`}
              onClick={() => navigate('/bounty-leaderboard')}
            >
              Cancel
            </Button>
            <Button
              className={`${raised} bg-[#008080] hover:bg-[#006666] text-white`}
              onClick={createUser}
            >
              Create Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default memo(SignUp)
