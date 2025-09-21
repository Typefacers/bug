import { useState, useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import { createPortal } from 'react-dom'
import { Button } from 'react95'
import type { BugCrawlerProps } from '../types/bug-crawler-props'
import { getBugImage } from '../utils/utils'
import { BugCard } from './BugCard'
import { useBugStore } from '../store'

const SPRITE_SIZE = 40

const BugSprite = styled.div`
  position: absolute;
  width: ${SPRITE_SIZE}px;
  height: ${SPRITE_SIZE}px;
  transform-style: preserve-3d;
`

const BugImage = styled.img<{ $inactive: boolean }>`
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  filter: ${({ $inactive }) =>
    $inactive
      ? 'grayscale(0.6) opacity(0.5) drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
      : 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))'};
  transition: transform 0.1s linear;
`

const PreviewContainer = styled.div`
  position: fixed;
  z-index: 50;
  pointer-events: none;
`

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
`

const ModalContent = styled.div`
  position: relative;
`

const CloseButton = styled(Button).attrs({ square: true, size: 'sm' as const })`
  position: absolute;
  top: 8px;
  right: 8px;
`

const BugCrawler: React.FC<BugCrawlerProps> = ({
  x,
  y,
  bug,
  containerWidth,
  containerHeight,
}) => {
  const [showPreview, setShowPreview] = useState(false)
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const inspectBug = useBugStore(s => s.inspectBug)
  const inspectedId = useBugStore(s => s.inspectedId)
  const showModal = inspectedId === bug.id

  const bugRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(showModal)

  const isAlive = bug.active

  const [position, setPosition] = useState({ x, y })
  const positionRef = useRef({ x, y })

  const initialAngle = Math.random() * Math.PI * 2
  const [direction, setDirection] = useState({
    x: Math.cos(initialAngle),
    y: Math.sin(initialAngle),
  })
  const directionRef = useRef(direction)

  const lastTurn = useRef<number>(Date.now())
  const rafRef = useRef<number>()

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  useEffect(() => {
    if (showModal && isAlive) {
      wasOpenRef.current = true
      requestAnimationFrame(() => modalRef.current?.focus())
    } else if (wasOpenRef.current) {
      bugRef.current?.focus()
      wasOpenRef.current = false
    }
  }, [showModal, isAlive])

  useEffect(() => {
    let last = performance.now()

    const step = (now: number) => {
      if (!isAlive) return

      const dt = (now - last) / 1000
      last = now

      const elapsed = now - lastTurn.current
      const changeHeading = elapsed > 2000 + Math.random() * 2000

      if (changeHeading) {
        const angle = Math.random() * Math.PI * 2
        const dir = { x: Math.cos(angle), y: Math.sin(angle) }
        directionRef.current = dir
        setDirection(dir)
        lastTurn.current = now
      }

      const speed = 36
      const maxX = (containerWidth || window.innerWidth) - SPRITE_SIZE
      const maxY = (containerHeight || window.innerHeight) - SPRITE_SIZE

      let newX = positionRef.current.x + directionRef.current.x * speed * dt
      let newY = positionRef.current.y + directionRef.current.y * speed * dt

      if (newX <= 0 || newX >= maxX) {
        directionRef.current.x *= -1
        newX = Math.max(0, Math.min(maxX, newX))
      }
      if (newY <= 0 || newY >= maxY) {
        directionRef.current.y *= -1
        newY = Math.max(0, Math.min(maxY, newY))
      }

      positionRef.current = { x: newX, y: newY }
      setPosition(positionRef.current)

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isAlive, containerWidth, containerHeight])

  const heading2D = (Math.atan2(direction.y, direction.x) * 180) / Math.PI - 90
  const tiltY = direction.x * 25
  const tiltX = 18
  const bugImage = getBugImage(bug.id)

  return (
    <>
      <BugSprite
        data-bug-id={bug.id}
        ref={bugRef}
        tabIndex={-1}
        onClick={() => inspectBug(bug.id)}
        onMouseEnter={event => {
          const rect = event.currentTarget.getBoundingClientRect()
          setHoverPos({ x: rect.left, y: rect.top })
          setShowPreview(true)
        }}
        onMouseLeave={() => setShowPreview(false)}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          perspective: 600,
          cursor: isAlive ? 'pointer' : 'default',
          zIndex: isAlive ? 5 : 3,
        }}
      >
        <BugImage
          data-bug-id={bug.id}
          src={bugImage}
          alt={bug.title}
          $inactive={!isAlive}
          style={{
            transform: `rotate(${heading2D + 180}deg) rotateY(${tiltY}deg) rotateX(${tiltX}deg)`,
          }}
        />

        {showPreview &&
          isAlive &&
          createPortal(
            <PreviewContainer
              style={{ left: hoverPos.x + 50, top: hoverPos.y }}
            >
              <BugCard bug={bug} preview />
            </PreviewContainer>,
            document.body
          )}
      </BugSprite>

      {showModal && isAlive && (
        <ModalBackdrop
          ref={modalRef}
          tabIndex={-1}
          onClick={event => {
            event.stopPropagation()
            inspectBug(null)
          }}
        >
          <ModalContent
            onClick={event => {
              event.stopPropagation()
            }}
          >
            <CloseButton onClick={() => inspectBug(null)}>✕</CloseButton>
            <BugCard bug={bug} modal />
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  )
}

export default BugCrawler
