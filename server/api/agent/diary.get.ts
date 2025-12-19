import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = parseInt(query.userId as string);

  if (isNaN(userId)) {
    throw createError({ statusCode: 400, message: "Missing userId" });
  }

  const { dashscopeApiKey } = useRuntimeConfig();
  const API_KEY = dashscopeApiKey || "sk-94a41c1fbab646b7ad96f61f726a2385";
  const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

  try {
    // 1. 检索原始数据 (Agent 的“短期记忆”)
    const [logs, cards] = await Promise.all([
      prisma.pointLog.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 8
      }),
      prisma.userCard.findMany({
        where: { owner_id: userId },
        include: { CardTemplate: true },
        orderBy: { created_at: 'desc' },
        take: 3
      })
    ]);

    if (logs.length === 0) {
      return { content: "卷轴尚未展开，等待您播下第一枚文化种子..." };
    }

    // 2. 将数据格式化为 Agent 可理解的描述
    const logSummary = logs.map(l => `[${l.created_at.toLocaleDateString()}] ${l.reason} (${l.amount > 0 ? '+' : ''}${l.amount}pts)`).join('\n');
    const cardSummary = cards.map(c => `获得了稀有度为 ${c.CardTemplate.rarity} 的藏品《${c.CardTemplate.name}》`).join('\n');

    // 3. 调用 Agent 进行叙事化处理
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
            role: "system",
            content: "你是一位壮族史官和织造记录者。请将用户的行为日志（积分变动、获得藏品）转化为一段优美的、史诗感的、具有文学色彩的‘织梦日志’。使用‘你’来称呼用户，融合壮锦文化词汇（经纬、铜鼓、娅王、图腾）。字数控制在150字以内。"
          },
          {
            role: "user",
            content: `以下是我的传承足迹：\n${logSummary}\n${cardSummary}\n请为我撰写这一阶段的织梦日志。`
          }
        ],
        temperature: 0.8
      }
    });

    // @ts-ignore
    const content = response.choices[0].message.content;
    return { content };

  } catch (error: any) {
    console.error("Diary generation failed:", error);
    return { content: "史官正在沉思，请稍后再试..." };
  } finally {
    await prisma.$disconnect();
  }
});