export interface ForecastPoint {
  date: Date
  count: number
}

import type { Bug } from '../types/bug'

export const forecastBugCounts = (bugs: Bug[], days = 7): ForecastPoint[] => {
  const floor = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const counts = new Map<number, number>()

  for (const bug of bugs) {
    if (!bug.createdAt) continue
    const ts = floor(new Date(bug.createdAt)).getTime()
    counts.set(ts, (counts.get(ts) || 0) + 1)
  }

  const dates = Array.from(counts.keys()).sort((a, b) => a - b)
  const daily = dates.map(d => counts.get(d) ?? 0)
  if (daily.length === 0) return []

  const n = daily.length
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0
  for (let i = 0; i < n; i++) {
    const x = i
    const y = daily[i]
    sumX += x
    sumY += y
    sumXY += x * y
    sumX2 += x * x
  }
  const denom = n * sumX2 - sumX * sumX
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0
  const intercept = n !== 0 ? (sumY - slope * sumX) / n : 0

  const lastDate = new Date(dates[dates.length - 1])
  const results: ForecastPoint[] = []

  for (let i = 1; i <= days; i++) {
    const x = n - 1 + i
    const count = Math.max(0, Math.round(slope * x + intercept))
    const d = floor(new Date(lastDate))
    d.setDate(d.getDate() + i)
    results.push({ date: d, count })
  }

  return results
}
