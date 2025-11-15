import { type ParsedEvent, createParser } from 'eventsource-parser';

export default defineEventHandler(async (event) => {
  const { messages = [], variables, fileId } = await readBody(event);
  const { fastGptApiKey, fastGptApiBase } = useRuntimeConfig();

  const payload: any = {
    messages: messages,
    stream: true,
    variables: variables,
  };
  
  if (fileId && messages.length > 0) {
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role === 'user') {
      lastUserMessage.files = [{ type: 'file', file_id: fileId }];
    }
  }

  const response = await fetch(`${fastGptApiBase}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${fastGptApiKey}` },
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

            // 关键逻辑：检查并回传更新后的变量
            // 假设 FastGPT 在 delta.tool_calls 中回传变量
            if (json.choices[0].delta?.tool_calls?.type === 'workflow') {
              const variablesData = json.choices[0].delta.tool_calls.data;
              if (variablesData) {
                // 发送一个名为 'variables' 的自定义 SSE 事件
                controller.enqueue(new TextEncoder().encode(`event: variables\ndata: ${JSON.stringify(variablesData)}\n\n`));
              }
              return; // 这是一个非内容事件，处理后直接返回
            }

            const text = json.choices[0].delta?.content || '';
            if (text) {
              // 发送标准的、匿名的 message 事件
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          } catch (e) {
            // 忽略JSON解析错误，因为FastGPT有时会发送非JSON的元数据
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