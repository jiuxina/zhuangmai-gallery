import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, orderData } = body;

  // 定义商品价格：5900 pts
  const PRICE_POINTS = 5900;

  if (!userId) throw createError({ statusCode: 400, message: "用户ID不能为空" });

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw createError({ statusCode: 404, message: "用户不存在" });
    if (user.points < PRICE_POINTS) throw createError({ statusCode: 402, message: `积分不足，需 ${PRICE_POINTS} pts` });

    const result = await prisma.$transaction(async (tx) => {
      // 1. 扣分
      await tx.user.update({ where: { id: userId }, data: { points: { decrement: PRICE_POINTS } } });
      // 2. 记账
      await tx.pointLog.create({
        data: { user_id: userId, amount: -PRICE_POINTS, type: 'expense', reason: '兑换实体文创: 定制帆布袋' }
      });
      // 3. 创建订单
      return await tx.order.create({
        data: {
          user_id: userId,
          type: 'physical',
          price: 59.00, // 记录法币价值
          status: 'pending_shipment',
          artwork_id: orderData.artworkId,
          shipping_address: orderData.shippingAddress,
          shipping_name: orderData.shippingName,
          shipping_phone: orderData.shippingPhone,
        },
      });
    }, { timeout: 10000 });

    return { success: true, order: result };
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || "兑换失败" });
  } finally {
    await prisma.$disconnect();
  }
});