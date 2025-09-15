import { useState, memo } from 'react'
import { Button, Frame, Select } from 'react95'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { useBugStore } from '../store'
import { v4 as uuidv4 } from 'uuid'
import { motion } from 'framer-motion'
import { Bug } from '../types/bug'
import Meta from '../components/Meta'
import Captcha from '../components/Captcha'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

function NewBug({ windowId }: WindowComponentProps = {}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [bounty, setBounty] = useState(50)
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [error, setError] = useState('')
  const [captchaValid, setCaptchaValid] = useState(false)

  const addBug = useBugStore(s => s.addBug)
  const { openWindow, closeWindow } = useWindowManager()

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
    openWindow('dashboard')
    if (windowId) {
      closeWindow(windowId)
    }
  }

  /* 3-D border helpers with enhanced styles */
  return (
    <>
      <Meta
        title="File a New Bug"
        description="Report a new bug and earn bounties in Bug Basher."
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">File a New Bug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Frame
                variant="field"
                className="bg-red-100 px-3 py-2 text-sm text-red-800"
              >
                {error}
              </Frame>
            )}

            <div className="space-y-1">
              <Label htmlFor="title">Bug Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="bounty">Bounty Amount ($)</Label>
                <Input
                  id="bounty"
                  type="number"
                  min={10}
                  value={bounty}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBounty(Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="priority">Priority</Label>
                <Select<'high' | 'medium' | 'low'>
                  options={[
                    { value: 'high', label: 'high' },
                    { value: 'medium', label: 'medium' },
                    { value: 'low', label: 'low' },
                  ]}
                  value={priority}
                  onChange={option => setPriority(option.value)}
                  width="100%"
                />
              </div>
            </div>

            <Captcha onChange={setCaptchaValid} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={() => {
                openWindow('dashboard')
                if (windowId) {
                  closeWindow(windowId)
                }
              }}
            >
              Cancel
            </Button>
            <Button disabled={!captchaValid} onClick={createBug} primary>
              Submit Bug
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  )
}

export default memo(NewBug)
