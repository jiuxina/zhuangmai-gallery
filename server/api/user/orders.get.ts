
import Redis from 'ioredis';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const username = query.username as string;

  const connectionString = process.env.KV_URL || process.env.REDIS_URL;
  if (!connectionString) return [];
  const redis = new Redis(connectionString);

  try {
    // 获取用户所有订单
    const ordersRaw = await redis.lrange(`orders:${username}`, 0, -1);
    return ordersRaw.map(s => JSON.parse(s));
  } finally {
    redis.quit();
  }
});