
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-fabric-texture text-ink p-6 text-center">
    
    <div class="mb-8 w-32 h-32 border-4 border-cinnabar rounded-full flex items-center justify-center opacity-90 relative">
      <div class="absolute inset-0 border-2 border-indigo rounded-full scale-90 opacity-50"></div>
      <span class="font-calligraphy text-6xl text-cinnabar">误</span>
    </div>

    <h1 class="font-calligraphy text-5xl mb-4 text-indigo">
      {{ error.statusCode === 404 ? '找不到页面啦' : '云深不知处' }}
    </h1>

    <div class="max-w-md space-y-6 mb-12">
      <p class="text-lg text-ink/70 italic font-serif leading-relaxed">
        “{{ error.message || '前路漫漫，似有迷雾遮眼。' }}”
      </p>
      
      <div class="bg-white p-6 shadow-sm border-t-4 border-gold text-left text-sm space-y-3">
        <p class="font-bold text-cinnabar tracking-widest uppercase text-xs border-b border-ink/10 pb-2">Possible Reasons</p>
        <ul class="list-disc list-inside text-ink/70 space-y-1 font-serif">
          <li v-if="error.statusCode === 404">您寻找的文化瑰宝可能已被收藏或移动。</li>
          <li v-else>文创商店暂未接入第三方支付系统（演示模式）。</li>
          <li>云端服务器正在进行非遗数据维护。</li>
        </ul>
      </div>
    </div>

    <button 
      @click="handleError"
      class="px-10 py-3 bg-indigo text-white transition-all hover:bg-cinnabar font-bold tracking-[0.2em] shadow-lg hover:-translate-y-1"
    >
      返回画廊
    </button>
    
    <div class="mt-16 w-full max-w-xs h-[1px] bg-ink/10 mx-auto"></div>
    <div class="mt-4 text-xs text-ink/30 tracking-widest font-mono">
      ERROR CODE: {{ error.statusCode }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>