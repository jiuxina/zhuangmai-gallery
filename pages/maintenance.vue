<template>
  <div class="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-fabric-texture">
    <!-- 顶部装饰 -->
    <div class="absolute top-0 left-0 w-full h-4 bg-indigo opacity-80" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #BC2F2E 10px, #BC2F2E 20px);"></div>
    <div class="absolute top-4 left-0 w-full h-1 bg-gold"></div>

    <!-- 主体内容 -->
    <main class="z-10 text-center p-8 md:p-16 border-y-2 border-indigo/10 bg-paper/90 backdrop-blur-sm max-w-4xl mx-4 shadow-sm relative">
      <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cinnabar"></div>
      <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cinnabar"></div>
      <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cinnabar"></div>
      <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cinnabar"></div>

      <div class="opacity-0 animate-enter-slow" style="animation-delay: 0.1s">
        <div class="flex items-center justify-center gap-3 mb-6"><span class="h-[1px] w-8 bg-cinnabar"></span><p class="text-cinnabar tracking-[0.4em] text-sm uppercase font-bold">Maintenance</p><span class="h-[1px] w-8 bg-cinnabar"></span></div>
      </div>

      <div class="relative opacity-0 animate-enter-slow inline-block" style="animation-delay: 0.3s">
        <h1 class="font-calligraphy text-5xl md:text-7xl text-indigo mb-6 drop-shadow-sm select-none relative z-10">网站维护中</h1>
      </div>

      <div class="opacity-0 animate-enter-slow" style="animation-delay: 0.5s"><p class="text-ink/60 text-lg md:text-xl font-serif tracking-[0.5em] mt-2 mb-8">请稍后访问</p></div>

      <div class="mt-8 mb-12 opacity-0 animate-enter-slow" style="animation-delay: 0.7s">
        <p class="text-ink leading-loose text-sm md:text-base font-serif max-w-lg mx-auto">
          <span class="text-cinnabar font-bold text-lg align-top">" </span>
          我们正在进行系统升级，以提供更好的服务。<br class="mb-2 block" />感谢您的耐心等待。
          <span class="text-cinnabar font-bold text-lg align-bottom"> "</span>
        </p>
      </div>
    </main>

    <!-- 底部 -->
    <div class="absolute bottom-4 left-0 w-full h-1 bg-gold"></div>
    <div class="absolute bottom-0 left-0 w-full h-4 bg-indigo opacity-80" style="background-image: repeating-linear-gradient(-45deg, transparent, transparent 10px, #BC2F2E 10px, #BC2F2E 20px);"></div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
