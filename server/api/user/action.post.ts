import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, action } = body; 

  if (!userId) throw createError({ statusCode: 400, message: "用户ID不能为空" });

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw createError({ statusCode: 404, message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let pointsAdded = 0;
    let message = '';
    let reason = '';

    if (action === 'signin') {
      if (user.last_sign_in) {
        const lastSignIn = new Date(user.last_sign_in);
        lastSignIn.setHours(0, 0, 0, 0);
        if (lastSignIn.getTime() === today.getTime()) {
          return { success: false, message: '今日已签到' };
        }
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { last_sign_in: new Date() },
      });
      pointsAdded = 10;
      message = '签到成功 +10';
      reason = '每日签到';
    } 
    else if (action === 'chat') {
      pointsAdded = 5;
      message = '完成对话 +5';
      reason = 'AI 共创奖励';
    }
    else if (action === 'share') {
      pointsAdded = 8;
      message = '分享作品 +8';
      reason = '分享奖励';
    }

    // 事务处理
    const updatedUser = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: user.id },
        data: { points: { increment: pointsAdded } },
      });
      
      if (pointsAdded > 0) {
        await tx.pointLog.create({
          data: {
            user_id: user.id,
            amount: pointsAdded,
            type: 'income',
            reason: reason
          }
        });
      }
      return u;
    });

    return { success: true, points: updatedUser.points, message };

  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});