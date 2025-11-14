<template>
  <div class="flex flex-col h-[85vh] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <!-- 欢迎信息 -->
    <div v-if="messages.length === 0" class="flex-grow flex flex-col justify-center items-center">
      <div class="font-serif text-4xl font-bold text-primary opacity-80">壮脉智承</div>
      <p class="mt-4 text-text-light dark:text-gray-400">智能对话，即刻开始</p>
    </div>

    <!-- 聊天记录 -->
    <div v-else ref="chatHistory" class="flex-grow p-6 space-y-6 overflow-y-auto">
      <div v-for="(message, index) in messages" :key="index" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
        <div class="max-w-lg px-4 py-3 rounded-xl" :class="message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-text-main dark:text-gray-200'">
          <div class="prose dark:prose-invert max-w-none" v-html="renderMarkdown(message.content)"></div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="relative">
        <textarea
          v-model="userInput"
          @keydown.enter.prevent="sendMessage"
          :disabled="isLoading"
          class="w-full p-4 pr-16 text-text-main bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="请输入您的问题..."
          rows="1"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="isLoading || !userInput.trim()"
          class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white transition-colors"
          :class="isLoading || !userInput.trim() ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.0001V4.00006L21 12.0001L3 20.0001Z"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const userInput = ref('');
const messages = ref<Message[]>([]);
const isLoading = ref(false);
const chatHistory = ref<HTMLElement | null>(null);

const md = new MarkdownIt({ html: true });
const renderMarkdown = (content: string) => md.render(content);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatHistory.value) {
      chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  const trimmedInput = userInput.value.trim();
  if (!trimmedInput || isLoading.value) return;

  messages.value.push({ role: 'user', content: trimmedInput });
  userInput.value = '';
  isLoading.value = true;
  scrollToBottom();

  messages.value.push({ role: 'assistant', content: '...' });
  scrollToBottom();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages.value.slice(0, -1) }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantResponse = '';
    messages.value[messages.value.length - 1].content = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      assistantResponse += decoder.decode(value, { stream: true });
      messages.value[messages.value.length - 1].content = assistantResponse;
      scrollToBottom();
    }
  } catch (error) {
    console.error('Error fetching chat response:', error);
    messages.value[messages.value.length - 1].content = '抱歉，加载回答时遇到问题，请重试。';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 美化滚动条 */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

/* 确保prose插件不会限制子元素的宽度 */
.prose {
  max-width: none;
}

/* 关键修改：为动态渲染的图片设置样式 */
:deep(.prose img) {
  /* 将宽度固定为8rem，大约是lg(32rem)的四分之一 */
  width: 8rem; 
  height: auto; /* 高度自动，保持图片原始比例 */
  border-radius: 0.5rem; /* 为图片添加圆角 */
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>