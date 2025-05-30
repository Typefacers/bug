export interface ForecastDay {
  date: string
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snow'
  high: number
  low: number
}
