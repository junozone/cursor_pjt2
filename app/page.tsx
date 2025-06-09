"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus } from "lucide-react"
import { rewardFoods, exercises } from "@/lib/data"
import { calculateCalories, calculateProgress, formatDate } from "@/lib/utils"
import type { WorkoutRecord, UserProfile } from "@/types"
import WorkoutModal from "@/components/workout-modal"
import AchievementModal from "@/components/achievement-modal"

export default function HomePage() {
  // ユーザープロファイル（実際のアプリではローカルストレージやDBから取得）
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nickname: "太郎",
    weight: 70,
    currentRewardId: 1, // ラーメン
    totalCalories: 320,
  })

  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([
    {
      id: "1",
      exerciseId: 1,
      exerciseName: "ランニング",
      timeMinutes: 30,
      caloriesBurned: 250,
      date: new Date(Date.now() - 86400000), // 昨日
    },
  ])

  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false)
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false)

  // 現在の目標ご褒美
  const currentReward = rewardFoods.find((food) => food.id === userProfile.currentRewardId)!

  // 進捗計算
  const progress = calculateProgress(userProfile.totalCalories, currentReward.calories)
  const remainingCalories = Math.max(currentReward.calories - userProfile.totalCalories, 0)

  // ワークアウト記録追加
  const handleWorkoutSubmit = (exerciseId: number, timeMinutes: number) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId)!
    const caloriesBurned = calculateCalories(exercise.mets, userProfile.weight, timeMinutes)

    const newRecord: WorkoutRecord = {
      id: Date.now().toString(),
      exerciseId,
      exerciseName: exercise.name,
      timeMinutes,
      caloriesBurned,
      date: new Date(),
    }

    setWorkoutRecords((prev) => [newRecord, ...prev])

    const newTotalCalories = userProfile.totalCalories + caloriesBurned
    setUserProfile((prev) => ({
      ...prev,
      totalCalories: newTotalCalories,
    }))

    setIsWorkoutModalOpen(false)

    // 達成チェック
    if (newTotalCalories >= currentReward.calories) {
      setTimeout(() => setIsAchievementModalOpen(true), 500)
    }
  }

  // 次のご褒美設定
  const handleNextReward = () => {
    const nextRewardId = (userProfile.currentRewardId % rewardFoods.length) + 1
    setUserProfile((prev) => ({
      ...prev,
      currentRewardId: nextRewardId,
      totalCalories: 0,
    }))
    setIsAchievementModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center pt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">こんにちは、{userProfile.nickname}さん！</h1>
            <p className="text-gray-600 text-sm">今日も頑張りましょう 💪</p>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* ご褒美ゲージカード */}
        <Card className="overflow-hidden border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{currentReward.emoji}</div>
              <h2 className="text-xl font-bold text-gray-800">{currentReward.name}</h2>
              <p className="text-gray-600 text-sm">{currentReward.calories}kcal</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">進捗</span>
                <span className="font-semibold">
                  {userProfile.totalCalories} / {currentReward.calories} kcal
                </span>
              </div>

              <Progress value={progress} className="h-3" />

              {remainingCalories > 0 ? (
                <p className="text-center text-sm text-gray-600">
                  あと <span className="font-bold text-orange-600">{remainingCalories}kcal</span> で達成！
                </p>
              ) : (
                <p className="text-center text-sm font-bold text-green-600">🎉 達成済み！ご褒美をお楽しみください！</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* トレーニング記録ボタン */}
        <Button
          onClick={() => setIsWorkoutModalOpen(true)}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          今日の頑張りを記録する！
        </Button>

        {/* 最近のアクティビティ */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">最近のアクティビティ</h3>
            <div className="space-y-2">
              {workoutRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {formatDate(record.date)}
                    </Badge>
                    <span className="text-sm">{record.exerciseName}</span>
                    <span className="text-xs text-gray-500">{record.timeMinutes}分</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">+{record.caloriesBurned}kcal</span>
                </div>
              ))}
              {workoutRecords.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  まだ記録がありません。
                  <br />
                  最初のワークアウトを記録してみましょう！
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ワークアウト入力モーダル */}
      <WorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
        onSubmit={handleWorkoutSubmit}
      />

      {/* 達成モーダル */}
      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        reward={currentReward}
        onNextReward={handleNextReward}
      />
    </div>
  )
}
