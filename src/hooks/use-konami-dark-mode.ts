import { useEffect } from 'react'

const CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export const useKonamiDarkMode = () => {
  useEffect(() => {
    let index = 0
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      const expected = CODE[index]
      if (
        key === expected ||
        (expected === 'b' && key.toLowerCase() === 'b') ||
        (expected === 'a' && key.toLowerCase() === 'a')
      ) {
        index += 1
        if (index === CODE.length) {
          document.documentElement.classList.toggle('dark')
          index = 0
        }
      } else {
        index = key === CODE[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
