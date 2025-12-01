
import Redis from 'ioredis';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { imageUrl } = body;

  if (!imageUrl) {
    throw createError({ statusCode: 400, message: "Missing imageUrl" });
  }

  // 1. 生成缓存 Key
  const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
  const cacheKey = `pattern:analysis:${hash}`;

  // 获取连接字符串 (优先取 KV_URL，如果没有则取 REDIS_URL，兼容您的截图)
  const connectionString = process.env.KV_URL || process.env.REDIS_URL;

  let redis: Redis | null = null;
  
  try {
    // 2. 连接 Redis
    if (connectionString) {
      redis = new Redis(connectionString);
      
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log('✨ Hit Cache: Pattern analysis loaded from Redis');
        redis.quit(); // 记得关闭连接
        return JSON.parse(cachedData);
      }
    } else {
      console.warn('⚠️ No REDIS_URL found in .env, skipping cache.');
    }

    console.log('🤖 Miss Cache: Calling AI for analysis...');

    // 3. 调用 AI
    const API_KEY = "c98ce322385f41068bb3a5232c48109d.6jJVHqbVGtLi3lZP"; 
    const API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

    const response = await $fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: {
        model: "glm-4v",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `你是一位壮族非遗文化研究专家。请分析这张壮锦艺术图片，识别其中的纹样结构和文化寓意。
                请务必返回 **纯 JSON 格式** 的数据。
                返回格式要求如下：
                {
                  "main": {
                    "name": "主体纹样名称",
                    "desc": "文化寓意解读（30字以内）"
                  },
                  "elements": [
                    { "icon": "Emoji", "name": "辅助元素1", "desc": "寓意" },
                    { "icon": "Emoji", "name": "辅助元素2", "desc": "寓意" }
                  ],
                  "color": "色彩风格分析（20字以内）"
                }`
              },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        temperature: 0.1,
        top_p: 0.7,
        max_tokens: 1024
      }
    });

    // @ts-ignore
    let content = response.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const result = JSON.parse(content);

    // 4. 写入缓存
    if (redis) {
      await redis.set(cacheKey, JSON.stringify(result), 'EX', 2592000); // 30天过期
      redis.quit();
    }

    return result;

  } catch (error) {
    console.error("Pattern analysis failed:", error);
    if (redis) redis.quit(); // 确保出错也关闭连接
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to analyze pattern."
    });
  }
});