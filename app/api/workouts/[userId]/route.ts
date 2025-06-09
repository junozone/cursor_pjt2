import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
  params: { userId: string };
}

// ユーザーの運動記録一覧の取得
export async function GET(req: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "認証が必要です。" },
        { status: 401 }
      );
    }

    const userId = params.userId;

    const workoutRecords = await prisma.workoutRecord.findMany({
      where: {
        userId: userId,
      },
      include: {
        workout: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json(workoutRecords);
  } catch (error) {
    console.error("Error fetching workout records:", error);
    return NextResponse.json(
      { message: "運動記録の取得中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

// 運動記録の作成
export async function POST(req: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "認証が必要です。" },
        { status: 401 }
      );
    }

    const userId = params.userId;
    const json = await req.json();
    const { workoutId, startTime, endTime, note } = json;

    if (!workoutId || !startTime || !endTime) {
      return NextResponse.json(
        { message: "運動ID、開始時間、終了時間は必須です。" },
        { status: 400 }
      );
    }

    // 運動時間（分）の計算
    const duration = Math.round(
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)
    );

    // 運動情報の取得
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      return NextResponse.json(
        { message: "指定された運動が見つかりません。" },
        { status: 404 }
      );
    }

    // 消費カロリーの計算
    const caloriesBurned = Math.round(
      (workout.caloriesPerHour / 60) * duration
    );

    const workoutRecord = await prisma.workoutRecord.create({
      data: {
        userId,
        workoutId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
        caloriesBurned,
        note,
      },
      include: {
        workout: true,
      },
    });

    return NextResponse.json(workoutRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating workout record:", error);
    return NextResponse.json(
      { message: "運動記録の作成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
