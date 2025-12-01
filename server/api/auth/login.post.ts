
import Redis from 'ioredis';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  const connectionString = process.env.KV_URL || process.env.REDIS_URL;
  if (!connectionString) {
    throw createError({ statusCode: 500, message: "Database connection missing" });
  }

  const redis = new Redis(connectionString);

  try {
    // 1. 查找用户
    const userKey = `user:${username}`;
    const dataString = await redis.get(userKey);

    if (!dataString) {
      throw createError({ statusCode: 401, message: "用户不存在 (Boux mbouj miz)" });
    }

    const userData = JSON.parse(dataString);

    // 2. 比对密码
    if (userData.password !== password) {
      throw createError({ statusCode: 401, message: "密码错误 (Miemaj mbouj doengz)" });
    }

    // 3. 登录成功，返回用户信息（不含密码）
    return {
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        createdAt: userData.createdAt
      }
    };

  } finally {
    redis.quit();
  }
});