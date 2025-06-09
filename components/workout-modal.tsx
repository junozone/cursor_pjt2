"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { exercises, timeOptions } from "@/lib/data"

interface WorkoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (exerciseId: number, timeMinutes: number) => void
}

export default function WorkoutModal({ isOpen, onClose, onSubmit }: WorkoutModalProps) {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)

  const handleSubmit = () => {
    if (selectedExercise && selectedTime) {
      onSubmit(selectedExercise, selectedTime)
      // リセット
      setSelectedExercise(null)
      setSelectedTime(null)
    }
  }

  const handleClose = () => {
    setSelectedExercise(null)
    setSelectedTime(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">今日の頑張りを記録</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 運動選択 */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">運動の種類</h3>
            <div className="grid grid-cols-2 gap-2">
              {exercises.map((exercise) => (
                <Button
                  key={exercise.id}
                  variant={selectedExercise === exercise.id ? "default" : "outline"}
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={() => setSelectedExercise(exercise.id)}
                >
                  <span className="text-2xl">{exercise.emoji}</span>
                  <span className="text-xs">{exercise.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* 時間選択 */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">時間</h3>
            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="h-12"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}分
                </Button>
              ))}
            </div>
          </div>

          {/* 記録ボタン */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedExercise || !selectedTime}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            記録する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
