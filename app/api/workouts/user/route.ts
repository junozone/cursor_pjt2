import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "認証が必要です。" },
        { status: 401 }
      )
    }

    const workoutRecords = await prisma.workoutRecord.findMany({
      where: {
        user: {
          email: session.user?.email
        }
      },
      include: {
        workout: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // クライアントに必要なデータ形式に変換
    const formattedRecords = workoutRecords.map(record => ({
      id: record.id,
      exerciseId: record.workoutId,
      exerciseName: record.workout.name,
      timeMinutes: record.duration,
      caloriesBurned: record.caloriesBurned,
      date: record.startTime
    }))

    return NextResponse.json(formattedRecords)
  } catch (error) {
    console.error("Error fetching workout records:", error)
    return NextResponse.json(
      { message: "運動記録の取得中にエラーが発生しました。" },
      { status: 500 }
    )
  }
} 