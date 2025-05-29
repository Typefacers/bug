import { useEffect, useState } from 'react'
import type { ElementSize } from '../types/element-size'

export const useElementSize = <T extends HTMLElement>(
  ref: React.RefObject<T>
): ElementSize => {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      setSize({ width, height })
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [ref])

  return size
}
