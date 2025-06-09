"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkoutRecord, Exercise } from "@/types"
import { exercises } from "@/lib/data"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

export default function DashboardPage() {
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([])
  const [totalCalories, setTotalCalories] = useState(0)
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [exerciseDistribution, setExerciseDistribution] = useState<any[]>([])

  useEffect(() => {
    fetchWorkoutRecords()
  }, [])

  const fetchWorkoutRecords = async () => {
    try {
      const response = await fetch("/api/workouts/user")
      if (response.ok) {
        const data = await response.json()
        setWorkoutRecords(data)
        processData(data)
      }
    } catch (error) {
      console.error("Error fetching workout records:", error)
    }
  }

  const processData = (records: WorkoutRecord[]) => {
    // 総消費カロリーの計算
    const total = records.reduce((sum, record) => sum + record.caloriesBurned, 0)
    setTotalCalories(total)

    // 週間データの処理
    const weeklyStats = processWeeklyData(records)
    setWeeklyData(weeklyStats)

    // 運動種類別の分布
    const distribution = processExerciseDistribution(records)
    setExerciseDistribution(distribution)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">フィットネスダッシュボード</h1>
      
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>総消費カロリー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCalories} kcal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>運動回数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{workoutRecords.length} 回</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>週間目標達成率</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {calculateGoalProgress(totalCalories)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* グラフ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>週間カロリー消費推移</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>運動種類別分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近の運動記録 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>最近の運動記録</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">日付</th>
                  <th className="text-left p-2">運動</th>
                  <th className="text-left p-2">時間</th>
                  <th className="text-left p-2">消費カロリー</th>
                </tr>
              </thead>
              <tbody>
                {workoutRecords.slice(0, 5).map((record) => (
                  <tr key={record.id}>
                    <td className="p-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">{record.exerciseName}</td>
                    <td className="p-2">{record.timeMinutes}分</td>
                    <td className="p-2">{record.caloriesBurned}kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ヘルパー関数
function processWeeklyData(records: WorkoutRecord[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  return last7Days.map(date => {
    const dayRecords = records.filter(r => 
      r.date.toISOString().split('T')[0] === date
    )
    return {
      date: date,
      calories: dayRecords.reduce((sum, r) => sum + r.caloriesBurned, 0)
    }
  })
}

function processExerciseDistribution(records: WorkoutRecord[]) {
  const distribution = new Map<string, number>()
  records.forEach(record => {
    const count = distribution.get(record.exerciseName) || 0
    distribution.set(record.exerciseName, count + 1)
  })
  
  return Array.from(distribution.entries()).map(([name, count]) => ({
    name,
    count
  }))
}

function calculateGoalProgress(totalCalories: number) {
  const weeklyGoal = 2000 // 週間目標カロリー
  return Math.min(Math.round((totalCalories / weeklyGoal) * 100), 100)
} 