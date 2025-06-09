import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// カロリー計算関数（METs値を使用）
export function calculateCalories(mets: number, weightKg: number, timeMinutes: number): number {
  const timeHours = timeMinutes / 60
  return Math.round(mets * weightKg * timeHours * 1.05)
}

// 進捗率計算
export function calculateProgress(current: number, target: number): number {
  return Math.min((current / target) * 100, 100)
}

// 日付フォーマット
export function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
  })
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
