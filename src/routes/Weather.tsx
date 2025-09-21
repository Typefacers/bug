import { memo, useMemo, type FC } from 'react'
import { styled } from 'styled-components'
import { Frame } from 'react95'
import Meta from '../components/Meta'
import { forecast } from '../mock/weather'
import type { ForecastDay } from '../types/weather'
import type { WindowComponentProps } from '../types/window'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`

const CardsGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`

const WeatherCard = styled(Frame).attrs({
  variant: 'window' as const,
  shadow: true,
})`
  background: ${({ theme }) => theme.material};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
`

const CardBody = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
`

const iconFor = (condition: ForecastDay['condition']) => {
  switch (condition) {
    case 'sunny':
      return '☀️'
    case 'cloudy':
      return '☁️'
    case 'rainy':
      return '🌧️'
    case 'snow':
      return '❄️'
    default:
      return '🌤️'
  }
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))

const Weather: FC<WindowComponentProps> = () => {
  const cards = useMemo(() => forecast, [])

  return (
    <>
      <Meta
        title="Weather Forecast"
        description="Check the upcoming weather for your next bug hunt."
      />
      <Container>
        <Title>Weather Forecast</Title>
        <CardsGrid>
          {cards.map(day => (
            <WeatherCard key={day.date}>
              <CardHeader>
                <span aria-hidden>{iconFor(day.condition)}</span>
                {formatDate(day.date)}
              </CardHeader>
              <CardBody>
                <span>High: {day.high}°C</span>
                <span>Low: {day.low}°C</span>
              </CardBody>
            </WeatherCard>
          ))}
        </CardsGrid>
      </Container>
    </>
  )
}

export default memo(Weather)
