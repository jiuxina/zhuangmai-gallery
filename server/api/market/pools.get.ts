import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const pools = await prisma.collectionSet.findMany({
      where: { status: 'active' },
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { CardTemplate: true }
        }
      }
    });
    return pools;
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "无法获取集市数据" });
  } finally {
    await prisma.$disconnect();
  }
});