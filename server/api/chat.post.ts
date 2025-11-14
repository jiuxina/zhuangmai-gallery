import { type ParsedEvent, createParser } from 'eventsource-parser';

export default defineEventHandler(async (event) => {
  // 从客户端请求中获取消息历史
  const { messages } = await readBody(event);

  // 获取安全存储在服务器端的配置
  const { fastGptApiKey, fastGptApiBase } = useRuntimeConfig();

  // 基于行业标准，猜测API的端点和请求体格式
  const payload = {
    messages: messages,
    stream: true, // 我们需要流式响应来实现“打字机”效果
    // model: "gpt-3.5-turbo", // 如果需要，可以指定模型
  };

  const response = await fetch(`${fastGptApiBase}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${fastGptApiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw createError({
      statusCode: response.status,
      statusMessage: `FastGPT API Error: ${errorBody}`,
    });
  }

  // 创建一个可读流，用于将FastGPT的响应实时传递给客户端
  const readableStream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | any) => {
        if (event.type === 'event') {
          const data = event.data;
          if (data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || '';
            controller.enqueue(new TextEncoder().encode(text));
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);
      for await (const chunk of response.body as any) {
        parser.feed(new TextDecoder().decode(chunk));
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
});