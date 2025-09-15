import clsx from 'clsx'
import type { SVGProps } from 'react'

const HIGHLIGHT = '#FFFFFF'
const SHADOW = '#808080'
const FACE = '#C0C0C0'
const OUTLINE = '#000000'

type IconProps = SVGProps<SVGSVGElement>

export function Win95MinimizeIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      className={clsx('h-3 w-3', className)}
      {...props}
    >
      <rect x="2" y="7" width="8" height="1" fill={OUTLINE} />
      <rect x="2" y="8" width="8" height="1" fill={SHADOW} />
    </svg>
  )
}

export function Win95MaximizeIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      className={clsx('h-3 w-3', className)}
      {...props}
    >
      <rect x="2" y="2" width="8" height="6" fill={FACE} />
      <path d="M2.5 2.5H9.5" stroke={HIGHLIGHT} strokeWidth="1" />
      <path d="M2.5 2.5V7.5" stroke={HIGHLIGHT} strokeWidth="1" />
      <path d="M2.5 7.5H9.5" stroke={OUTLINE} strokeWidth="1" />
      <path d="M9.5 2.5V7.5" stroke={OUTLINE} strokeWidth="1" />
      <rect x="3" y="3" width="6" height="4" fill={HIGHLIGHT} />
      <path d="M3.5 3.5H8.5" stroke={OUTLINE} strokeWidth="1" />
      <path d="M3.5 3.5V6.5" stroke={OUTLINE} strokeWidth="1" />
      <path d="M3.5 6.5H8.5" stroke={SHADOW} strokeWidth="1" />
      <path d="M8.5 3.5V6.5" stroke={SHADOW} strokeWidth="1" />
    </svg>
  )
}

export function Win95CloseIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      className={clsx('h-3 w-3', className)}
      {...props}
    >
      <path
        d="M3.5 3.5L8.5 8.5"
        stroke={OUTLINE}
        strokeWidth="1"
        strokeLinecap="square"
      />
      <path
        d="M3.5 8.5L8.5 3.5"
        stroke={OUTLINE}
        strokeWidth="1"
        strokeLinecap="square"
      />
      <path
        d="M4.5 3.5L8.5 7.5"
        stroke={HIGHLIGHT}
        strokeWidth="1"
        strokeLinecap="square"
      />
      <path
        d="M3.5 4.5L7.5 8.5"
        stroke={HIGHLIGHT}
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  )
}
