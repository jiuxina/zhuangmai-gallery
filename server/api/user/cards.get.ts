import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = parseInt(query.userId as string);

  if (isNaN(userId)) return [];

  try {
    const cards = await prisma.userCard.findMany({
      where: { owner_id: userId },
      include: {
        CardTemplate: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    return cards;
  } catch (error) {
    return [];
  } finally {
    await prisma.$disconnect();
  }
});