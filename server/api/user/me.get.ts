
import Redis from 'ioredis';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const username = query.username as string;

  const connectionString = process.env.KV_URL || process.env.REDIS_URL;
  if (!connectionString) return null;
  const redis = new Redis(connectionString);

  try {
    const userStr = await redis.get(`user:${username}`);
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    // 返回脱敏数据
    return {
      username: user.username,
      points: user.points || 0,
      createdAt: user.createdAt || new Date().toISOString(),
      lastSignIn: user.lastSignIn || ''
    };
  } finally {
    redis.quit();
  }
});