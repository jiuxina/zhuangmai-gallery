import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, poolId, count = 1 } = body; 

  if (!userId || !poolId) throw createError({ statusCode: 400, message: "参数缺失" });

  try {
    // 1. 预检查
    const pool = await prisma.collectionSet.findUnique({
      where: { id: poolId },
      include: { CardTemplate: true }
    });

    if (!pool || pool.status !== 'active') throw createError({ statusCode: 404, message: "卡池不可用" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw createError({ statusCode: 404, message: "用户不存在" });

    const totalCost = pool.pricePerDraw * count;
    if (user.points < totalCost) throw createError({ statusCode: 402, message: "积分不足" });

    // 2. 内存计算抽卡结果 (纯计算，0延迟)
    const templates = pool.CardTemplate;
    if (templates.length === 0) throw createError({ statusCode: 500, message: "卡池为空" });

    const weightedTemplates: any[] = [];
    let totalWeight = 0;
    templates.forEach(t => {
      const weight = Math.floor(t.probability * 1000);
      if (weight > 0) { weightedTemplates.push({ ...t, weight }); totalWeight += weight; }
    });
    if (totalWeight <= 0) { weightedTemplates.push({ ...templates[0], weight: 1000 }); totalWeight = 1000; }

    const drawResults = [];
    const authorShares = new Map<number, number>(); // 聚合作者分润：Map<authorId, totalShare>

    for (let i = 0; i < count; i++) {
      let random = Math.random() * totalWeight;
      let selected = weightedTemplates[0];
      for (const t of weightedTemplates) {
        if (random < t.weight) { selected = t; break; }
        random -= t.weight;
      }
      
      // 准备结果数据
      drawResults.push({
        owner_id: userId,
        template_id: selected.id,
        cardNumber: Math.floor(Math.random() * 1000) + 1,
        // 临时保存模板信息用于返回前端，不入库
        _template: selected 
      });

      // 聚合分润
      if (selected.originalAuthorId) {
        const share = Math.floor(pool.pricePerDraw * (selected.shareRatio || 0.1));
        if (share > 0) {
          const current = authorShares.get(selected.originalAuthorId) || 0;
          authorShares.set(selected.originalAuthorId, current + share);
        }
      }
    }

    // 3. 极速事务 (Batch Processing)
    const result = await prisma.$transaction(async (tx) => {
      // A. 扣费 (1次 DB 操作)
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { points: { decrement: totalCost } }
      });
      
      // B. 批量插入持仓 (1次 DB 操作，替代之前的循环)
      await tx.userCard.createMany({
        data: drawResults.map(({ _template, ...rest }) => rest)
      });

      // C. 记录用户日志 (1次 DB 操作)
      await tx.pointLog.create({
        data: { user_id: userId, amount: -totalCost, type: 'expense', reason: `织造消耗: ${pool.title} (x${count})` }
      });

      // D. 批量分润 (操作次数 = 涉及的作者数量，通常很少)
      for (const [authorId, totalShare] of authorShares.entries()) {
        await tx.user.update({
          where: { id: authorId },
          data: { points: { increment: totalShare } }
        });
        await tx.pointLog.create({
          data: {
            user_id: authorId,
            amount: totalShare,
            type: 'income',
            reason: `作品被抽取分润 (x${count}次织造)`
          }
        });
      }

      return { userPoints: updatedUser.points };
    }, { timeout: 10000 }); // 超时保险

    // 4. 构造返回数据
    return {
      success: true,
      data: {
        remainingPoints: result.userPoints,
        cards: drawResults.map(r => ({
          cardName: r._template.name,
          rarity: r._template.rarity,
          imageUrl: r._template.imageUrl
        }))
      }
    };

  } catch (error: any) {
    console.error("Draw failed:", error);
    throw createError({ statusCode: 500, message: error.message || "织造失败" });
  } finally {
    await prisma.$disconnect();
  }
});