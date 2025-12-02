
import Redis from 'ioredis';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, action } = body; // action: 'signin' | 'chat' | 'share'

  const connectionString = process.env.KV_URL || process.env.REDIS_URL;
  if (!connectionString) throw createError({ statusCode: 500, message: "DB Error" });
  const redis = new Redis(connectionString);

  try {
    const userKey = `user:${username}`;
    const userDataStr = await redis.get(userKey);
    if (!userDataStr) throw createError({ statusCode: 404, message: "User not found" });

    let user = JSON.parse(userDataStr);
    
    // 初始化字段
    if (!user.points) user.points = 0;
    if (!user.lastSignIn) user.lastSignIn = '';
    
    const today = new Date().toISOString().split('T')[0];
    let pointsAdded = 0;
    let message = '';

    // --- 逻辑处理 ---
    if (action === 'signin') {
      if (user.lastSignIn === today) {
        return { success: false, message: '今日已签到 (Gijneix yaek)' };
      }
      user.lastSignIn = today;
      pointsAdded = 10;
      message = '签到成功 +10 贡献值';
    } 
    else if (action === 'chat') {
      // 简单防刷：限制频率或每日上限（此处简化为每次+5）
      pointsAdded = 5;
      message = '完成对话 +5 贡献值';
    }
    else if (action === 'share') {
      pointsAdded = 8;
      message = '分享作品 +8 贡献值';
    }

    // 更新积分
    user.points += pointsAdded;
    
    // 保存回 Redis
    await redis.set(userKey, JSON.stringify(user));

    return { 
      success: true, 
      points: user.points, 
      added: pointsAdded,
      message 
    };

  } finally {
    redis.quit();
  }
});