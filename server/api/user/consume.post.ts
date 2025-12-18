import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, amount, reason } = body;

  if (!userId || !amount) throw createError({ statusCode: 400, message: "参数不全" });

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw createError({ statusCode: 404, message: "用户未找到" });
    if (user.points < amount) throw createError({ statusCode: 402, message: `积分不足 (需 ${amount} pts)` });

    const updatedUser = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: userId },
        data: { points: { decrement: amount } }
      });
      await tx.pointLog.create({
        data: { user_id: userId, amount: -amount, type: 'expense', reason: reason || '功能消耗' }
      });
      return u;
    });

    return { success: true, remainingPoints: updatedUser.points };
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message });
  } finally {
    await prisma.$disconnect();
  }
});