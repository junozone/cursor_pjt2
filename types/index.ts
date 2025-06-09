export interface RewardFood {
  id: number
  name: string
  calories: number
  emoji: string
  category: string
}

export interface Exercise {
  id: number
  name: string
  mets: number
  emoji: string
  category: string
}

export interface WorkoutRecord {
  id: string
  exerciseId: number
  exerciseName: string
  timeMinutes: number
  caloriesBurned: number
  date: Date
}

export interface UserProfile {
  nickname: string
  weight: number
  currentRewardId: number
  totalCalories: number
}
