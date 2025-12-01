
import Redis from 'ioredis';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    throw createError({ statusCode: 400, message: "用户名和密码不能为空" });
  }

  // 获取数据库连接
  const connectionString = process.env.KV_URL || process.env.REDIS_URL;
  if (!connectionString) {
    throw createError({ statusCode: 500, message: "Database connection missing" });
  }

  const redis = new Redis(connectionString);

  try {
    // 1. 检查用户名是否存在
    // 我们使用 "user:用户名" 作为 Key
    const userKey = `user:${username}`;
    const exists = await redis.exists(userKey);

    if (exists) {
      throw createError({ statusCode: 409, message: "该名号已被注册 (Mingz hauh ciuh)" });
    }

    // 2. 创建新用户数据
    const userData = {
      id: Date.now(),
      username,
      password, // 注意：实际生产中应加密存储，比赛演示存明文尚可接受
      createdAt: new Date().toISOString()
    };

    // 3. 存入 Redis
    await redis.set(userKey, JSON.stringify(userData));

    return { success: true, user: { id: userData.id, username: userData.username } };

  } finally {
    redis.quit(); // 关闭连接
  }
});