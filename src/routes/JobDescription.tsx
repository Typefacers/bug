import { memo, type FC } from 'react'
import { styled } from 'styled-components'
import Meta from '../components/Meta'
import type { WindowComponentProps } from '../types/window'

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`

const JobDescription: FC<WindowComponentProps> = () => {
  return (
    <>
      <Meta
        title="Job Description"
        description="Learn about the prestigious Bug Basher position."
      />
      <DescriptionContainer>
        <Title>Bug Basher Role</Title>
        <p>
          We're looking for fearless developers to squash imaginary bugs in our
          retro-inspired arena. Duties include clicking frantically, sipping
          copious coffee, and laughing at our codebase.
        </p>
        <p>
          Benefits include bragging rights, unlimited virtual PTO, and the
          occasional congratulatory meme.
        </p>
      </DescriptionContainer>
    </>
  )
}

export default memo(JobDescription)
