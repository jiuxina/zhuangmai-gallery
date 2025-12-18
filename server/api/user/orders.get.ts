import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const username = query.username as string;

  if (!username) {
    return [];
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        Order: {
          include: {
            community_gallery: true
          }
        },
      },
    });

    if (!user) {
      return [];
    }

    return user.Order;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
});