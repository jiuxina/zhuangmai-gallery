import { prisma } from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId } = body;

  const { dashscopeApiKey } = useRuntimeConfig();
  const API_KEY = dashscopeApiKey || "sk-94a41c1fbab646b7ad96f61f726a2385";
  const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

  if (!userId) return { success: false, message: "Guest Mode" };

  try {
    // 1. 搜集用户的审美碎片
    const [myWorks, myInteractions] = await Promise.all([
      prisma.community_gallery.findMany({ 
        where: { owner_id: userId }, 
        take: 10, 
        select: { id: true, user_theme: true } 
      }),
      prisma.interaction.findMany({ 
        where: { user_id: userId, type: 'like' }, 
        take: 10, 
        include: { community_gallery: { select: { id: true, user_theme: true } } } 
      })
    ]);

    // 2. 构造数据列表供 Agent 挑选
    const candidates = [...myWorks, ...myInteractions.map(i => i.community_gallery)];
    const candidateData = candidates.map(c => `ID:${c.id}(主题:${c.user_theme})`).join('; ');

    // 3. 策展 Agent 决策
    const response = await $fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: {
        model: "qwen3-vl-30b-a3b-instruct",
        messages: [
          {
            role: "system",
            content: `你是一位国家级非遗策展人。请根据用户以往的审美数据，策划一个个人专题展。
            要求：
            1. 从给出的候选列表中，挑选出最符合你策划主题的 3 个作品 ID。
            2. 输出纯 JSON 格式：
            {
              "exhibition_title": "展览标题",
              "curator_note": "策展词（50字以内）",
              "focus_keywords": ["关键词1", "关键词2"],
              "theme_color": "十六进制颜色",
              "recommended_ids": [ID1, ID2, ID3]
            }`
          },
          {
            role: "user",
            content: `这是我的审美候选作品：${candidateData || '暂无数据'}`
          }
        ],
        response_format: { type: "json_object" }
      }
    });

    // @ts-ignore
    const curation = JSON.parse(response.choices[0].message.content);
    return { success: true, curation };

  } catch (error) {
    console.error("Curator Agent failed:", error);
    return { 
      success: false, 
      curation: {
        exhibition_title: "万象壮锦·社区巡礼",
        curator_note: "每一根丝线都承载着千年的记忆，欢迎来到壮锦的数字殿堂。",
        focus_keywords: ["传承", "万象"],
        theme_color: "#BC2F2E",
        recommended_ids: []
      }
    };
  }
});