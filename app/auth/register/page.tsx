import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "新規登録",
  description: "新しいアカウントを作成して、運動記録を始めましょう。",
};

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>新規登録</CardTitle>
          <CardDescription>
            新しいアカウントを作成して、運動記録を始めましょう。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            すでにアカウントをお持ちの場合は{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              ログイン
            </Link>
            してください。
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 