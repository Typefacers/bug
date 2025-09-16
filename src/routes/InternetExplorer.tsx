import { memo, useEffect, useState, type FC } from 'react'
import { Button, Frame, TextInput } from 'react95'
import Meta from '../components/Meta'
import type { WindowComponentProps } from '../types/window'

const HOMEPAGE_URL = 'https://techmap.dev/'
const MENU_ITEMS = [
  'File',
  'Edit',
  'View',
  'Favorites',
  'Tools',
  'Help',
] as const

type LoadStatus = 'loading' | 'loaded' | 'timeout'

const InternetExplorer: FC<WindowComponentProps> = ({ setTitle }) => {
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (setTitle) {
      setTitle('Internet Explorer - techmap.dev')
    }
  }, [setTitle])

  useEffect(() => {
    if (typeof window === 'undefined' || status !== 'loading') {
      return undefined
    }

    const timeout = window.setTimeout(() => {
      setStatus(prev => (prev === 'loading' ? 'timeout' : prev))
    }, 6000)

    return () => window.clearTimeout(timeout)
  }, [status])

  const handleReload = () => {
    setStatus('loading')
    setReloadKey(key => key + 1)
  }

  const handleOpenExternal = () => {
    if (typeof window !== 'undefined') {
      window.open(HOMEPAGE_URL, '_blank', 'noopener,noreferrer')
    }
  }

  const statusLabel =
    status === 'loaded'
      ? 'Done'
      : status === 'timeout'
        ? 'Navigation canceled'
        : 'Opening https://techmap.dev/...'

  return (
    <>
      <Meta
        title="Internet Explorer"
        description="Browse techmap.dev inside our retro Windows 95 Internet Explorer shell."
      />
      <div className="flex h-full flex-col overflow-hidden bg-[#C0C0C0] text-black">
        <div className="border-b border-[#808080] bg-[#C0C0C0] px-2 py-2 text-[13px]">
          <div className="mb-2 flex items-center gap-3">
            {MENU_ITEMS.map(item => (
              <span key={item} className="cursor-default select-none">
                {item}
              </span>
            ))}
          </div>
          <div className="mb-2 flex items-center gap-2">
            <Button size="sm" disabled>
              ◀
            </Button>
            <Button size="sm" disabled>
              ▶
            </Button>
            <Button size="sm" onClick={handleReload}>
              Refresh
            </Button>
            <Button size="sm" onClick={handleOpenExternal}>
              Home
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-[#000080]">
              Address
            </span>
            <Frame
              variant="well"
              className="flex flex-1 items-center bg-white px-2 py-1"
            >
              <TextInput value={HOMEPAGE_URL} readOnly fullWidth />
            </Frame>
            <Button size="sm" onClick={handleOpenExternal}>
              Go
            </Button>
          </div>
        </div>
        <div className="relative flex-1 bg-white">
          <iframe
            key={reloadKey}
            src={HOMEPAGE_URL}
            title="techmap.dev"
            className="h-full w-full border-0"
            onLoad={() => setStatus('loaded')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; geolocation; gyroscope; picture-in-picture"
          />
          {status !== 'loaded' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/95 p-4 text-center text-sm">
              <div className="font-semibold text-[#000080]">
                Connecting to techmap.dev...
              </div>
              {status === 'timeout' ? (
                <>
                  <p className="max-w-xs text-xs text-[#404040]">
                    Some modern sites block embedding inside classic browsers.
                    Use the Go button to launch techmap.dev in a new window.
                  </p>
                  <Button size="sm" onClick={handleOpenExternal}>
                    Open in new window
                  </Button>
                </>
              ) : (
                <p className="max-w-xs text-xs text-[#404040]">
                  Spinning up a 90s-era modem...
                </p>
              )}
            </div>
          )}
        </div>
        <Frame
          variant="well"
          className="flex items-center justify-between bg-[#E0E0E0] px-2 py-1 text-xs"
        >
          <span>{statusLabel}</span>
          <span>Internet</span>
        </Frame>
      </div>
    </>
  )
}

export default memo(InternetExplorer)
