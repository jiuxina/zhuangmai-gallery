import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, address, name, phone } = body;

  if (!userId) throw createError({ statusCode: 400, message: "用户未登录" });

  const TARGET_COUNT = 10; // 演示阈值：10次

  try {
    // 1. 检查抽卡次数
    const drawCount = await prisma.userCard.count({
      where: { owner_id: userId }
    });

    if (drawCount < TARGET_COUNT) {
      throw createError({ statusCode: 400, message: "织造次数不足，继续努力！" });
    }

    // 2. 检查是否已领取 (防止重复)
    const existing = await prisma.order.findFirst({
      where: { 
        user_id: userId,
        type: 'milestone_reward'
      }
    });

    if (existing) {
      throw createError({ statusCode: 400, message: "您已领取过该奖励" });
    }

    // 3. 生成 0 元订单
    const order = await prisma.order.create({
      data: {
        user_id: userId,
        type: 'milestone_reward', // 特殊类型
        price: 0,
        status: 'pending_shipment',
        shipping_address: address,
        shipping_name: name,
        shipping_phone: phone,
        // 这里不关联具体 artwork_id，前端显示通用占位图
      }
    });

    return { success: true, order };

  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || "领取失败" });
  } finally {
    await prisma.$disconnect();
  }
});