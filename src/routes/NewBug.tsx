import { useState, memo } from 'react'
import { styled } from 'styled-components'
import { Button, Frame, Select, TextInput } from 'react95'
import { useBugStore } from '../store'
import { v4 as uuidv4 } from 'uuid'
import type { Bug } from '../types/bug'
import Meta from '../components/Meta'
import Captcha from '../components/Captcha'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

type PriorityOption = 'high' | 'medium' | 'low'

const FormContainer = styled.div`
  width: 100%;
  max-width: 520px;
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

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabel = styled.label`
  font-size: 13px;
`

const TextAreaField = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 6px;
  font-size: 13px;
  font-family: inherit;
  border: 1px solid ${({ theme }) => theme.borderDark};
  background: ${({ theme }) => theme.canvas};
  resize: vertical;
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

function NewBug({ windowId }: WindowComponentProps = {}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [bounty, setBounty] = useState(50)
  const [priority, setPriority] = useState<PriorityOption>('medium')
  const [error, setError] = useState('')
  const [captchaValid, setCaptchaValid] = useState(false)

  const addBug = useBugStore(s => s.addBug)
  const { openWindow, closeWindow } = useWindowManager()

  const finish = () => {
    openWindow('dashboard')
    if (windowId) {
      closeWindow(windowId)
    }
  }

  const createBug = () => {
    if (!title) {
      setError('Please enter a title for the bug')
      return
    }

    if (!description) {
      setError('Please enter a description for the bug')
      return
    }

    if (!captchaValid) {
      setError('Please solve the captcha')
      return
    }

    const newBug: Bug = {
      id: uuidv4().substring(0, 8),
      title,
      description,
      bounty,
      pto: 0,
      active: true,
      priority,
      createdAt: new Date().toISOString(),
    }

    addBug(newBug)
    finish()
  }

  return (
    <>
      <Meta
        title="File a New Bug"
        description="Report a new bug and earn bounties in Bug Basher."
      />
      <FormContainer>
        <FormFrame>
          <Title>File a New Bug</Title>
          {error && <ErrorBanner>{error}</ErrorBanner>}

          <FieldGroup>
            <FieldLabel htmlFor="title">Bug Title</FieldLabel>
            <TextInput
              id="title"
              value={title}
              onChange={event => setTitle(event.target.value)}
              fullWidth
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <TextAreaField
              id="description"
              value={description}
              onChange={event => setDescription(event.target.value)}
            />
          </FieldGroup>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <FieldGroup style={{ flex: '1 1 160px' }}>
              <FieldLabel htmlFor="bounty">Bounty Amount ($)</FieldLabel>
              <TextInput
                id="bounty"
                type="number"
                min={10}
                value={bounty}
                onChange={event => setBounty(Number(event.target.value))}
              />
            </FieldGroup>
            <FieldGroup style={{ flex: '1 1 160px' }}>
              <FieldLabel htmlFor="priority">Priority</FieldLabel>
              <Select<PriorityOption>
                aria-label="Priority"
                value={priority}
                options={[
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ]}
                onChange={option => setPriority(option.value)}
                width="100%"
              />
            </FieldGroup>
          </div>

          <Captcha onChange={setCaptchaValid} />

          <ActionsRow>
            <Button onClick={finish}>Cancel</Button>
            <Button primary disabled={!captchaValid} onClick={createBug}>
              Submit Bug
            </Button>
          </ActionsRow>
        </FormFrame>
      </FormContainer>
    </>
  )
}

export default memo(NewBug)
