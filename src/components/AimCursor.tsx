import React from 'react'
import { styled } from 'styled-components'
import type { AimCursorProps } from '../types/aim-cursor-props'

const CursorWrapper = styled.div`
  position: absolute;
  z-index: 100;
  pointer-events: none;
`

const CursorCircle = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid #cc0000;
`

const CursorLineVertical = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: #cc0000;
  transform: translateX(-0.5px);
`

const CursorLineHorizontal = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: #cc0000;
  transform: translateY(-0.5px);
`

/** A simple red cross-hair that never intercepts pointer events. */
const AimCursor: React.FC<AimCursorProps> = ({ x, y }) => {
  const size = 24
  const half = size / 2

  return (
    <CursorWrapper
      style={{ left: x - half, top: y - half, width: size, height: size }}
    >
      <CursorCircle />
      <CursorLineVertical />
      <CursorLineHorizontal />
    </CursorWrapper>
  )
}

export default AimCursor
