
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const galleryItems = await prisma.community_gallery.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    return galleryItems;
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "无法获取画廊数据" });
  } finally {
    await prisma.$disconnect();
  }
});
