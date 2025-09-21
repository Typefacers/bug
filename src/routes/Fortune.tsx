import { memo, type FC } from 'react'
import { styled } from 'styled-components'
import Meta from '../components/Meta'
import FortuneCookie from '../components/FortuneCookie'
import type { WindowComponentProps } from '../types/window'

const FortuneContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`

const Fortune: FC<WindowComponentProps> = () => {
  return (
    <>
      <Meta
        title="Fortune Cookie"
        description="Get a random bug-themed fortune."
      />
      <FortuneContainer>
        <Title>Fortune Cookie</Title>
        <FortuneCookie />
      </FortuneContainer>
    </>
  )
}

export default memo(Fortune)
