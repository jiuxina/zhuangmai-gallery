import { prisma } from '~/server/utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { artworkId, userId } = body;

  const { dashscopeApiKey } = useRuntimeConfig();
  const API_KEY = dashscopeApiKey || "sk-94a41c1fbab646b7ad96f61f726a2385";
  const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

  const APPRAISE_COST = 100; // 鉴定费用

  try {
    // 1. 基础检查
    const [user, artwork] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.community_gallery.findUnique({ where: { id: artworkId } })
    ]);

    if (!user || !artwork) throw createError({ statusCode: 404, message: "数据不存在" });
    if (user.points < APPRAISE_COST) throw createError({ statusCode: 402, message: "积分不足以支付鉴定费" });

    // 2. 准备图片数据 (Base64)
    let imageUrl = artwork.art_image_url;
    if (!imageUrl.startsWith('data:image')) {
      const buffer = await $fetch(imageUrl, { responseType: 'arrayBuffer' });
      imageUrl = `data:image/jpeg;base64,${Buffer.from(buffer as ArrayBuffer).toString('base64')}`;
    }

    // 3. 扣费与记账 (事务)
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { points: { decrement: APPRAISE_COST } } }),
      prisma.pointLog.create({
        data: { user_id: userId, amount: -APPRAISE_COST, type: 'expense', reason: `专家鉴定耗费: 《${artwork.user_theme}》` }
      })
    ]);

    // 4. 调用多模态 Agent
    const response = await $fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: {
        model: "qwen-vl-plus",
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: imageUrl } },
              { type: "text", text: `你是一位壮锦非遗鉴定专家。请从“文化深度、构图精细度、色彩调和”三个维度评价这幅作品（每项10分）。
                最后根据综合表现，给出最终稀有度（SSR代表惊世之作，SR代表精品，R代表普通）。
                请务必返回纯 JSON 格式：
                {
                  "scores": { "culture": 8, "detail": 9, "color": 7 },
                  "rarity": "SSR",
                  "comment": "专家短评（30字以内）",
                  "seal_code": "唯一鉴定编号"
                }`
              }
            ]
          }
        ]
      }
    });

    // @ts-ignore
    let content = response.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const appraisalResult = JSON.parse(content);

    // 5. 将鉴定结果持久化到数据库
    await prisma.community_gallery.update({
      where: { id: artworkId },
      data: { appraisal_data: JSON.stringify(appraisalResult) }
    });

    return { success: true, appraisal: appraisalResult, remainingPoints: user.points - APPRAISE_COST };

  } catch (error: any) {
    console.error("Appraisal Agent error:", error);
    throw createError({ statusCode: 500, message: "鉴定服务繁忙" });
  }
});