import { type ParsedEvent, createParser } from 'eventsource-parser';

export default defineEventHandler(async (event) => {
  const { messages = [], variables, fileId } = await readBody(event);
  const { fastGptApiKey, fastGptApiBase } = useRuntimeConfig();

  const payload: any = {
    messages: messages,
    stream: true,
    variables: variables, // 传递全局变量
  };
  
  // 将 fileId 附加到最新一条用户消息中
  if (fileId && messages.length > 0) {
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role === 'user') {
      // 假设API需要 files 字段
      lastUserMessage.files = [{ type: 'file', file_id: fileId }];
    }
  }

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
    throw createError({ statusCode: response.status, statusMessage: `FastGPT API Error: ${errorBody}` });
  }

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
            // 假设 choice 结构
            const text = json.choices[0].delta?.content || '';
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
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
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
});