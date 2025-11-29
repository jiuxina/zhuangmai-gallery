<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-paper relative overflow-hidden">
    
    <!-- 1. Bing 壁纸层 (性能优化版) -->
    <!-- 使用 transition-opacity 实现图片加载后的淡入，避免闪烁 -->
    <div 
      class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
      :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
      :style="{ backgroundImage: `url(${optimizedBingUrl})` }"
    ></div>
    
    <!-- 隐藏 img 用于监听加载完毕 -->
    <img 
      v-if="bing?.url" 
      :src="optimizedBingUrl" 
      class="hidden" 
      @load="imageLoaded = true" 
    />

    <!-- 2. 宣纸遮罩层 (性能优化：移除 backdrop-blur) -->
    <!-- 直接使用高不透明度的背景色覆盖，效果类似且渲染极快 -->
    <div class="absolute inset-0 bg-paper/90"></div>

    <!-- 3. 光晕装饰 (性能优化：用渐变代替 blur 滤镜) -->
    <!-- 
       旧方案: bg-color + blur(100px) -> 极耗 GPU
       新方案: radial-gradient -> 极快，效果一致
    -->
    <div 
      class="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full animate-breathe"
      style="background: radial-gradient(closest-side, rgba(55,58,109,0.08), transparent); will-change: transform, opacity;"
    ></div>
    
    <div 
      class="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full animate-breathe"
      style="background: radial-gradient(closest-side, rgba(168,58,58,0.08), transparent); animation-delay: 1.3s; will-change: transform, opacity;"
    ></div>
    
    <!-- 4. 纸张纹理 (保持不变，静态图层不耗性能) -->
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 pointer-events-none"></div>

    <!-- 主体内容 -->
    <main class="z-10 text-center space-y-8 p-6 relative">
      <div class="opacity-0 animate-enter-slow" style="animation-delay: 0.1s">
        <p class="text-cinnabar tracking-[0.6em] text-xs uppercase font-bold">Vwnzva Cuengh AI</p>
      </div>

      <div class="relative opacity-0 animate-enter-slow" style="animation-delay: 0.3s">
        <h1 class="font-calligraphy text-7xl md:text-9xl text-ink drop-shadow-sm select-none">
          壮脉智承
        </h1>
        <div class="absolute -top-4 -right-8 opacity-0 animate-enter-fast" style="animation-delay: 1s">
           <div class="w-12 h-12 border-2 border-cinnabar/50 rounded flex items-center justify-center text-cinnabar text-xs font-serif rotate-12 bg-paper/80">
             云端<br>画廊
           </div>
        </div>
      </div>

      <div class="opacity-0 animate-enter-slow" style="animation-delay: 0.5s">
        <p class="text-ink/60 text-lg md:text-xl font-light tracking-[0.3em] mt-4">
          云端艺术馆
        </p>
      </div>

      <div class="w-[1px] h-0 bg-gradient-to-b from-transparent via-cinnabar to-transparent mx-auto my-8 opacity-0 animate-[grow-height_0.7s_ease-out_forwards]" style="animation-delay: 0.8s; height: 0;"></div>
      
      <p class="max-w-md mx-auto text-ink/80 leading-loose text-sm md:text-base italic opacity-0 animate-enter-slow" style="animation-delay: 0.9s">
        "经纬交织，千年壮锦。<br>
        在这里，传统纹样与人工智能相遇，<br>
        共创属于未来的文化图腾。"
      </p>

      <div class="pt-10 opacity-0 animate-enter-slow" style="animation-delay: 1.2s">
        <NuxtLink 
          to="/gallery" 
          class="inline-block px-14 py-4 bg-transparent border border-ink/80 text-ink text-sm tracking-[0.4em] group relative overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:scale-105 backdrop-blur-none bg-paper/30"
        >
          <span class="relative z-10 group-hover:text-paper transition-colors duration-300">开启画廊</span>
          <div class="absolute inset-0 bg-ink transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out -z-0"></div>
        </NuxtLink>
      </div>
    </main>

    <footer class="absolute bottom-6 w-full text-center opacity-0 animate-enter-fast flex flex-col items-center space-y-2" style="animation-delay: 1.6s">
      <p class="text-[10px] text-ink/30 tracking-widest">© 2025 AI & Vwnzva</p>
      <p v-if="bing?.copyright" class="text-[10px] text-ink/20 font-serif max-w-md truncate px-4">
        Bing Image: {{ bing.copyright }}
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const imageLoaded = ref(false)

// 调用 Server API 获取 Bing 图片链接
const { data: bing } = await useFetch('/api/bing', {
  lazy: true, 
  server: false 
})

// 【核心优化】计算属性：对 Bing 图片进行 CDN 加速和尺寸限制
// 限制宽 1920，质量 80，转为 WebP，大幅减小体积
const optimizedBingUrl = computed(() => {
  const url = bing.value?.url
  if (!url) return ''
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=1920&q=80&output=webp&n=-1`
})
</script>

<style scoped>
@keyframes grow-height {
  to { height: 64px; }
}

/* 
  针对低性能设备的 CSS 优化建议：
  如果设备不支持 filter，可以直接回退，但这里我们已经去掉了 backdrop-blur，兼容性很好。
*/
</style>