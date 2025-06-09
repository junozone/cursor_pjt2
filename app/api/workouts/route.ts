import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 運動一覧の取得
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "認証が必要です。" },
        { status: 401 }
      );
    }

    const workouts = await prisma.workout.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { message: "運動の取得中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

// 運動の作成
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "認証が必要です。" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const { name, description, caloriesPerHour, type } = json;

    if (!name || !caloriesPerHour || !type) {
      return NextResponse.json(
        { message: "名前、消費カロリー、種類は必須です。" },
        { status: 400 }
      );
    }

    const workout = await prisma.workout.create({
      data: {
        name,
        description,
        caloriesPerHour,
        type,
      },
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error("Error creating workout:", error);
    return NextResponse.json(
      { message: "運動の作成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
