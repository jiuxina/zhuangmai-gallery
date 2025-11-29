<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-paper relative overflow-hidden transition-all duration-1000">
    
    <!-- 1. Bing 壁纸层 (最底层) -->
    <!-- 增加 lazy-load 效果，图片加载出来前显示背景色 -->
    <div 
      v-if="bing?.url" 
      class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
      :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
      :style="{ backgroundImage: `url(${bing.url})` }"
    ></div>
    <!-- 隐藏的 img 标签用于监听加载完成事件 -->
    <img v-if="bing?.url" :src="bing.url" class="hidden" @load="imageLoaded = true" />

    <!-- 2. 宣纸风格滤镜层 (关键：让风景图变柔和，融入网站风格) -->
    <!-- 使用 mix-blend-hard-light 或 overlay 让图片和宣纸色融合 -->
    <div class="absolute inset-0 bg-paper/80 backdrop-blur-[2px]"></div>

    <!-- 3. 原有的光晕装饰 (保留但减淡，增加层次感) -->
    <div class="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo/10 rounded-full blur-[100px] animate-breathe mix-blend-multiply"></div>
    <div class="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-cinnabar/10 rounded-full blur-[120px] animate-breathe mix-blend-multiply" style="animation-delay: 1.3s"></div>
    
    <!-- 4. 纸张纹理 (最上层质感) -->
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
           <div class="w-12 h-12 border-2 border-cinnabar/50 rounded flex items-center justify-center text-cinnabar text-xs font-serif rotate-12 bg-paper/50 backdrop-blur-sm">
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
          class="inline-block px-14 py-4 bg-transparent border border-ink/80 text-ink text-sm tracking-[0.4em] group relative overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:scale-105 backdrop-blur-sm"
        >
          <span class="relative z-10 group-hover:text-paper transition-colors duration-300">开启画廊</span>
          <div class="absolute inset-0 bg-ink transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out -z-0"></div>
        </NuxtLink>
      </div>
    </main>

    <footer class="absolute bottom-6 w-full text-center opacity-0 animate-enter-fast flex flex-col items-center space-y-2" style="animation-delay: 1.6s">
      <p class="text-[10px] text-ink/30 tracking-widest">© 2025 AI & Vwnzva</p>
      <!-- 显示 Bing 图片版权 -->
      <p v-if="bing?.copyright" class="text-[10px] text-ink/20 font-serif max-w-md truncate px-4">
        Bing Image: {{ bing.copyright }}
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const imageLoaded = ref(false)

// 调用刚刚创建的 Server API
const { data: bing } = await useFetch('/api/bing', {
  lazy: true, // 不阻塞页面渲染
  server: false // 客户端获取
})
</script>

<style scoped>
@keyframes grow-height {
  to { height: 64px; }
}
</style>