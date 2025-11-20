// server/api/generate-share.post.ts

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { imageUrl, title, interpretation } = body;

  // 智谱AI的配置
  const API_KEY = "c98ce322385f41068bb3a5232c48109d.6jJVHqbVGtLi3lZP"; 
  const API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

  try {
    const response = await $fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: {
        model: "glm-4v", // 使用视觉模型
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `请根据这张壮锦艺术作品图片和以下背景信息，写一篇**小红书风格**的分享文案。
                
                **作品信息**：
                - 标题：${title}
                - 寓意：${interpretation}

                **要求**：
                1. 标题要吸引人，带emoji。
                2. 正文语气活泼、热情，多用emoji。
                3. 重点夸赞传统文化与科技的结合。
                4. 文末带上话题标签，如 #壮锦 #非遗创新 #AI艺术 #云端艺术馆。
                5. 不要输出多余的解释，直接输出文案内容。`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        temperature: 0.8,
        top_p: 0.7,
        max_tokens: 1024
      }
    });

    // @ts-ignore
    const content = response.choices[0].message.content;
    return { content };

  } catch (error) {
    console.error("AI generation failed:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate copywriting."
    });
  }
});