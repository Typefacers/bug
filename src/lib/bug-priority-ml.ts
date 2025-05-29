import type { Bug } from '../types/bug.ts'

export interface PriorityModel {
  weight: number
  bias: number
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))

export const trainPriorityModel = (
  bugs: Bug[],
  iterations = 3000,
  learningRate = 0.1
): PriorityModel => {
  let weight = 0
  let bias = 0
  // Normalize bounty to keep gradients reasonable
  const xs = bugs.map(b => b.bounty / 200)
  const ys = bugs.map(b => (b.priority === 'high' ? 1 : 0))

  for (let i = 0; i < iterations; i++) {
    let dw = 0
    let db = 0
    for (let j = 0; j < xs.length; j++) {
      const x = xs[j]
      const y = ys[j]
      const pred = sigmoid(weight * x + bias)
      dw += (pred - y) * x
      db += pred - y
    }
    weight -= (learningRate / xs.length) * dw
    bias -= (learningRate / xs.length) * db
  }
  return { weight, bias }
}

export const predictPriorityProbability = (
  bounty: number,
  model: PriorityModel
): number => {
  return sigmoid(model.weight * (bounty / 200) + model.bias)
}

export const predictPriority = (
  bug: Bug,
  model: PriorityModel
): 'high' | 'medium' | 'low' => {
  const prob = predictPriorityProbability(bug.bounty, model)
  if (prob > 0.66) return 'high'
  if (prob > 0.33) return 'medium'
  return 'low'
}
