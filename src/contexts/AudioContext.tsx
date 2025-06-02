import { createContext, useContext } from 'react'

export interface AudioApi {
  playBugSquash: () => void
}

export const AudioContext = createContext<AudioApi | null>(null)
export const useAudioContext = () => useContext(AudioContext)
