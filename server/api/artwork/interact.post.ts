import { prisma } from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type, artworkId, userId, content } = body; // type: 'like' | 'comment'

  if (!userId) {
    throw createError({ statusCode: 401, message: "请先登录" });
  }

  try {
    if (type === 'like') {
      const existingLike = await prisma.interaction.findUnique({
        where: {
          user_id_artwork_id_type: {
            user_id: userId,
            artwork_id: artworkId,
            type: 'like',
          },
        },
      });

      if (existingLike) {
        await prisma.interaction.delete({
          where: { id: existingLike.id },
        });
        return { liked: false };
      } else {
        await prisma.interaction.create({
          data: {
            user_id: userId,
            artwork_id: artworkId,
            type: 'like',
          },
        });
        return { liked: true };
      }
    } 
    else if (type === 'comment') {
      const newComment = await prisma.interaction.create({
        data: {
          user_id: userId,
          artwork_id: artworkId,
          type: 'comment',
          content,
        },
        include: {
          User: {
            select: {
              username: true,
              avatar: true,
            }
          }
        }
      });
      return { success: true, comment: newComment };
    }
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "服务器内部错误" });
  }
});
