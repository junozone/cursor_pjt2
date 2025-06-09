"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { RewardFood } from "@/types"

interface AchievementModalProps {
  isOpen: boolean
  onClose: () => void
  reward: RewardFood
  onNextReward: () => void
}

export default function AchievementModal({ isOpen, onClose, reward, onNextReward }: AchievementModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto text-center border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="py-6 space-y-6">
          {/* 祝福メッセージ */}
          <div className="space-y-2">
            <div className="text-6xl animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-orange-600">CONGRATULATIONS!</h2>
            <p className="text-lg text-gray-700">やりましたね！</p>
          </div>

          {/* 達成したご褒美 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-8xl mb-4">{reward.emoji}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{reward.name}</h3>
            <p className="text-gray-600">
              今日の頑張りで、{reward.name}を<br />
              罪悪感なく楽しめます！
            </p>
          </div>

          {/* アクションボタン */}
          <div className="space-y-3">
            <Button
              onClick={onNextReward}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              次のご褒美を設定する！
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              後で設定する
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
