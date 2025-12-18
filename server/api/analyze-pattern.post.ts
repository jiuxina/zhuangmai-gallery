
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { imageUrl } = body;

  if (!imageUrl) {
    throw createError({ statusCode: 400, message: "Missing imageUrl" });
  }

  const { dashscopeApiKey } = useRuntimeConfig();
  const API_KEY = dashscopeApiKey || "sk-94a41c1fbab646b7ad96f61f726a2385";
  const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

  try {
    console.log('🤖 Preparing image for Ali DashScope AI...');
    
    // 始终将图片转换为 Base64，确保阿里云能稳定接收
    let base64Content = imageUrl;
    
    if (!imageUrl.startsWith('data:image')) {
      console.log('📥 Downloading image for Base64 conversion...');
      const imageBuffer = await $fetch(imageUrl, { responseType: 'arrayBuffer' });
      const base64Image = Buffer.from(imageBuffer as ArrayBuffer).toString('base64');
      // 默认假设为 jpeg，实际 qwen 模型对 mime type 并不敏感
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
                type: "image_url",
                image_url: { url: base64Content }
              },
              {
                type: "text",
                text: `你是一位壮族非遗文化研究专家。请分析这张壮锦艺术图片，识别其中的纹样结构和文化寓意。
                请务必返回 **纯 JSON 格式** 的数据，不要包含任何 Markdown 标记（如 \`\`\`json）。
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
              }
            ]
          }
        ],
        stream: false 
      }
    });

    // @ts-ignore
    let content = response.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(content);

  } catch (error: any) {
    console.error("Pattern analysis failed:", error.data || error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: "Failed to analyze pattern.",
      message: error.data?.error?.message || error.message
    });
  }
});
