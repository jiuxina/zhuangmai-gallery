import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = parseInt(query.userId as string);

  if (isNaN(userId)) return [];

  try {
    const logs = await prisma.pointLog.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50 // 只取最近50条
    });
    return logs;
  } catch (error) {
    return [];
  } finally {
    await prisma.$disconnect();
  }
});