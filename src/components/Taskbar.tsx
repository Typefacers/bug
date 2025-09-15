import { useEffect, useMemo, useState } from 'react'
import { raised, sunken } from '../utils/win95'
import StartMenu from './StartMenu'
import Win95Button from './win95/Button'
import { useWindowManager } from '../contexts/WindowManagerContext'

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

function SpeakerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 fill-black"
      aria-hidden
      focusable="false"
    >
      <path d="M2.75 6H5.5L8.5 3.5v9L5.5 10H2.75z" />
      <path
        d="M11.75 5.25c1.75 1.75 1.75 4.75 0 6.5"
        fill="none"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M13.75 3.25c2.5 2.5 2.5 7 0 9.5"
        fill="none"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  )
}

function NetworkIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 fill-black"
      aria-hidden
      focusable="false"
    >
      <path d="M2 12h3v2H2zM6.5 9h3v5h-3zM11 6h3v8h-3z" />
      <path
        d="M2 7.5 8 3.5l6 4"
        fill="none"
        stroke="black"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Taskbar() {
  const { windows, activeWindowId, toggleMinimize, focusWindow, apps } =
    useWindowManager()
  const [time, setTime] = useState(getTime())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [])

  const orderedWindows = useMemo(
    () => [...windows].sort((a, b) => a.zIndex - b.zIndex),
    [windows]
  )

  return (
    <footer className="relative select-none text-[13px] text-black">
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
      <div className="h-[2px] w-full bg-white" />
      <div className="h-[2px] w-full bg-[#808080]" />
      <div className="relative z-10 flex h-12 items-center gap-3 border-2 border-b-[#404040] border-l-white border-r-[#404040] border-t-white bg-[#BDBDBD] px-2 font-['MS_Sans_Serif','Tahoma',sans-serif]">
        <div className="relative">
          <Win95Button
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen(value => !value)}
            className={`h-9 gap-3 px-4 py-[3px] text-[13px] font-semibold leading-none tracking-tight text-black ${
              open ? sunken : ''
            } justify-start`}
          >
            <span className="grid h-4 w-4 grid-cols-2 grid-rows-2 gap-[1px]">
              <span className="bg-[#01017A]" />
              <span className="bg-[#D80000]" />
              <span className="bg-[#008001]" />
              <span className="bg-[#F4F100]" />
            </span>
            <span className="[text-shadow:1px_1px_0_#FFFFFF]">Start</span>
          </Win95Button>
          {open && <StartMenu onClose={() => setOpen(false)} />}
        </div>

        <div className="flex h-9 flex-1 items-stretch gap-2">
          <div className="flex h-full flex-col justify-center">
            <div className="h-full w-[1px] bg-white" />
            <div className="h-full w-[1px] bg-[#808080]" />
          </div>

          <div
            className={`flex flex-1 items-center gap-1 overflow-x-auto px-1 ${sunken} bg-[#BDBDBD]`}
          >
            {orderedWindows.map(window => {
              const definition = apps[window.appId]
              const isActive = activeWindowId === window.id && !window.minimized

              return (
                <Win95Button
                  key={window.id}
                  title={window.title}
                  onClick={() => {
                    if (window.minimized || isActive) {
                      toggleMinimize(window.id)
                    } else {
                      focusWindow(window.id)
                    }
                  }}
                  className={`h-7 min-w-[7rem] justify-start gap-2 truncate px-3 py-[2px] text-left text-[13px] font-normal ${
                    isActive ? sunken : ''
                  }`}
                >
                  <span aria-hidden className="text-base">
                    {definition?.icon ?? '🪟'}
                  </span>
                  <span className="truncate">{window.title}</span>
                </Win95Button>
              )
            })}
          </div>

          <div className="flex h-full flex-col justify-center">
            <div className="h-full w-[1px] bg-white" />
            <div className="h-full w-[1px] bg-[#808080]" />
          </div>

          <div
            className={`flex items-center gap-3 ${sunken} h-9 px-3 pr-4 text-[12px]`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center bg-[#C0C0C0] ${raised}`}
                role="img"
                aria-label="Volume"
              >
                <SpeakerIcon />
              </div>
              <div
                className={`flex h-6 w-6 items-center justify-center bg-[#C0C0C0] ${raised}`}
                role="img"
                aria-label="Network"
              >
                <NetworkIcon />
              </div>
            </div>

            <div className="flex h-6 flex-col justify-between">
              <div className="h-[1px] w-full bg-[#808080]" />
              <div className="h-[1px] w-full bg-white" />
            </div>

            <div
              className={`flex h-6 items-center justify-center px-3 font-mono text-sm leading-none bg-[#C0C0C0] ${raised}`}
            >
              {time}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
