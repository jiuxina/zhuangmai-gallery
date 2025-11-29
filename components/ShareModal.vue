<template>
  <div class="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- 主体卡片 -->
    <div class="bg-paper w-full max-w-2xl rounded-lg shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
      
      <!-- 左侧：图片预览 -->
      <div class="w-full md:w-2/5 bg-gray-100 relative min-h-[200px] md:min-h-full group">
        <img :src="imageUrl" class="w-full h-full object-cover absolute inset-0" />
        <div class="absolute inset-0 bg-black/10"></div>
        <!-- 装饰文本 -->
        <div class="absolute bottom-4 left-4 text-white font-serif tracking-widest drop-shadow-md">
           <div class="text-xs opacity-80">AI Vah</div>
           <div class="text-lg truncate w-40">{{ title }}</div>
        </div>
      </div>

      <!-- 右侧：AI 文案 -->
      <div class="w-full md:w-3/5 p-6 flex flex-col relative">
        <button @click="$emit('close')" class="absolute top-4 right-4 text-ink/30 hover:text-cinnabar transition-colors z-20">✕</button>

        <h3 class="font-calligraphy text-2xl text-ink mb-2">✨ 灵感分享</h3>
        <p class="text-xs text-ink/40 mb-4">AI 正在为您撰写小红书笔记...</p>

        <!-- 加载中 -->
        <div v-if="loading" class="flex-1 flex flex-col items-center justify-center space-y-4 min-h-[200px]">
          <div class="w-12 h-12 border-2 border-cinnabar/20 border-t-cinnabar rounded-full animate-spin"></div>
          <p class="text-sm text-ink/60 animate-pulse font-serif">笔墨挥毫中...</p>
        </div>

        <!-- 结果展示 -->
        <div v-else-if="resultText" class="flex-1 flex flex-col min-h-0">
          <div class="flex-1 overflow-y-auto bg-white/50 p-4 rounded border border-ink/5 text-sm leading-relaxed text-ink/80 font-sans whitespace-pre-wrap mb-4 shadow-inner custom-scrollbar">
            {{ cleanResultText }}
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <!-- 复制按钮 -->
            <button 
              @click="copyText" 
              class="py-2 bg-ink text-white rounded hover:bg-cinnabar transition-colors text-sm tracking-widest flex items-center justify-center space-x-2"
            >
              <span v-if="copied">✓ 已复制</span>
              <span v-else>复制文案</span>
            </button>

            <!-- 下载按钮 (新增) -->
            <button 
              @click="downloadImage" 
              class="py-2 border border-ink text-ink rounded hover:bg-ink/5 transition-colors text-sm tracking-widest flex items-center justify-center space-x-2"
            >
              <span>⬇ 保存图片</span>
            </button>
          </div>
        </div>

        <!-- 错误展示 -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-4">
          <p class="text-cinnabar mb-2">生成失败</p>
          <p class="text-xs text-ink/50 mb-4">{{ errorMsg }}</p>
          <button @click="generateCopy" class="text-sm underline text-ink">重试</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  imageUrl: string
  title: string
  interpretation: string
}>()

const emit = defineEmits(['close'])

const loading = ref(true)
const resultText = ref('')
const errorMsg = ref('')
const copied = ref(false)

// 清洗 AI 返回的 Markdown 代码块符号
const cleanResultText = computed(() => {
  if (!resultText.value) return '';
  return resultText.value
    .replace(/^```(markdown)?/i, '') // 去除开头的 ``` 或 ```markdown
    .replace(/```$/i, '')            // 去除结尾的 ```
    .trim();                         // 去除首尾空格
})

// 调用 API 生成文案
const generateCopy = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const { content } = await $fetch('/api/generate-share', {
      method: 'POST',
      body: {
        imageUrl: props.imageUrl,
        title: props.title,
        interpretation: props.interpretation
      }
    })
    resultText.value = content
  } catch (err: any) {
    errorMsg.value = err.message || '网络连接波动，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 复制功能
const copyText = () => {
  if (!cleanResultText.value) return
  navigator.clipboard.writeText(cleanResultText.value).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  })
}

// 下载图片功能
const downloadImage = async () => {
  try {
    // 尝试 fetch 图片转化为 blob 下载 (解决部分跨域问题)
    const response = await fetch(props.imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zhuang-heritage-${props.title || 'art'}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    // 如果 fetch 失败 (CORS 严格限制)，则在新窗口打开图片让用户右键保存
    window.open(props.imageUrl, '_blank');
  }
}

onMounted(() => {
  generateCopy()
})
</script>

<style scoped>
/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}
</style>