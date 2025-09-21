import { useState, memo } from 'react'
import { styled } from 'styled-components'
import { Button, Frame, TextInput } from 'react95'
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

const FormWrapper = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
`

const FormFrame = styled(Frame).attrs({
  variant: 'window' as const,
  shadow: true,
})`
  background: ${({ theme }) => theme.material};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const FormTitle = styled.h2`
  margin: 0;
  font-size: 22px;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabel = styled.label`
  font-size: 13px;
`

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`

const ErrorBanner = styled(Frame).attrs({ variant: 'well' as const })`
  background: #f8d7da;
  color: #721c24;
  padding: 8px;
  font-size: 13px;
`

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

  const finish = () => {
    openWindow('leaderboard')
    if (windowId) {
      closeWindow(windowId)
    }
  }

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

    finish()
  }

  return (
    <>
      <Meta title="Sign Up" description="Create a new Bug Basher account." />
      <FormWrapper>
        <FormFrame>
          <FormTitle>Sign Up</FormTitle>
          {error && <ErrorBanner>{error}</ErrorBanner>}
          <FieldGroup>
            <FieldLabel htmlFor="name">Your Name</FieldLabel>
            <TextInput
              id="name"
              value={name}
              onChange={event => setName(event.target.value)}
              fullWidth
            />
          </FieldGroup>
          <ActionsRow>
            <Button onClick={finish}>Cancel</Button>
            <Button primary onClick={createUser}>
              Create Account
            </Button>
          </ActionsRow>
        </FormFrame>
      </FormWrapper>
    </>
  )
}

export default memo(SignUp)
