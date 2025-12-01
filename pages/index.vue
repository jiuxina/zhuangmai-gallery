
<template>
  <div class="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-fabric-texture">
    
    <!-- 背景层 -->
    <div class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 opacity-20 mix-blend-multiply" :class="imageLoaded ? 'opacity-20' : 'opacity-0'" :style="{ backgroundImage: `url(${optimizedBingUrl})` }"></div>
    <img v-if="bing?.url" :src="optimizedBingUrl" class="hidden" @load="imageLoaded = true" />

    <!-- 顶部装饰 -->
    <div class="absolute top-0 left-0 w-full h-4 bg-indigo opacity-80" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #BC2F2E 10px, #BC2F2E 20px);"></div>
    <div class="absolute top-4 left-0 w-full h-1 bg-gold"></div>

    <!-- 音频开关 (方向四) -->
    <div class="absolute bottom-6 left-6 z-50">
      <button 
        @click="toggleAmbient" 
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-ink/20 hover:border-cinnabar bg-white/50 backdrop-blur-sm"
        :class="isAmbientPlaying ? 'text-cinnabar scale-110' : 'text-ink/40 grayscale'"
        title="沉浸白噪音 / Immersive Sound"
      >
        <span v-if="isAmbientPlaying" class="animate-pulse">🔊</span>
        <span v-else>🔇</span>
      </button>
      <audio ref="ambientRef" loop src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=river-113337.mp3" class="hidden"></audio>
    </div>

    <!-- 主体内容 -->
    <main class="z-10 text-center p-8 md:p-16 border-y-2 border-indigo/10 bg-paper/90 backdrop-blur-sm max-w-4xl mx-4 shadow-sm relative">
      <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cinnabar"></div>
      <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cinnabar"></div>
      <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cinnabar"></div>
      <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cinnabar"></div>

      <div class="opacity-0 animate-enter-slow" style="animation-delay: 0.1s">
        <div class="flex items-center justify-center gap-3 mb-6"><span class="h-[1px] w-8 bg-cinnabar"></span><p class="text-cinnabar tracking-[0.4em] text-sm uppercase font-bold">Vwnzva Cuengh AI</p><span class="h-[1px] w-8 bg-cinnabar"></span></div>
      </div>

      <div class="relative opacity-0 animate-enter-slow inline-block" style="animation-delay: 0.3s">
        <h1 class="font-calligraphy text-7xl md:text-9xl text-indigo mb-6 drop-shadow-sm select-none relative z-10">壮脉智承</h1>
        <div class="absolute -top-8 -right-8 md:-right-16 transform rotate-12 opacity-90 z-20"><div class="w-16 h-16 border-2 border-cinnabar rounded-sm flex flex-col items-center justify-center text-cinnabar font-serif leading-none shadow-sm bg-paper/80 backdrop-blur-sm"><span class="text-xs tracking-widest border-b border-cinnabar/50 mb-1 pb-1">云端</span><span class="text-xl font-bold">画馆</span></div></div>
      </div>

      <div class="opacity-0 animate-enter-slow" style="animation-delay: 0.5s"><p class="text-ink/60 text-lg md:text-xl font-serif tracking-[0.5em] mt-2 mb-8">非遗数字艺术空间</p></div>

      <div class="mt-8 mb-12 opacity-0 animate-enter-slow" style="animation-delay: 0.7s">
        <p class="text-ink leading-loose text-sm md:text-base font-serif max-w-lg mx-auto">
          <span class="text-cinnabar font-bold text-lg align-top">" </span>
          经纬交织，千年壮锦。<br class="mb-2 block" />在这里，传统纹样与人工智能相遇，共创属于未来的文化图腾。
          <span class="text-cinnabar font-bold text-lg align-bottom"> "</span>
        </p>
      </div>

      <div class="opacity-0 animate-enter-slow" style="animation-delay: 0.9s">
        <NuxtLink to="/gallery" class="inline-block px-12 py-3 bg-cinnabar text-white text-sm tracking-[0.3em] hover:bg-indigo transition-colors duration-300 shadow-md rounded-sm font-bold">开启画廊</NuxtLink>
      </div>
    </main>

    <!-- 底部 -->
    <div class="absolute bottom-6 opacity-0 animate-enter-fast w-full text-center space-y-4" style="animation-delay: 1.2s">
      <div class="w-1 h-8 bg-indigo/20 mx-auto"></div>
      <div v-if="bing?.copyright" class="px-4"><p class="text-[10px] text-ink/30 font-serif tracking-wide border-b border-ink/5 inline-block pb-1">Bing Wallpaper: {{ bing.copyright }}</p></div>
    </div>
    
    <div class="absolute bottom-4 left-0 w-full h-1 bg-gold"></div>
    <div class="absolute bottom-0 left-0 w-full h-4 bg-indigo opacity-80" style="background-image: repeating-linear-gradient(-45deg, transparent, transparent 10px, #BC2F2E 10px, #BC2F2E 20px);"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const imageLoaded = ref(false)
const { data: bing } = await useFetch('/api/bing', { lazy: true, server: false })
const optimizedBingUrl = computed(() => {
  const url = bing.value?.url
  if (!url) return ''
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=1920&q=70&output=webp&n=-1`
})

// 音频逻辑
const ambientRef = ref<HTMLAudioElement | null>(null)
const isAmbientPlaying = ref(false)
const toggleAmbient = () => {
  if (!ambientRef.value) return
  if (isAmbientPlaying.value) {
    ambientRef.value.pause()
    isAmbientPlaying.value = false
  } else {
    ambientRef.value.volume = 0.3 // 低音量白噪音
    ambientRef.value.play().catch(() => alert('请先与页面交互'))
    isAmbientPlaying.value = true
  }
}
</script>