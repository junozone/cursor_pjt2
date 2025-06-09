import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上である必要があります"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "ユーザー名は2文字以上である必要があります"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上である必要があります"),
  weight: z.number().min(20, "体重は20kg以上である必要があります").max(200, "体重は200kg以下である必要があります"),
}); 