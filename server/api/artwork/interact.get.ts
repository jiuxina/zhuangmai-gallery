
import Redis from 'ioredis';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const artworkId = query.id as string;
  const username = query.username as string;

  const connectionString = process.env.KV_URL || process.env.REDIS_URL;
  if (!connectionString) return { likes: 0, liked: false, comments: [] };
  const redis = new Redis(connectionString);

  try {
    const likeKey = `artwork:${artworkId}:likes`;
    const commentKey = `artwork:${artworkId}:comments`;

    // 并行获取数据
    const [likesCount, isLiked, commentsRaw] = await Promise.all([
      redis.scard(likeKey), // 点赞总数
      username ? redis.sismember(likeKey, username) : 0, // 当前用户是否点赞
      redis.lrange(commentKey, 0, -1) // 评论列表
    ]);

    return {
      likes: likesCount,
      liked: !!isLiked,
      comments: commentsRaw.map(s => JSON.parse(s))
    };
  } finally {
    redis.quit();
  }
});