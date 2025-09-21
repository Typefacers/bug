import { useCallback, useMemo, useState, memo, type FC } from 'react'
import { styled } from 'styled-components'
import {
  Button,
  Frame,
  ProgressBar,
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from 'react95'
import { useBugStore } from '../store'
import { Bug } from '../types/bug'
import BugTrendsChart from '../components/BugTrendsChart'
import BugForecast from '../components/BugForecast'
import Meta from '../components/Meta'
import { calculateTotalBounty, formatDate } from '../utils/dashboard'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 8px;
`

const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Heading = styled.h1`
  margin: 0;
  font-size: 24px;
`

const Subtitle = styled.span`
  font-size: 13px;
`

const StatsRow = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`

const StatCard = styled(Frame).attrs({
  variant: 'window' as const,
  shadow: true,
})`
  padding: 12px;
  background: ${({ theme }) => theme.material};
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const StatLabel = styled.span`
  font-size: 13px;
`

const StatValue = styled.span`
  font-size: 28px;
  font-weight: 700;
`

const SectionFrame = styled(Frame).attrs({
  variant: 'window' as const,
  shadow: true,
})`
  background: ${({ theme }) => theme.material};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`

const Highlight = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  font-size: 11px;
  border: 1px solid ${({ theme }) => theme.borderDark};
  background: ${({ theme }) => theme.canvas};
`

const PriorityTag = styled(Highlight)<{ $priority?: Bug['priority'] }>`
  border-color: ${({ $priority }) =>
    $priority === 'high'
      ? '#b22222'
      : $priority === 'medium'
        ? '#b8860b'
        : '#1f4f8f'};
  background: ${({ $priority }) =>
    $priority === 'high'
      ? '#f5d6d6'
      : $priority === 'medium'
        ? '#f4e5c0'
        : '#d5e1f7'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const InlineActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const SearchField = styled(TextInput)`
  width: 100%;
  max-width: 320px;
`

const TableSection = styled(SectionFrame)`
  padding: 0;
`

const TableHeader = styled.div`
  padding: 12px 12px 0 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ToggleBar = styled.div`
  display: flex;
  gap: 6px;
`

const ToggleButton = styled(Button).attrs({
  size: 'sm' as const,
  variant: 'thin' as const,
})`
  min-width: 120px;
`

const TableInner = styled.div`
  padding: 0 12px 12px 12px;
  overflow-x: auto;
`

const ChartSection = styled(SectionFrame)`
  padding: 12px;
`

const Dashboard: FC<WindowComponentProps> = () => {
  const bugs = useBugStore(s => s.bugs)
  const { openWindow } = useWindowManager()
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState<'active' | 'squashed'>('active')

  const activeBugs = useMemo(
    () =>
      [...bugs].filter(bug => bug.active).sort((a, b) => b.bounty - a.bounty),
    [bugs]
  )
  const squashedBugs = useMemo(() => bugs.filter(bug => !bug.active), [bugs])

  const matchesSearch = useCallback(
    (bug: Bug) => {
      const term = searchTerm.trim().toLowerCase()
      if (!term) return true
      return (
        bug.title.toLowerCase().includes(term) ||
        bug.description.toLowerCase().includes(term)
      )
    },
    [searchTerm]
  )

  const filteredActiveBugs = useMemo(
    () => activeBugs.filter(matchesSearch),
    [activeBugs, matchesSearch]
  )
  const filteredSquashedBugs = useMemo(
    () => squashedBugs.filter(matchesSearch),
    [squashedBugs, matchesSearch]
  )

  const highestBountyBug = useMemo(() => {
    if (!bugs.length) return null
    return bugs.reduce((prev, current) =>
      prev.bounty > current.bounty ? prev : current
    )
  }, [bugs])

  const activeBountyTotal = useMemo(
    () => calculateTotalBounty(activeBugs),
    [activeBugs]
  )
  const squashedBountyTotal = useMemo(
    () => calculateTotalBounty(squashedBugs),
    [squashedBugs]
  )
  const totalBounty = activeBountyTotal + squashedBountyTotal

  const resolutionRate = bugs.length
    ? Math.round((squashedBugs.length / bugs.length) * 1000) / 10
    : 0

  const visibleBugs =
    view === 'active' ? filteredActiveBugs : filteredSquashedBugs

  return (
    <DashboardContainer>
      <Meta
        title="Bug Dashboard - Stats and Progress"
        description="Track bug statistics, bounties and progress on the Bug Basher dashboard."
      />

      <HeaderRow>
        <TitleGroup>
          <Heading>Bug Bounty Dashboard</Heading>
          <Subtitle>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Subtitle>
        </TitleGroup>
        <Button primary onClick={() => openWindow('newBug')}>
          🐛 File a Bug
        </Button>
      </HeaderRow>

      <StatsRow>
        <StatCard>
          <StatLabel>Active Bugs</StatLabel>
          <StatValue>{activeBugs.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Squashed Bugs</StatLabel>
          <StatValue>{squashedBugs.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Bounty</StatLabel>
          <StatValue>${totalBounty}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Resolution Rate</StatLabel>
          <StatValue>{resolutionRate}%</StatValue>
        </StatCard>
      </StatsRow>

      <SectionFrame>
        <SectionTitle>Resolution Progress</SectionTitle>
        <span>
          {squashedBugs.length} of {bugs.length} bugs resolved
        </span>
        <ProgressBar value={resolutionRate} style={{ height: 12 }} />
      </SectionFrame>

      <SectionFrame>
        <SectionTitle>Highest Bounty</SectionTitle>
        {highestBountyBug ? (
          <div>
            <strong>{highestBountyBug.title}</strong> —
            <Highlight style={{ marginLeft: 8 }}>
              ${highestBountyBug.bounty}
            </Highlight>
            <div style={{ marginTop: 8 }}>{highestBountyBug.description}</div>
            {highestBountyBug.priority && (
              <div style={{ marginTop: 8 }}>
                <PriorityTag $priority={highestBountyBug.priority}>
                  {highestBountyBug.priority} priority
                </PriorityTag>
              </div>
            )}
          </div>
        ) : (
          <span>No bugs available.</span>
        )}
      </SectionFrame>

      <ChartSection>
        <SectionTitle>Bug Trends</SectionTitle>
        <BugTrendsChart bugs={bugs} />
      </ChartSection>

      <ChartSection>
        <SectionTitle>Bug Forecast</SectionTitle>
        <BugForecast bugs={bugs} />
      </ChartSection>

      <TableSection>
        <TableHeader>
          <InlineActions>
            <SearchField
              placeholder="Search bugs..."
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
            <ToggleBar>
              <ToggleButton
                active={view === 'active'}
                onClick={() => setView('active')}
              >
                Active Bugs
              </ToggleButton>
              <ToggleButton
                active={view === 'squashed'}
                onClick={() => setView('squashed')}
              >
                Squashed Bugs
              </ToggleButton>
            </ToggleBar>
          </InlineActions>
        </TableHeader>
        <TableInner>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Priority</TableHeadCell>
                <TableHeadCell>Bounty</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleBugs.map(bug => (
                <TableRow key={bug.id}>
                  <TableDataCell>{bug.title}</TableDataCell>
                  <TableDataCell>
                    {bug.priority ? (
                      <PriorityTag $priority={bug.priority}>
                        {bug.priority}
                      </PriorityTag>
                    ) : (
                      '—'
                    )}
                  </TableDataCell>
                  <TableDataCell>${bug.bounty}</TableDataCell>
                  <TableDataCell>
                    {bug.active ? 'Active' : 'Squashed'}
                  </TableDataCell>
                  <TableDataCell>
                    {formatDate(
                      new Date(
                        bug.active
                          ? (bug.createdAt ?? bug.resolvedAt ?? Date.now())
                          : (bug.resolvedAt ?? bug.createdAt ?? Date.now())
                      )
                    )}
                  </TableDataCell>
                </TableRow>
              ))}
              {!visibleBugs.length && (
                <TableRow>
                  <TableDataCell colSpan={5}>
                    No bugs match the current filter.
                  </TableDataCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableInner>
      </TableSection>
    </DashboardContainer>
  )
}

export default memo(Dashboard)
