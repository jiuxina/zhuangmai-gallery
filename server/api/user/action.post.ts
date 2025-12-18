
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, action } = body; // action: 'signin' | 'chat' | 'share'

  if (!userId) {
    throw createError({ statusCode: 400, message: "用户ID不能为空" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let pointsAdded = 0;
    let message = '';

    // --- 逻辑处理 ---
    if (action === 'signin') {
      if (user.last_sign_in) {
        const lastSignIn = new Date(user.last_sign_in);
        lastSignIn.setHours(0, 0, 0, 0);
        if (lastSignIn.getTime() === today.getTime()) {
          return { success: false, message: '今日已签到 (Gijneix yaek)' };
        }
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { last_sign_in: new Date() },
      });
      pointsAdded = 10;
      message = '签到成功 +10 贡献值';
    } 
    else if (action === 'chat') {
      // 简单防刷：限制频率或每日上限（此处简化为每次+5）
      pointsAdded = 5;
      message = '完成对话 +5 贡献值';
    }
    else if (action === 'share') {
      pointsAdded = 8;
      message = '分享作品 +8 贡献值';
    }

    // 更新积分
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: pointsAdded } },
    });

    return { 
      success: true, 
      points: updatedUser.points, 
      added: pointsAdded,
      message 
    };

  } catch (error) {
    // @ts-ignore
    if (error.statusCode === 404) {
      throw error;
    }
    console.error(error);
    throw createError({ statusCode: 500, message: "服务器内部错误" });
  } finally {
    await prisma.$disconnect();
  }
});
