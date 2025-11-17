<template>
  <div class="flex flex-col h-[85vh] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <!-- 聊天记录 -->
    <div ref="chatHistory" class="flex-grow p-6 space-y-6 overflow-y-auto">
      <div v-for="(message, index) in messages" :key="index" class="flex items-start gap-2" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
        <button v-if="message.role === 'assistant' && message.content && !isLoading" @click="playText(message.content)" class="mt-2 text-gray-400 hover:text-primary flex-shrink-0">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm13.5 6L9 14.5V5.5L17.5 10z"></path></svg>
        </button>
        <div class="max-w-lg px-4 py-3 rounded-xl" :class="message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-text-main dark:text-gray-200'">
          <div class="prose dark:prose-invert max-w-none" v-html="renderMarkdown(message.content)"></div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
      <InputGuide :guides="inputGuides" @select="handleGuideSelect" />
      <div v-if="isUploading" class="text-sm text-gray-500 mb-2">正在上传文件...</div>
      <div v-if="uploadedFileId" class="text-sm text-green-600 mb-2">✓ 文件已关联，可以开始提问。</div>
      <div class="relative">
        <textarea v-model="userInput" @keydown.enter.prevent="() => sendMessage()" :disabled="isLoading" class="w-full p-4 pr-32 text-text-main bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="请输入您的问题..." rows="1"></textarea>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <input type="file" ref="fileInput" @change="uploadFile" class="hidden" />
          <button @click="triggerFileUpload" title="上传文件" class="p-2 text-gray-500 hover:text-primary"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V7a1 1 0 00-1-1H6z" clip-rule="evenodd"></path></svg></button>
          <button @click="toggleSpeechRecognition" title="语音输入" class="p-2" :class="isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-primary'"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7v1h6v-1h-2v-2.07z" clip-rule="evenodd"></path></svg></button>
          <button @click="() => sendMessage()" :disabled="isLoading || !userInput.trim()" class="p-2 rounded-full text-white" :class="isLoading || !userInput.trim() ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.0001V4.00006L21 12.0001L3 20.0001Z"></path></svg></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import MarkdownIt from 'markdown-it';
// 关键：引入我们需要的专业解析器
import { createParser, type ParsedEvent } from 'eventsource-parser';
import InputGuide from '~/components/InputGuide.vue';

interface Message { role: 'user' | 'assistant'; content: string; }

// --- 状态管理 ---
const userInput = ref('');
const messages = ref<Message[]>([]);
const inputGuides = ref<string[]>([]);
const isLoading = ref(false);
const chatHistory = ref<HTMLElement | null>(null);
const uploadedFileId = ref<string | null>(null);
const isUploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const flowVariables = ref<Record<string, any>>({
  part1question: "", knowledge: "", knowend: "", wenan_name: "", wenan_url: "",
  wenan_list: "", wenan_choose: "", userchoosewenyan: "", img_url: "", flows_control: -1,
});

const md = new MarkdownIt({ html: true });
const renderMarkdown = (content: string) => md.render(content);
const scrollToBottom = () => nextTick(() => chatHistory.value?.scrollTo({ top: chatHistory.value.scrollHeight, behavior: 'smooth' }));

// --- 核心通信函数 (使用 eventsource-parser) ---
const startChatStream = async (body: object) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.body) throw new Error('Response has no body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    // 创建一个解析器实例
    const parser = createParser((event: ParsedEvent | any) => {
      if (event.type === 'event') {
        // 处理自定义的 'variables' 事件
        if (event.name === 'variables') {
          try {
            const newVars = JSON.parse(event.data);
            flowVariables.value = { ...flowVariables.value, ...newVars };
            console.log('Flow variables updated:', flowVariables.value);
          } catch (e) {
            console.error('Failed to parse variables event', e);
          }
        } 
        // 处理默认的 'message' 事件
        else if (event.data) {
          try {
            const data = JSON.parse(event.data);
            if (data.text) {
              messages.value[messages.value.length - 1].content += data.text;
              scrollToBottom();
            }
          } catch (e) {
            // 忽略非JSON数据
          }
        }
      }
    });

    // 持续读取并解析数据流
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      parser.feed(chunk); // 将每个数据块喂给解析器
    }

  } catch (error) {
    console.error('Fetch stream error:', error);
    if (messages.value.length > 0) {
      messages.value[messages.value.length - 1].content = '抱歉，连接时发生错误。';
    }
  } finally {
    isLoading.value = false;
  }
};


// --- 开场白逻辑 ---
onMounted(() => {
  if (messages.value.length === 0) {
    isLoading.value = true;
    messages.value.push({ role: 'assistant', content: '' });
    startChatStream({ messages: [], variables: flowVariables.value });
  }
});

// --- 发送消息逻辑 ---
const sendMessage = (contentOverride?: string) => {
  const content = (contentOverride || userInput.value).trim();
  if (!content || isLoading.value) return;

  messages.value.push({ role: 'user', content });
  userInput.value = '';
  isLoading.value = true;
  scrollToBottom();
  inputGuides.value = [];
  messages.value.push({ role: 'assistant', content: '' });
  scrollToBottom();

  startChatStream({
    messages: messages.value.slice(0, -1),
    fileId: uploadedFileId.value,
    variables: flowVariables.value,
  });

  uploadedFileId.value = null;
};

// ... 此处省略文件上传、语音输入/播放、输入引导等函数，它们保持不变 ...
const triggerFileUpload = () => fileInput.value?.click();
const uploadFile = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Upload failed');
    const result = await response.json();
    uploadedFileId.value = result.id;
  } catch (error) {
    console.error(error);
    alert('文件上传失败！');
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
};
const isListening = ref(false);
let recognition: any;
if (process.client) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'zh-CN';
    recognition.onresult = (event: any) => { userInput.value = event.results[0][0].transcript; sendMessage(); };
    recognition.onerror = (event: any) => { console.error(event.error); isListening.value = false; };
    recognition.onend = () => { isListening.value = false; };
  }
}
const toggleSpeechRecognition = () => {
  if (!recognition) return alert('浏览器不支持语音识别');
  isListening.value ? recognition.stop() : recognition.start();
  isListening.value = !isListening.value;
};
const playText = (text: string) => {
  if (process.client && 'speechSynthesis' in window) {
    const cleanText = text.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } else {
    alert('浏览器不支持语音播放');
  }
};
const handleGuideSelect = (guide: string) => {
  sendMessage(guide);
};

onUnmounted(() => {
  // No EventSource to close here, as fetch stream handles itself
});
</script>

<style scoped>
:deep(.prose img) {
  width: 8rem; 
  height: auto;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>