import { useEffect, useRef } from 'react'
import { useBugStore } from '../store'

export function useAudio() {
  const ctxRef = useRef<AudioContext>()
  const ambientGain = useRef<GainNode>()

  useEffect(() => {
    const typedWindow = window as typeof window & {
      webkitAudioContext?: typeof AudioContext
    }
    const Ctor = window.AudioContext || typedWindow.webkitAudioContext
    const ctx = new Ctor()
    const gain = ctx.createGain()
    gain.gain.value = 0.05
    gain.connect(ctx.destination)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 220
    osc.connect(gain)
    osc.start()

    ctxRef.current = ctx
    ambientGain.current = gain

    return () => {
      osc.stop()
      ctx.close()
    }
  }, [])

  const playBugSquash = () => {
    const ctx = ctxRef.current
    if (!ctx) return
    const o = ctx.createOscillator()
    o.type = 'square'
    o.frequency.value = 440
    const g = ctx.createGain()
    g.gain.value = 0.2
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.1)
  }

  const activeCount = useBugStore(s => s.bugs.filter(b => b.active).length)
  useEffect(() => {
    if (ambientGain.current) {
      ambientGain.current.gain.value = 0.02 + 0.01 * Math.min(activeCount, 10)
    }
  }, [activeCount])

  return { playBugSquash }
}
