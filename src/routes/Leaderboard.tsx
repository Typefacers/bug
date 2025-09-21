import { useMemo, useState, memo, type FC } from 'react'
import { styled } from 'styled-components'
import {
  Button,
  Frame,
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from 'react95'
import { useBugStore } from '../store'
import Meta from '../components/Meta'
import { levelFromBounty, sortUsers, type SortKey } from './leaderboard-helpers'
import { useWindowManager } from '../contexts/WindowManagerContext'
import type { WindowComponentProps } from '../types/window'

const LeaderboardFrame = styled(Frame).attrs({
  variant: 'window' as const,
  shadow: true,
})`
  background: ${({ theme }) => theme.material};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`

const SearchField = styled(TextInput)`
  width: 100%;
  max-width: 260px;
`

const TableScroll = styled.div`
  overflow-x: auto;
`

type HeaderButtonProps = { $align?: 'start' | 'center' | 'end' }

const headerJustify = ({ $align }: HeaderButtonProps) =>
  $align === 'center' ? 'center' : $align === 'end' ? 'flex-end' : 'flex-start'

const HeaderButton = styled(Button)<HeaderButtonProps>`
  width: 100%;
  display: inline-flex;
  justify-content: ${headerJustify};
  align-items: center;
  gap: 6px;
`

const BodyRow = styled(TableRow)`
  &:nth-of-type(even) {
    background: ${({ theme }) => theme.flatLight};
  }
  &:nth-of-type(odd) {
    background: ${({ theme }) => theme.material};
  }
`

const NameLink = styled.button`
  background: none;
  border: none;
  color: #000080;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  font-size: 13px;

  &:focus-visible {
    outline: 1px dotted #000;
    outline-offset: 2px;
  }
`

const AvatarImage = styled.img`
  width: 24px;
  height: 24px;
  border: 1px solid ${({ theme }) => theme.borderDark};
`

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Leaderboard: FC<WindowComponentProps> = () => {
  const users = useBugStore(s => s.users)
  const { openWindow } = useWindowManager()

  const [sortKey, setSortKey] = useState<SortKey>('bounty')
  const [ascending, setAscending] = useState(false)
  const [query, setQuery] = useState('')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setAscending(prev => !prev)
    } else {
      setSortKey(key)
      setAscending(key === 'name')
    }
  }

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(user => user.name.toLowerCase().includes(q))
  }, [users, query])

  const sortedUsers = useMemo(
    () => sortUsers(filteredUsers, sortKey, ascending),
    [filteredUsers, sortKey, ascending]
  )

  const sortArrow = (key: SortKey) =>
    sortKey === key ? (ascending ? '▲' : '▼') : ''

  return (
    <>
      <Meta
        title="Bug Bounty Leaderboard"
        description="Check the rankings of top bug squashers and their bounties."
      />
      <LeaderboardFrame>
        <HeaderActions>
          <h2 style={{ margin: 0 }}>Top Bug Hunters</h2>
          <SearchField
            id="search"
            placeholder="Search hunters"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </HeaderActions>

        <TableScroll>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell style={{ width: '64px' }}>
                  <HeaderButton
                    size="sm"
                    variant="thin"
                    onClick={() => handleSort('rank')}
                  >
                    # {sortArrow('rank')}
                  </HeaderButton>
                </TableHeadCell>
                <TableHeadCell>
                  <HeaderButton
                    size="sm"
                    variant="thin"
                    onClick={() => handleSort('name')}
                  >
                    Hunter {sortArrow('name')}
                  </HeaderButton>
                </TableHeadCell>
                <TableHeadCell style={{ width: '96px', textAlign: 'right' }}>
                  <HeaderButton
                    size="sm"
                    variant="thin"
                    $align="end"
                    onClick={() => handleSort('bugs')}
                  >
                    Bugs {sortArrow('bugs')}
                  </HeaderButton>
                </TableHeadCell>
                <TableHeadCell style={{ width: '120px', textAlign: 'right' }}>
                  <HeaderButton
                    size="sm"
                    variant="thin"
                    $align="end"
                    onClick={() => handleSort('bounty')}
                  >
                    Bounty {sortArrow('bounty')}
                  </HeaderButton>
                </TableHeadCell>
                <TableHeadCell style={{ width: '140px', textAlign: 'right' }}>
                  <HeaderButton
                    size="sm"
                    variant="thin"
                    $align="end"
                    onClick={() => handleSort('efficiency')}
                  >
                    Efficiency {sortArrow('efficiency')}
                  </HeaderButton>
                </TableHeadCell>
                <TableHeadCell style={{ width: '120px', textAlign: 'center' }}>
                  <HeaderButton
                    size="sm"
                    variant="thin"
                    $align="center"
                    onClick={() => handleSort('level')}
                  >
                    Level {sortArrow('level')}
                  </HeaderButton>
                </TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers.map((user, index) => {
                const bugCount =
                  (Array.isArray(user.bugs) ? user.bugs.length : user.bugs) ?? 0
                const bounty = user.bounty ?? 0
                const efficiency =
                  bugCount > 0 ? (bounty / bugCount).toFixed(1) : '—'
                const level = levelFromBounty(bounty)

                return (
                  <BodyRow key={user.id}>
                    <TableDataCell>{index + 1}</TableDataCell>
                    <TableDataCell>
                      <NameCell>
                        {user.avatar && (
                          <AvatarImage
                            src={user.avatar}
                            alt={`${user.name} avatar`}
                          />
                        )}
                        <NameLink
                          type="button"
                          onClick={() =>
                            openWindow('userProfile', {
                              instanceId: `user-${user.id}`,
                              context: { userId: user.id },
                            })
                          }
                        >
                          {user.name}
                        </NameLink>
                      </NameCell>
                    </TableDataCell>
                    <TableDataCell
                      style={{
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {bugCount}
                    </TableDataCell>
                    <TableDataCell
                      style={{
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {bounty.toLocaleString()}
                    </TableDataCell>
                    <TableDataCell
                      style={{
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {efficiency}
                    </TableDataCell>
                    <TableDataCell style={{ textAlign: 'center' }}>
                      {level}
                    </TableDataCell>
                  </BodyRow>
                )
              })}
              {!sortedUsers.length && (
                <TableRow>
                  <TableDataCell colSpan={6}>
                    No hunters match the current search.
                  </TableDataCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableScroll>
      </LeaderboardFrame>
    </>
  )
}

export default memo(Leaderboard)
