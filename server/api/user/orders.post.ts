
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, orderData } = body;

  if (!userId) {
    throw createError({ statusCode: 400, message: "用户ID不能为空" });
  }

  try {
    const newOrder = await prisma.order.create({
      data: {
        user_id: userId,
        type: orderData.type,
        price: orderData.price,
        status: 'pending_shipment', // 待发货
        artwork_id: orderData.artworkId,
        shipping_address: orderData.shippingAddress,
        shipping_name: orderData.shippingName,
        shipping_phone: orderData.shippingPhone,
      },
    });

    return { success: true, order: newOrder };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "服务器内部错误" });
  } finally {
    await prisma.$disconnect();
  }
});
