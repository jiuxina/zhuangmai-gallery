<script setup>
const props = defineProps({
  isOpen: Boolean,
  artwork: Object
});

const emit = defineEmits(['close']);

// 状态管理
const loading = ref(false);
const resultText = ref('');
const errorMsg = ref('');
let abortController = null; // 用于取消请求

// 监听弹窗打开，一旦打开就开始生成
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    resultText.value = '';
    errorMsg.value = '';
    loading.value = true;
    await generateCopywriting();
  } else {
    // 如果关闭弹窗，尝试取消正在进行的请求
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  }
});

// 调用 AI 生成文案
const generateCopywriting = async () => {
  abortController = new AbortController();
  
  try {
    const data = await $fetch('/api/generate-share', {
      method: 'POST',
      body: {
        imageUrl: props.artwork.imageUrl,
        title: props.artwork.title,
        interpretation: props.artwork.interpretation
      },
      signal: abortController.signal
    });
    resultText.value = data.content;
    loading.value = false;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Generation aborted');
    } else {
      errorMsg.value = '生成失败，请稍后重试。';
      loading.value = false;
    }
  }
};

// 一键复制功能
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(resultText.value);
    alert('文案已复制到剪贴板！');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

// 下载图片功能
const downloadImage = async () => {
  try {
    // 使用 fetch 获取图片 blob，解决跨域下载问题
    const response = await fetch(props.artwork.imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.artwork.title}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download failed:', err);
    window.open(props.artwork.imageUrl, '_blank'); // 降级方案：新窗口打开
  }
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <!-- 黑色半透明背景 -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>

    <!-- 弹窗主体 -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
      
      <!-- 头部 -->
      <div class="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 class="text-lg font-bold text-gray-800">✨ 生成分享卡片</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="p-6 overflow-y-auto flex-1">
        
        <!-- 状态 1: 正在生成 -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12 space-y-6">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center text-2xl">🪄</div>
          </div>
          <p class="text-lg text-gray-600 animate-pulse">AI 正在为您撰写小红书笔记...</p>
          <button @click="closeModal" class="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-full transition">取消生成</button>
        </div>

        <!-- 状态 2: 生成成功 -->
        <div v-else-if="resultText" class="flex flex-col md:flex-row gap-6">
          <!-- 左侧：图片预览 -->
          <div class="w-full md:w-1/2">
            <img :src="artwork.imageUrl" class="w-full rounded-lg shadow-md object-cover aspect-[3/4]">
            <button @click="downloadImage" class="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              保存图片
            </button>
          </div>
          
          <!-- 右侧：文案 -->
          <div class="w-full md:w-1/2 flex flex-col">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 h-64 md:h-auto overflow-y-auto">
              {{ resultText }}
            </div>
            <button @click="copyToClipboard" class="mt-4 w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
              一键复制文案
            </button>
          </div>
        </div>

        <!-- 状态 3: 错误 -->
        <div v-else class="text-center py-10">
          <p class="text-red-500 mb-4">{{ errorMsg }}</p>
          <button @click="closeModal" class="text-primary hover:underline">关闭</button>
        </div>

      </div>
    </div>
  </div>
</template>