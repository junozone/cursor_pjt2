import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ご褒美ごはん一覧の取得
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "認証が必要です。" },
        { status: 401 }
      );
    }

    const rewardFoods = await prisma.rewardFood.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(rewardFoods);
  } catch (error) {
    console.error("Error fetching reward foods:", error);
    return NextResponse.json(
      { message: "ご褒美ごはんの取得中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

// ご褒美ごはんの作成
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
    const { name, description, calories, imageUrl } = json;

    if (!name || !calories) {
      return NextResponse.json(
        { message: "名前とカロリーは必須です。" },
        { status: 400 }
      );
    }

    const rewardFood = await prisma.rewardFood.create({
      data: {
        name,
        description,
        calories,
        imageUrl,
      },
    });

    return NextResponse.json(rewardFood, { status: 201 });
  } catch (error) {
    console.error("Error creating reward food:", error);
    return NextResponse.json(
      { message: "ご褒美ごはんの作成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
