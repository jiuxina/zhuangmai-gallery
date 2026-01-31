import { prisma } from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  console.log("Starting artwork association migration...");

  try {
    // 1. 获取所有用户，并创建一个以 username 为键的映射
    const users = await prisma.user.findMany();
    const userMap = new Map(users.map(user => [user.username, user.id]));
    console.log(`Found ${userMap.size} users.`);

    // 2. 获取所有 owner_id 为 null 的藏品
    const artworksToMigrate = await prisma.community_gallery.findMany({
      where: {
        owner_id: null,
        user_name: {
          not: null, // 确保 user_name 存在
        },
      },
    });
    console.log(`Found ${artworksToMigrate.length} artworks to migrate.`);

    let associatedCount = 0;
    let notFoundCount = 0;

    // 3. 遍历并更新藏品
    for (const artwork of artworksToMigrate) {
      if (artwork.user_name && userMap.has(artwork.user_name)) {
        const userId = userMap.get(artwork.user_name);
        if (userId) {
          await prisma.community_gallery.update({
            where: { id: artwork.id },
            data: { owner_id: userId },
          });
          associatedCount++;
          console.log(`Associated artwork ID ${artwork.id} (user_name: ${artwork.user_name}) with user ID ${userId}.`);
        }
      } else {
        notFoundCount++;
        console.warn(`User not found for artwork ID ${artwork.id} with user_name: ${artwork.user_name}`);
      }
    }

    const message = `Migration complete. Associated ${associatedCount} artworks. Could not find users for ${notFoundCount} artworks.`;
    console.log(message);
    
    return { success: true, message };

  } catch (error) {
    console.error("Artwork association migration failed:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Migration failed.",
    });
  }
});
