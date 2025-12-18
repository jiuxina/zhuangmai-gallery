import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, amount } = body;

  if (!userId || !amount) {
    throw createError({ statusCode: 400, message: "参数错误" });
  }

  try {
    // 使用事务同时更新余额和记录日志
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { points: { increment: amount } }
      });

      await tx.pointLog.create({
        data: {
          user_id: userId,
          amount: amount,
          type: 'income',
          reason: '系统充值 (Demo)'
        }
      });

      return updatedUser;
    });

    return { success: true, points: result.points };
  } catch (error) {
    throw createError({ statusCode: 500, message: "充值失败" });
  } finally {
    await prisma.$disconnect();
  }
});