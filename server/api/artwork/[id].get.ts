
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const artworkId = parseInt(event.context.params.id);

  if (isNaN(artworkId)) {
    throw createError({ statusCode: 400, message: "无效的作品ID" });
  }

  try {
    const artwork = await prisma.community_gallery.findUnique({
      where: { id: artworkId },
    });

    if (!artwork) {
      throw createError({ statusCode: 404, message: "作品未找到" });
    }

    return artwork;
  } catch (error) {
    // @ts-ignore
    if (error.statusCode === 404) {
      throw error;
    }
    console.error(error);
    throw createError({ statusCode: 500, message: "无法获取作品数据" });
  } finally {
    await prisma.$disconnect();
  }
});
