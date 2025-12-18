
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { imageUrl, title, interpretation } = body;

  if (!imageUrl) {
    throw createError({ statusCode: 400, message: "Missing imageUrl" });
  }

  const { dashscopeApiKey } = useRuntimeConfig();
  const API_KEY = dashscopeApiKey || "sk-94a41c1fbab646b7ad96f61f726a2385";
  const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

  try {
    console.log('🤖 Preparing image for Ali DashScope AI...');
    
    let base64Content = imageUrl;
    
    if (!imageUrl.startsWith('data:image')) {
      console.log('📥 Downloading image for Base64 conversion...');
      const imageBuffer = await $fetch(imageUrl, { responseType: 'arrayBuffer' });
      const base64Image = Buffer.from(imageBuffer as ArrayBuffer).toString('base64');
      base64Content = `data:image/jpeg;base64,${base64Image}`;
      console.log('✅ Image converted to Base64');
    }

    console.log('🚀 Calling AI API...');
    const response = await $fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: {
        model: "qwen3-vl-30b-a3b-instruct",
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
                  url: base64Content
                }
              }
            ]
          }
        ],
        temperature: 0.8,
        top_p: 0.7,
        max_tokens: 1024,
        stream: false
      }
    });

    // @ts-ignore
    const content = response.choices[0].message.content;
    return { content };

  } catch (error: any) {
    console.error("AI generation failed:", error.data || error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: "Failed to generate copywriting.",
      message: error.data?.error?.message || error.message
    });
  }
});
