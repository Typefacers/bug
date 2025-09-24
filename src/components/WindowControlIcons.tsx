import type { SVGProps } from 'react'

const HIGHLIGHT = '#FFFFFF'
const SHADOW = '#808080'
const FACE = '#C0C0C0'
const OUTLINE = '#000000'
const ACCENT_DARK = '#000080'
const ACCENT_LIGHT = '#1084d9'
const svgBaseProps = {
  viewBox: '0 0 16 16',
  width: 16,
  height: 16,
  'aria-hidden': true,
  focusable: 'false',
  shapeRendering: 'crispEdges' as const,
} satisfies SVGProps<SVGSVGElement>

type IconProps = SVGProps<SVGSVGElement>

export function Win95MinimizeIcon({ className, ...props }: IconProps) {
  return (
    <svg {...svgBaseProps} className={className} {...props}>
      <rect x="3" y="10" width="10" height="3" fill={FACE} />
      <rect x="3" y="10" width="10" height="1" fill={HIGHLIGHT} />
      <rect x="3" y="11" width="10" height="1" fill={OUTLINE} />
      <rect x="3" y="12" width="10" height="1" fill={SHADOW} />
      <rect x="2" y="11" width="1" height="1" fill={HIGHLIGHT} />
      <rect x="2" y="12" width="1" height="1" fill={HIGHLIGHT} />
      <rect x="13" y="11" width="1" height="1" fill={OUTLINE} />
      <rect x="13" y="12" width="1" height="1" fill={SHADOW} />
    </svg>
  )
}

export function Win95MaximizeIcon({ className, ...props }: IconProps) {
  return (
    <svg {...svgBaseProps} className={className} {...props}>
      <rect x="3" y="3" width="10" height="1" fill={OUTLINE} />
      <rect x="3" y="3" width="1" height="8" fill={OUTLINE} />
      <rect x="12" y="3" width="1" height="8" fill={OUTLINE} />
      <rect x="3" y="10" width="10" height="1" fill={OUTLINE} />

      <rect x="4" y="4" width="8" height="1" fill={HIGHLIGHT} />
      <rect x="4" y="4" width="1" height="6" fill={HIGHLIGHT} />
      <rect x="11" y="4" width="1" height="6" fill={SHADOW} />
      <rect x="4" y="9" width="8" height="1" fill={SHADOW} />

      <rect x="5" y="5" width="6" height="4" fill={FACE} />
      <rect x="5" y="5" width="6" height="1" fill={ACCENT_LIGHT} />
      <rect x="5" y="6" width="6" height="1" fill={ACCENT_DARK} />
      <rect x="5" y="7" width="6" height="2" fill={FACE} />
    </svg>
  )
}

export function Win95RestoreIcon({ className, ...props }: IconProps) {
  return (
    <svg {...svgBaseProps} className={className} {...props}>
      <rect x="4" y="4" width="8" height="1" fill={OUTLINE} />
      <rect x="4" y="4" width="1" height="6" fill={OUTLINE} />
      <rect x="11" y="4" width="1" height="6" fill={OUTLINE} />
      <rect x="4" y="9" width="8" height="1" fill={OUTLINE} />

      <rect x="5" y="5" width="6" height="1" fill={HIGHLIGHT} />
      <rect x="5" y="5" width="1" height="4" fill={HIGHLIGHT} />
      <rect x="10" y="5" width="1" height="4" fill={SHADOW} />
      <rect x="5" y="8" width="6" height="1" fill={SHADOW} />
      <rect x="5" y="6" width="6" height="2" fill={FACE} />

      <rect x="6" y="6" width="4" height="1" fill={ACCENT_LIGHT} />
      <rect x="6" y="7" width="4" height="1" fill={ACCENT_DARK} />

      <rect x="6" y="6" width="8" height="1" fill={OUTLINE} />
      <rect x="6" y="6" width="1" height="7" fill={OUTLINE} />
      <rect x="13" y="6" width="1" height="7" fill={OUTLINE} />
      <rect x="6" y="12" width="8" height="1" fill={OUTLINE} />

      <rect x="7" y="7" width="6" height="1" fill={HIGHLIGHT} />
      <rect x="7" y="7" width="1" height="5" fill={HIGHLIGHT} />
      <rect x="12" y="7" width="1" height="5" fill={SHADOW} />
      <rect x="7" y="11" width="6" height="1" fill={SHADOW} />
      <rect x="7" y="8" width="6" height="3" fill={FACE} />

      <rect x="8" y="8" width="4" height="1" fill={ACCENT_LIGHT} />
      <rect x="8" y="9" width="4" height="1" fill={ACCENT_DARK} />
    </svg>
  )
}

export function Win95CloseIcon({ className, ...props }: IconProps) {
  return (
    <svg {...svgBaseProps} className={className} {...props}>
      {[5, 6, 7, 8, 9, 10, 11].map((offset, index) => (
        <rect
          key={`outline-main-${index}`}
          x={offset}
          y={offset}
          width="1"
          height="1"
          fill={OUTLINE}
        />
      ))}
      {[5, 6, 7, 8, 9, 10, 11].map((offset, index) => (
        <rect
          key={`outline-cross-${index}`}
          x={offset}
          y={16 - offset}
          width="1"
          height="1"
          fill={OUTLINE}
        />
      ))}
      {[6, 7, 8, 9, 10, 11].map((offset, index) => (
        <rect
          key={`highlight-main-${index}`}
          x={offset}
          y={offset - 1}
          width="1"
          height="1"
          fill={HIGHLIGHT}
        />
      ))}
      {[5, 6, 7, 8, 9, 10].map((offset, index) => (
        <rect
          key={`highlight-cross-${index}`}
          x={offset}
          y={offset + 1}
          width="1"
          height="1"
          fill={HIGHLIGHT}
        />
      ))}
      {[6, 7, 8, 9, 10, 11].map((offset, index) => (
        <rect
          key={`shadow-main-${index}`}
          x={offset}
          y={offset + 1}
          width="1"
          height="1"
          fill={SHADOW}
        />
      ))}
      {[5, 6, 7, 8, 9, 10].map((offset, index) => (
        <rect
          key={`shadow-cross-${index}`}
          x={offset}
          y={offset - 1}
          width="1"
          height="1"
          fill={SHADOW}
        />
      ))}
    </svg>
  )
}
