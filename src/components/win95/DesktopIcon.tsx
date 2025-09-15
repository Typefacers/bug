import { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  label: string
  selected: boolean
  onSelect: () => void
  onOpen: () => void
}

export default function DesktopIcon({
  icon,
  label,
  selected,
  onSelect,
  onOpen,
}: Props) {
  return (
    <button
      type="button"
      className={`w-24 rounded-sm border border-transparent bg-transparent p-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
        selected ? 'bg-[rgba(0,0,128,0.35)] border-white' : ''
      }`}
      onClick={event => {
        event.stopPropagation()
        onSelect()
      }}
      onDoubleClick={event => {
        event.stopPropagation()
        onOpen()
      }}
      onFocus={onSelect}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <div
        className="text-4xl"
        style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.7)' }}
        aria-hidden
      >
        {icon}
      </div>
      <div className="mt-2 flex justify-center">
        <span
          className={`px-1 py-0.5 text-center text-xs leading-tight ${
            selected
              ? 'border border-[#C0C0C0] bg-[#000080] text-white'
              : 'border border-transparent text-white'
          }`}
          style={
            selected
              ? undefined
              : {
                  textShadow: '1px 1px 0 rgba(0,0,0,0.65)',
                  color: 'rgba(255,255,255,0.9)',
                }
          }
        >
          {label}
        </span>
      </div>
    </button>
  )
}
