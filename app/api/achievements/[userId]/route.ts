import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
  params: { userId: string };
}

// ユーザーの達成記録一覧の取得
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

    const achievements = await prisma.achievement.findMany({
      where: {
        userId: userId,
      },
      include: {
        rewardFood: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { message: "達成記録の取得中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

// 達成記録の作成
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
    const { rewardFoodId, workoutRecordIds } = json;

    if (!rewardFoodId || !workoutRecordIds || workoutRecordIds.length === 0) {
      return NextResponse.json(
        { message: "ご褒美ごはんIDと運動記録IDは必須です。" },
        { status: 400 }
      );
    }

    // 運動記録の取得と消費カロリーの合計計算
    const workoutRecords = await prisma.workoutRecord.findMany({
      where: {
        id: { in: workoutRecordIds },
        userId: userId,
      },
    });

    if (workoutRecords.length !== workoutRecordIds.length) {
      return NextResponse.json(
        { message: "指定された運動記録の一部が見つかりません。" },
        { status: 404 }
      );
    }

    const totalCaloriesBurned = workoutRecords.reduce(
      (sum, record) => sum + record.caloriesBurned,
      0
    );

    // ご褒美ごはんの取得
    const rewardFood = await prisma.rewardFood.findUnique({
      where: { id: rewardFoodId },
    });

    if (!rewardFood) {
      return NextResponse.json(
        { message: "指定されたご褒美ごはんが見つかりません。" },
        { status: 404 }
      );
    }

    // 達成記録の作成
    const achievement = await prisma.achievement.create({
      data: {
        userId,
        rewardFoodId,
        totalCaloriesBurned,
        workoutRecords: {
          connect: workoutRecordIds.map(id => ({ id })),
        },
      },
      include: {
        rewardFood: true,
        workoutRecords: true,
      },
    });

    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { message: "達成記録の作成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
