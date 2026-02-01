import { prisma } from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  // 简易鉴权 (实际项目请使用更严格的中间件)
  const adminToken = getCookie(event, 'admin_token');
  if (adminToken !== 'zhuangmai2024') {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  try {
    // 1. 查找所有状态为 'SUBMITTED' 的作品 (如果没有，为了演示方便，取最新的 'OWNED' 作品)
    let candidates = await prisma.community_gallery.findMany({
      where: { status: 'SUBMITTED' },
      take: 6,
      orderBy: { created_at: 'desc' }
    });

    // 演示 fallback：如果没人投稿，就强制征用最新的 6 张图
    if (candidates.length < 6) {
      const more = await prisma.community_gallery.findMany({
        where: { status: 'OWNED' },
        take: 6 - candidates.length,
        orderBy: { created_at: 'desc' }
      });
      candidates = [...candidates, ...more];
    }

    if (candidates.length === 0) {
      return { success: false, message: "图库空空如也，先去生成几张图吧！" };
    }

    // 2. 创建一个新卡池
    const timestamp = new Date().getTime();
    const newCollection = await prisma.collectionSet.create({
      data: {
        title: `锦绣龙年·限定集 ${timestamp.toString().slice(-4)}`,
        description: "集天地之灵气，汇壮锦之精粹。本期收录了社区高赞的龙纹与凤羽图腾，SSR含金量极高。",
        coverUrl: candidates[0].art_image_url, // 用第一张图做封面
        status: 'active',
        pricePerDraw: 100, // 100积分一抽
        publisher_id: candidates[0].owner_id, // 挂名在第一个用户下，或者管理员ID
      }
    });

    // 3. 将作品转化为卡面模板 (CardTemplate)
    // 设定稀有度分布：第1张 SSR，2-3张 SR，其余 R
    const templates = [];
    
    for (let i = 0; i < candidates.length; i++) {
      const art = candidates[i];
      let rarity = 'R';
      let prob = 0.5; // 50%
      let namePrefix = "凡品";

      if (i === 0) { 
        rarity = 'SSR'; prob = 0.05; namePrefix = "传说"; // 5%
      } else if (i < 3) { 
        rarity = 'SR'; prob = 0.15; namePrefix = "史诗"; // 15%
      } else {
        // 剩下的 R 卡平分剩余概率 (逻辑简化，实际总和可以不为1，按权重算)
        rarity = 'R'; prob = 0.8 / (candidates.length - 3);
      }

      const template = await prisma.cardTemplate.create({
        data: {
          collection_set_id: newCollection.id,
          name: `${namePrefix}·${art.user_theme || '无题'}`,
          imageUrl: art.art_image_url,
          rarity: rarity,
          probability: prob,
          originalAuthorId: art.owner_id,
          shareRatio: 0.1, // 作者拿 10% 分成
          totalSupply: 1000,
          remaining: 1000
        }
      });
      templates.push(template);

      // 更新原作品状态为 ACCEPTED
      await prisma.community_gallery.update({
        where: { id: art.id },
        data: { status: 'ACCEPTED' }
      });
    }

    return { 
      success: true, 
      message: `成功发布卡池《${newCollection.title}》，包含 ${templates.length} 张卡片`,
      collectionId: newCollection.id
    };

  } catch (error: any) {
    console.error(error);
    throw createError({ statusCode: 500, message: error.message });
  }
});