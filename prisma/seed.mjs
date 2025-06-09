import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ユーザーの作成
  const user1 = await prisma.user.create({
    data: {
      username: 'テストユーザー1',
      email: 'test1@example.com',
      password_hash: await hash('password123', 10),
      weight: 60.0,
    },
  });

  // ご褒美ごはんの作成
  const rewardFoods = await prisma.rewardFood.createMany({
    data: [
      {
        name: 'ラーメン',
        calories: 800,
        emoji: '🍜',
        category: '麺類',
      },
      {
        name: 'ハンバーガー',
        calories: 600,
        emoji: '🍔',
        category: 'ファストフード',
      },
      {
        name: 'ピザ',
        calories: 700,
        emoji: '🍕',
        category: 'ファストフード',
      },
    ],
  });

  // 運動の作成
  const exercises = await prisma.exercise.createMany({
    data: [
      {
        name: 'ウォーキング',
        mets: 3.5,
        emoji: '🚶',
        category: '有酸素運動',
      },
      {
        name: 'ジョギング',
        mets: 7.0,
        emoji: '🏃',
        category: '有酸素運動',
      },
      {
        name: '腕立て伏せ',
        mets: 8.0,
        emoji: '💪',
        category: '筋力トレーニング',
      },
    ],
  });

  // テスト用の運動記録を作成
  const exercise = await prisma.exercise.findFirst({
    where: { name: 'ウォーキング' },
  });

  if (exercise) {
    await prisma.workoutRecord.create({
      data: {
        userId: user1.id,
        exerciseId: exercise.id,
        time_minutes: 30,
        calories_burned: 150.0,
        date: new Date(),
      },
    });
  }

  // テスト用の達成記録を作成
  const rewardFood = await prisma.rewardFood.findFirst({
    where: { name: 'ラーメン' },
  });

  if (rewardFood) {
    await prisma.achievement.create({
      data: {
        userId: user1.id,
        rewardFoodId: rewardFood.id,
        date: new Date(),
        status: '達成',
      },
    });
  }

  console.log('シードデータが正常に作成されました。');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 