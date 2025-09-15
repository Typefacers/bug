import Meta from '../components/Meta'
import { forecast } from '../mock/weather'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { SunIcon, CloudIcon, CloudRainIcon, SnowflakeIcon } from 'lucide-react'
import type { ForecastDay } from '../types/weather'
import { memo, type FC } from 'react'
import type { WindowComponentProps } from '../types/window'

const iconFor = (condition: ForecastDay['condition']) => {
  switch (condition) {
    case 'sunny':
      return <SunIcon className="h-5 w-5 text-amber-500" />
    case 'cloudy':
      return <CloudIcon className="h-5 w-5 text-gray-500" />
    case 'rainy':
      return <CloudRainIcon className="h-5 w-5 text-blue-500" />
    case 'snow':
      return <SnowflakeIcon className="h-5 w-5 text-indigo-400" />
  }
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))

const Weather: FC<WindowComponentProps> = () => {
  return (
    <>
      <Meta
        title="Weather Forecast"
        description="Check the upcoming weather for your next bug hunt."
      />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Weather Forecast</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forecast.map(day => (
            <Card key={day.date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {iconFor(day.condition)}
                  {formatDate(day.date)}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between text-sm">
                <span>High: {day.high}°C</span>
                <span>Low: {day.low}°C</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

export default memo(Weather)
