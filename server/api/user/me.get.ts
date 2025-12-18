
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const username = query.username as string;

  if (!username) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    // 返回脱敏数据
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      points: user.points,
      balance: user.balance,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
    };
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
});
