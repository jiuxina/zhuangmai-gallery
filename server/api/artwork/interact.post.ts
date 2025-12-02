
import Redis from 'ioredis';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type, artworkId, username, content } = body; // type: 'like' | 'comment'

  const connectionString = process.env.KV_URL || process.env.REDIS_URL;
  if (!connectionString) throw createError({ statusCode: 500 });
  const redis = new Redis(connectionString);

  try {
    if (type === 'like') {
      const key = `artwork:${artworkId}:likes`;
      // 使用 Set 集合，防止重复点赞，再次点击则取消
      const isMember = await redis.sismember(key, username);
      if (isMember) {
        await redis.srem(key, username);
        return { liked: false };
      } else {
        await redis.sadd(key, username);
        return { liked: true };
      }
    } 
    else if (type === 'comment') {
      const key = `artwork:${artworkId}:comments`;
      const commentData = {
        username,
        content,
        date: new Date().toISOString()
      };
      await redis.lpush(key, JSON.stringify(commentData));
      return { success: true, comment: commentData };
    }
  } finally {
    redis.quit();
  }
});