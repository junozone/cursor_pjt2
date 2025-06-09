import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = registerSchema.parse(json);

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "このメールアドレスは既に登録されています。" },
        { status: 409 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(body.password, 12);

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        weight: body.weight,
      },
    });

    // パスワードを除外してユーザー情報を返す
    const { password: _, ...result } = user;

    return NextResponse.json(
      { message: "ユーザーが正常に登録されました。", user: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "ユーザー登録中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
