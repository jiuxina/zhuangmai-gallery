import { prisma } from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  try {
    // 1. 勤耕织造榜 (总抽卡数前 5)
    const topDrawers = await prisma.userCard.groupBy({
      by: ['owner_id'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    // 获取用户信息
    const drawerIds = topDrawers.map(i => i.owner_id);
    const drawerUsers = await prisma.user.findMany({
      where: { id: { in: drawerIds } },
      select: { id: true, username: true, avatar: true }
    });

    const diligenceList = topDrawers.map(item => {
      const user = drawerUsers.find(u => u.id === item.owner_id);
      return {
        username: user?.username || '神秘织工',
        count: item._count.id,
        avatar: user?.username?.[0]?.toUpperCase() || '工'
      };
    });

    // 2. 天眷锦鲤榜 (SSR 数量前 5)
    const luckyDrawers = await prisma.userCard.groupBy({
      by: ['owner_id'],
      where: { 
        CardTemplate: { rarity: 'SSR' } 
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    const luckyIds = luckyDrawers.map(i => i.owner_id);
    const luckyUsers = await prisma.user.findMany({
      where: { id: { in: luckyIds } },
      select: { id: true, username: true }
    });

    const luckyList = luckyDrawers.map(item => {
      const user = luckyUsers.find(u => u.id === item.owner_id);
      return {
        username: user?.username || '天选之人',
        count: item._count.id, // SSR 数量
        avatar: user?.username?.[0]?.toUpperCase() || '吉'
      };
    });

    return { diligenceList, luckyList };

  } catch (error) {
    return { diligenceList: [], luckyList: [] };
  }
});