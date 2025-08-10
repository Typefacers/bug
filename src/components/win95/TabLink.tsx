import { Link } from 'react-router-dom'

import { ReactNode } from 'react'

type Props = {
  to: string
  active: boolean
  children: ReactNode
}

export default function TabLink({ to, active, children }: Props) {
  return (
    <Link
      to={to}
      className={`px-4 py-1 ${active ? 'bg-[#E0E0E0] font-semibold' : 'hover:bg-[#D0D0D0]'}`}
    >
      {children}
    </Link>
  )
}
