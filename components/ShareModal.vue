
<template>
  <div class="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-indigo/80 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- 主体卡片 -->
    <div class="bg-paper w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[85vh] border-t-4 border-gold">
      
      <!-- 左侧：图片预览 -->
      <div class="w-full md:w-2/5 bg-gray-100 relative min-h-[200px] md:min-h-full group border-r border-ink/5">
        <img 
          :src="imageUrl" 
          class="w-full h-full object-cover absolute inset-0" 
          @error="handleImageError"
        />
        <div class="absolute inset-0 bg-indigo/20 mix-blend-multiply"></div>
        <!-- 装饰文本 -->
        <div class="absolute bottom-6 left-6 text-white font-serif tracking-widest drop-shadow-md">
           <div class="text-xs opacity-70 mb-1 border-b border-white/30 pb-1 inline-block">AI Vah</div>
           <div class="text-xl font-bold leading-tight truncate w-32">{{ title }}</div>
        </div>
      </div>

      <!-- 右侧：AI 文案 -->
      <div class="w-full md:w-3/5 p-8 flex flex-col relative bg-fabric-texture">
        <button @click="$emit('close')" class="absolute top-4 right-4 text-ink/30 hover:text-cinnabar transition-colors z-20 text-2xl leading-none">×</button>

        <div class="mb-6">
          <h3 class="font-calligraphy text-3xl text-indigo mb-2">灵感分享</h3>
          <p class="text-xs text-cinnabar font-bold tracking-widest uppercase">AI Copywriting</p>
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="flex-1 flex flex-col items-center justify-center space-y-4 min-h-[200px]">
          <div class="spinner-zhuang"></div>
          <p class="text-sm text-ink/50 animate-pulse font-serif italic">笔墨挥毫中...</p>
        </div>

        <!-- 结果展示 -->
        <div v-else-if="resultText" class="flex-1 flex flex-col min-h-0">
          <div class="flex-1 overflow-y-auto bg-white p-5 border border-ink/5 text-sm leading-loose text-ink/80 font-serif whitespace-pre-wrap mb-6 shadow-inner custom-scrollbar text-justify">
            {{ cleanResultText }}
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- 复制按钮 -->
            <button 
              @click="copyText" 
              class="py-3 bg-cinnabar text-white hover:bg-indigo transition-colors text-sm tracking-widest flex items-center justify-center space-x-2 font-bold shadow-sm"
            >
              <span v-if="copied">✓ 已复制</span>
              <span v-else>复制文案</span>
            </button>

            <!-- 下载按钮 -->
            <button 
              @click="downloadImage" 
              class="py-3 border border-ink/20 text-ink hover:border-indigo hover:text-indigo transition-colors text-sm tracking-widest flex items-center justify-center space-x-2 font-bold bg-white"
            >
              <span>⬇ 保存图片</span>
            </button>
          </div>
        </div>

        <!-- 错误展示 -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-4">
          <p class="text-cinnabar mb-2 font-bold">生成中断</p>
          <p class="text-xs text-ink/50 mb-6">{{ errorMsg }}</p>
          <button @click="generateCopy" class="text-sm border-b border-ink/30 text-ink hover:text-cinnabar hover:border-cinnabar pb-0.5">重试</button>
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

const handleImageError = (e: Event) => {
  console.warn('Share image failed to load:', props.imageUrl);
}

const cleanResultText = computed(() => {
  if (!resultText.value) return '';
  return resultText.value
    .replace(/^```(markdown)?/i, '')
    .replace(/```$/i, '')
    .trim();
})

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

const copyText = () => {
  if (!cleanResultText.value) return
  navigator.clipboard.writeText(cleanResultText.value).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  })
}

const downloadImage = async () => {
  try {
    const response = await fetch(props.imageUrl);
    if (!response.ok) throw new Error('Network response was not ok');
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
    window.open(props.imageUrl, '_blank');
  }
}

onMounted(() => {
  generateCopy()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
}
</style>