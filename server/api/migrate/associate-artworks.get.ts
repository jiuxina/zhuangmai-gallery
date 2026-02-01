import { prisma } from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  console.log("🚀 Starting artwork association migration...");

  try {
    // 1. 获取所有用户，并创建一个 username -> id 的映射
    const users = await prisma.user.findMany();
    const userMap = new Map(users.map(user => [user.username, user.id]));
    console.log(`Found ${userMap.size} users.`);

    // 2. 获取所有需要更新的藏品 (owner_id 为 null 且 user_name 不为 null)
    const artworksToUpdate = await prisma.community_gallery.findMany({
      where: {
        owner_id: null,
        user_name: {
          not: null,
        },
      },
    });
    console.log(`Found ${artworksToUpdate.length} artworks to associate.`);

    let associatedCount = 0;
    let notFoundCount = 0;

    // 3. 遍历并更新藏品
    for (const artwork of artworksToUpdate) {
      // @ts-ignore
      const userId = userMap.get(artwork.user_name);

      if (userId) {
        await prisma.community_gallery.update({
          where: { id: artwork.id },
          data: { owner_id: userId },
        });
        associatedCount++;
        console.log(`Associated artwork #${artwork.id} with user #${userId} (${artwork.user_name})`);
      } else {
        notFoundCount++;
        console.warn(`User "${artwork.user_name}" for artwork #${artwork.id} not found. Skipping.`);
      }
    }

    const message = `✅ Migration complete! Associated: ${associatedCount}, Not Found: ${notFoundCount}.`;
    console.log(message);
    return { message };

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Artwork association failed.",
    });
  }
});
