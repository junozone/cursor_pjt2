import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "ログイン",
  description: "アカウントにログインして、運動記録を管理しましょう。",
};

interface LoginPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const registered = searchParams.registered === "true";

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>
            メールアドレスとパスワードを入力してログインしてください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registered && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded">
              ユーザー登録が完了しました。登録したメールアドレスとパスワードでログインしてください。
            </div>
          )}
          <LoginForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            アカウントをお持ちでない場合は{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              新規登録
            </Link>
            してください。
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 