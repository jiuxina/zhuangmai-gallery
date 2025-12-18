import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, artworkId } = body;

  if (!userId || !artworkId) {
    throw createError({ statusCode: 400, message: "参数缺失" });
  }

  try {
    // 1. 验证权属
    const artwork = await prisma.community_gallery.findUnique({
      where: { id: artworkId },
    });

    if (!artwork) {
      throw createError({ statusCode: 404, message: "作品不存在" });
    }

    if (artwork.owner_id !== userId) {
      throw createError({ statusCode: 403, message: "您没有该作品的权限" });
    }

    if (artwork.status !== 'OWNED') {
      throw createError({ statusCode: 400, message: "该作品已在审核流程中或已被收录" });
    }

    // 2. 更新状态为已投稿
    const updated = await prisma.community_gallery.update({
      where: { id: artworkId },
      data: { status: 'SUBMITTED' }
    });

    return { success: true, artwork: updated };

  } catch (error: any) {
    console.error("Submission failed:", error);
    throw createError({ statusCode: 500, message: error.message || "投稿失败" });
  } finally {
    await prisma.$disconnect();
  }
});