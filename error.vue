<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-paper text-ink p-6 text-center">
    <!-- 装饰性元素 -->
    <div class="mb-8 w-24 h-24 border-2 border-cinnabar rounded-full flex items-center justify-center opacity-80">
      <span class="font-calligraphy text-5xl text-cinnabar">误</span>
    </div>

    <h1 class="font-calligraphy text-4xl mb-4 text-ink">
      {{ error.statusCode === 404 ? '找不到界面啦' : '云深不知处' }}
    </h1>

    <div class="max-w-md space-y-4 mb-12">
      <p class="text-lg text-ink/80 italic font-serif">
        “{{ error.message || '前路漫漫，似有迷雾遮眼。' }}”
      </p>
      
      <div class="bg-white/50 p-6 rounded border border-ink/10 text-left text-sm space-y-2">
        <p class="font-bold text-cinnabar">可能的原因：</p>
        <ul class="list-disc list-inside text-ink/70 space-y-1">
          <li v-if="error.statusCode === 404">您寻找的文化瑰宝可能已被收藏或移动。</li>
          <li v-else>文创商店暂未接入第三方支付系统（演示模式）。</li>
          <li>云端服务器正在进行非遗数据维护。</li>
          <li>网络连接穿越时空时发生了波动。</li>
        </ul>
      </div>

      <!-- 开发环境详情 -->
      <div v-if="devMode && error.stack" class="text-xs text-left overflow-auto max-h-32 bg-gray-100 p-2 rounded mt-4">
        {{ error.stack }}
      </div>
    </div>

    <button 
      @click="handleError"
      class="group relative px-8 py-3 bg-ink text-paper transition-all hover:bg-cinnabar"
    >
      <span class="relative z-10 tracking-[0.2em]">返回画廊</span>
      <div class="absolute inset-0 border border-ink transform translate-x-1 translate-y-1 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
    </button>
    
    <div class="mt-12 text-xs text-ink/40 tracking-widest">
      © 2025 壮脉智承 · 错误代码 {{ error.statusCode }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})

const devMode = process.dev

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>