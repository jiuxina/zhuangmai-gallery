
<template>
  <div class="fixed inset-0 z-[130] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-indigo/90 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

    <!-- 证书主体 -->
    <div class="relative bg-[#FDFBF7] w-full max-w-lg shadow-2xl p-8 border-[12px] border-double border-indigo animate-enter-medium text-center overflow-hidden">
      
      <!-- 防伪底纹 -->
      <div class="absolute inset-0 opacity-5 pointer-events-none" 
           style="background-image: radial-gradient(#BC2F2E 1px, transparent 1px); background-size: 16px 16px;">
      </div>
      <div class="absolute -top-10 -right-10 w-40 h-40 border-4 border-gold/20 rounded-full"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 border-4 border-gold/20 rounded-full"></div>

      <!-- 头部 -->
      <div class="mb-6 relative z-10">
        <h2 class="font-calligraphy text-4xl text-cinnabar mb-1">数字藏品证书</h2>
        <p class="text-[10px] text-ink/40 tracking-[0.4em] uppercase">Digital Asset Certificate</p>
      </div>

      <!-- 图片 -->
      <div class="w-full h-48 bg-gray-100 mb-6 border-2 border-gold/50 p-1 relative z-10">
        <img :src="imageUrl" class="w-full h-full object-cover" />
      </div>

      <!-- 核心数据 -->
      <div class="space-y-4 text-left border-t border-b border-ink/10 py-6 mb-6 relative z-10">
        <div class="flex justify-between items-end">
          <span class="text-xs text-ink/50 font-bold uppercase">Artwork Name</span>
          <span class="text-lg font-serif text-indigo font-bold">{{ title }}</span>
        </div>
        <div class="flex justify-between items-end">
          <span class="text-xs text-ink/50 font-bold uppercase">Creator</span>
          <span class="text-sm font-serif text-ink">{{ owner }}</span>
        </div>
        <div class="flex justify-between items-end">
          <span class="text-xs text-ink/50 font-bold uppercase">Mint Date</span>
          <span class="text-sm font-mono text-ink">{{ date }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-ink/50 font-bold uppercase">Blockchain Hash</span>
          <span class="text-[10px] font-mono text-ink/70 break-all bg-paper p-2 border border-ink/10 rounded">
            {{ hash }}
          </span>
        </div>
      </div>

      <!-- 底部印章 -->
      <div class="flex justify-between items-end relative z-10">
        <div class="text-left">
          <p class="text-[10px] text-ink/40">Powered by ZhuangMai Chain</p>
          <p class="text-[10px] text-ink/40">ID: {{ Math.floor(Math.random() * 1000000) }}</p>
        </div>
        <!-- 电子印章 -->
        <div class="w-24 h-24 border-4 border-cinnabar/80 rounded-sm flex flex-col items-center justify-center text-cinnabar/80 font-serif leading-none rotate-[-15deg] mix-blend-multiply absolute right-0 bottom-0 pointer-events-none">
          <span class="text-xs border-b border-cinnabar/50 mb-1">壮脉</span>
          <span class="text-2xl font-bold">智承</span>
          <span class="text-[9px] tracking-widest mt-1">认证之印</span>
        </div>
      </div>

      <button @click="$emit('close')" class="absolute top-2 right-2 text-ink/20 hover:text-cinnabar transition-colors text-2xl">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  imageUrl: string
  hash: string
  owner: string
  date: string
}>()
</script>