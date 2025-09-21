import { styled } from 'styled-components'
import { Frame } from 'react95'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react'
import type { BugCardProps } from '../types/bug-card-props'
import type { Bug } from '../types/bug'
import { useBugStore, priorityModel } from '../store'
import { getBugImage } from '../utils/utils'
import { predictPriorityProbability } from '../lib/bug-priority-ml.ts'

type CardShellProps = {
  $preview: boolean
  $modal: boolean
  $inactive: boolean
}

type PriorityProps = { $priority?: Bug['priority'] }

type ImageProps = { $modal: boolean }

const cardWidth = ({ $preview, $modal }: CardShellProps) =>
  $preview ? '200px' : $modal ? 'min(90vw, 420px)' : '320px'

const cardCursor = ({ $inactive }: CardShellProps) =>
  $inactive ? 'not-allowed' : 'pointer'

const cardOpacity = ({ $inactive }: CardShellProps) => ($inactive ? 0.6 : 1)

const cardFilter = ({ $inactive }: CardShellProps) =>
  $inactive ? 'grayscale(0.4)' : 'none'

const cardHoverTransform = ({ $inactive }: CardShellProps) =>
  $inactive ? 'none' : 'translateY(-4px)'

const imageHeight = ({ $modal }: ImageProps) => ($modal ? '200px' : '180px')

const priorityBorder = ({ $priority }: PriorityProps) =>
  $priority === 'high'
    ? '#b22222'
    : $priority === 'medium'
      ? '#b8860b'
      : '#1f4f8f'

const priorityBackground = ({ $priority }: PriorityProps) =>
  $priority === 'high'
    ? '#f5d6d6'
    : $priority === 'medium'
      ? '#f4e5c0'
      : '#d5e1f7'

const CardShell = styled(Frame)<CardShellProps>`
  position: relative;
  width: ${cardWidth};
  background: ${({ theme }) => theme.material};
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: ${cardCursor};
  opacity: ${cardOpacity};
  filter: ${cardFilter};

  &:hover {
    transform: ${cardHoverTransform};
  }
`

const BugImage = styled.img<ImageProps>`
  width: 100%;
  height: ${imageHeight};
  object-fit: cover;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 16px;
`

const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`

const Title = styled.h3`
  flex: 1;
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  font-size: 11px;
  border: 1px solid ${({ theme }) => theme.borderDark};
  background: ${({ theme }) => theme.canvas};
  font-family: 'ms_sans_serif', 'Microsoft Sans Serif', sans-serif;
`

const PriorityBadge = styled(Badge)<PriorityProps>`
  border-color: ${priorityBorder};
  background: ${priorityBackground};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const Description = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
`

const SquashedOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(178, 34, 34, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
  pointer-events: none;
`

export const BugCard: React.FC<BugCardProps> = ({
  bug,
  preview = false,
  modal = false,
}) => {
  const squashBug = useBugStore(s => s.squashBug)
  const bugImage = getBugImage(bug.id)
  const highProb =
    priorityModel && bug.bounty
      ? predictPriorityProbability(bug.bounty, priorityModel)
      : null

  const handleSquash = () => {
    if (!bug.active) return
    squashBug(bug.id)
  }

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    handleSquash()
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSquash()
    }
  }

  return (
    <CardShell
      as="div"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      $preview={preview}
      $modal={modal}
      $inactive={!bug.active}
      shadow
      variant="window"
    >
      {!bug.active && <SquashedOverlay>SQUASHED</SquashedOverlay>}

      {!preview && <BugImage src={bugImage} alt={bug.title} $modal={modal} />}

      <Content>
        <HeaderRow>
          <Title>{bug.title}</Title>
          <Badge>+{bug.bounty}</Badge>
          <Badge>{bug.pto}h PTO</Badge>
          {bug.priority && (
            <PriorityBadge $priority={bug.priority}>
              {bug.priority}
            </PriorityBadge>
          )}
          {highProb !== null && (
            <Badge>{Math.round(highProb * 100)}% high risk</Badge>
          )}
        </HeaderRow>
        <Description>{bug.description}</Description>
      </Content>
    </CardShell>
  )
}
