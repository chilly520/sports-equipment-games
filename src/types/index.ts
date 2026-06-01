export interface Game {
  id: string
  name: string
  difficulty: 'easy' | 'medium' | 'hard'
  ageRange: string
  playerCount: string
  duration: string
  steps: string[]
  tips: string[]
}

export interface Equipment {
  id: string
  name: string
  icon: string
  color: string
  description: string
  category: 'regular' | 'inflatable'
  games: Game[]
}

export type FilterType = 'all' | string
