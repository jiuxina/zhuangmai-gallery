
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const artworkId = parseInt(query.id as string);
  const userId = parseInt(query.userId as string);

  if (isNaN(artworkId)) {
    return { likes: 0, liked: false, comments: [] };
  }

  try {
    const artwork = await prisma.community_gallery.findUnique({
      where: { id: artworkId },
      include: {
        Interaction: {
          include: {
            User: {
              select: {
                username: true,
                avatar: true,
              }
            }
          }
        },
      },
    });

    if (!artwork) {
      return { likes: 0, liked: false, comments: [] };
    }

    const likes = artwork.Interaction.filter(i => i.type === 'like');
    const comments = artwork.Interaction.filter(i => i.type === 'comment');
    const liked = userId ? likes.some(l => l.user_id === userId) : false;

    return {
      likes: likes.length,
      liked,
      comments: comments.map(c => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        user: c.User,
      })),
    };
  } catch (error) {
    console.error(error);
    return { likes: 0, liked: false, comments: [] };
  } finally {
    await prisma.$disconnect();
  }
});
