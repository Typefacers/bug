import type { ForecastDay } from '../types/weather'

const today = new Date()
const addDays = (n: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export const forecast: ForecastDay[] = [
  { date: addDays(0), condition: 'sunny', high: 26, low: 15 },
  { date: addDays(1), condition: 'cloudy', high: 24, low: 14 },
  { date: addDays(2), condition: 'rainy', high: 22, low: 12 },
  { date: addDays(3), condition: 'sunny', high: 27, low: 16 },
  { date: addDays(4), condition: 'snow', high: 10, low: 2 },
]
