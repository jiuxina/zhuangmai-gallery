
import Redis from 'ioredis';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, orderData } = body;

  const connectionString = process.env.KV_URL || process.env.REDIS_URL;
  if (!connectionString) throw createError({ statusCode: 500, message: "DB Error" });
  const redis = new Redis(connectionString);

  try {
    const orderId = Date.now().toString().slice(-8); // 简短订单号
    const newOrder = {
      id: orderId,
      ...orderData,
      status: 'pending_shipment', // 待发货
      createdAt: new Date().toISOString()
    };

    // 存入用户的订单列表 (List 结构)
    await redis.lpush(`orders:${username}`, JSON.stringify(newOrder));
    return { success: true, order: newOrder };
  } finally {
    redis.quit();
  }
});