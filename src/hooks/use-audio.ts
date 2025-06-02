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

    // short burst of filtered noise for a "splat" texture
    const noiseBuffer = ctx.createBuffer(
      1,
      ctx.sampleRate * 0.2,
      ctx.sampleRate
    )
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1000
    noise.connect(filter)

    // pitched component that quickly drops in frequency
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    filter.connect(gain)
    osc.connect(gain)
    gain.connect(ctx.destination)

    noise.start()
    osc.start()
    noise.stop(ctx.currentTime + 0.3)
    osc.stop(ctx.currentTime + 0.3)
  }

  const activeCount = useBugStore(s => s.bugs.filter(b => b.active).length)
  useEffect(() => {
    if (ambientGain.current) {
      ambientGain.current.gain.value = 0.02 + 0.01 * Math.min(activeCount, 10)
    }
  }, [activeCount])

  return { playBugSquash }
}
