import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { useBugStore } from '../store'
import Meta from '../components/Meta'
import Input from '../components/win95/Input'
import Win95Button from '../components/win95/Button'
import { levelFromBounty, sortUsers, type SortKey } from './leaderboard-helpers'

function Leaderboard() {
  const users = useBugStore(s => s.users)

  /** Local sort state */
  const [sortKey, setSortKey] = React.useState<SortKey>('bounty')
  const [ascending, setAscending] = React.useState(false)
  const [query, setQuery] = React.useState('')

  /** Toggle / change sort */
  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setAscending(!ascending)
    } else {
      setSortKey(key)
      // Default direction: name asc, everything else desc
      setAscending(key === 'name')
    }
  }

  /** Users filtered by search query */
  const filteredUsers = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(u => u.name.toLowerCase().includes(q))
  }, [users, query])

  /** Users sorted according to selected column */
  const sortedUsers = React.useMemo(
    () => sortUsers(filteredUsers, sortKey, ascending),
    [filteredUsers, sortKey, ascending]
  )

  /** Helper to render sort arrows */
  const sortArrow = (key: SortKey) =>
    sortKey === key ? (ascending ? '▲' : '▼') : ''

  return (
    <>
      <Meta
        title="Bug Bounty Leaderboard"
        description="Check the rankings of top bug squashers and their bounties."
      />
      <div className="overflow-x-auto">
        <div className="mb-2 max-w-xs">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <Input
            id="search"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            placeholder="Search hunters"
            className="bg-white border px-2 py-1 text-sm"
          />
        </div>
        <table className="w-full text-sm select-none bg-[#E0E0E0]">
          <caption className="sr-only">Bug bounty rankings</caption>
          <thead>
            <tr className="bg-[#000080] text-white">
              <th className="py-2 px-3 text-left font-semibold w-16 whitespace-nowrap">
                <Win95Button
                  type="button"
                  onClick={() => handleSort('rank')}
                  className="w-full text-left"
                >
                  #<span className="ml-1">{sortArrow('rank')}</span>
                </Win95Button>
              </th>
              <th className="py-2 px-3 text-left font-semibold">
                <Win95Button
                  type="button"
                  onClick={() => handleSort('name')}
                  className="w-full text-left"
                >
                  Hunter <span className="ml-1">{sortArrow('name')}</span>
                </Win95Button>
              </th>
              <th className="py-2 px-3 text-right font-semibold w-24">
                <Win95Button
                  type="button"
                  onClick={() => handleSort('bugs')}
                  className="w-full text-right"
                >
                  Bugs <span className="ml-1">{sortArrow('bugs')}</span>
                </Win95Button>
              </th>
              <th className="py-2 px-3 text-right font-semibold w-28">
                <Win95Button
                  type="button"
                  onClick={() => handleSort('bounty')}
                  className="w-full text-right"
                >
                  Bounty <span className="ml-1">{sortArrow('bounty')}</span>
                </Win95Button>
              </th>
              <th className="py-2 px-3 text-right font-semibold w-32">
                <Win95Button
                  type="button"
                  onClick={() => handleSort('efficiency')}
                  className="w-full text-right"
                >
                  Efficiency{' '}
                  <span className="ml-1">{sortArrow('efficiency')}</span>
                </Win95Button>
              </th>
              <th className="py-2 px-3 text-center font-semibold w-28">
                <Win95Button
                  type="button"
                  onClick={() => handleSort('level')}
                  className="w-full text-center"
                >
                  Level <span className="ml-1">{sortArrow('level')}</span>
                </Win95Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((u, i) => {
              const bugCount =
                (Array.isArray(u.bugs) ? u.bugs.length : u.bugs) ?? 0
              const bounty = u.bounty ?? 0
              const efficiency =
                bugCount > 0 ? (bounty / bugCount).toFixed(1) : '—'
              const level = levelFromBounty(bounty)

              return (
                <tr
                  key={u.id}
                  className={`${
                    i % 2 ? 'bg-[#D4D0C8]' : 'bg-[#E0E0E0]'
                  } hover:bg-[#C0C0C0]`}
                >
                  <td className="py-1 px-3 font-bold">{i + 1}</td>
                  <td className="py-1 px-3 flex items-center gap-2">
                    {u.avatar && (
                      <img
                        src={u.avatar}
                        alt={`${u.name} avatar`}
                        className="w-6 h-6 border border-gray-700"
                      />
                    )}
                    <Link
                      to={`/user/${u.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {u.name}
                    </Link>
                  </td>
                  <td className="py-1 px-3 text-right tabular-nums">
                    {bugCount}
                  </td>
                  <td className="py-1 px-3 text-right tabular-nums">
                    {bounty.toLocaleString()}
                  </td>
                  <td className="py-1 px-3 text-right tabular-nums">
                    {efficiency}
                  </td>
                  <td className="py-1 px-3 text-center">{level}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default memo(Leaderboard)
