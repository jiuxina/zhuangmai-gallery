<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const { id } = route.params;

const { data: artwork, pending, error } = await useAsyncData(`artwork-${id}`, () => $fetch(`/api/artworks?id=${id}`), { lazy: true })

useHead({
  title: () => artwork.value ? `${artwork.value.title} - 云端艺术馆` : '作品详情',
  meta: [
    { name: 'description', content: () => artwork.value ? artwork.value.interpretation : '数字壮锦艺术作品详情' }
  ]
})
</script>

<template>
  <div>
    <!-- 加载与错误状态 (保持不变) -->
    <div v-if="pending" class="text-center py-20">...</div>
    <div v-if="error || (artwork && artwork.error)" class="text-center py-20">...</div>
    
    <!-- 作品详情 -->
    <div v-if="artwork && !artwork.error">
      <!-- 1. 顶部英雄图片区域 -->
      <div 
        class="h-[70vh] w-full bg-cover bg-center relative"
        :style="{ backgroundImage: `url(${artwork.imageUrl})` }"
      >
        <!-- 添加一个渐变蒙版，让图片底部平滑过渡到白色背景 -->
        <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent"></div>
      </div>

      <!-- 2. 内容区域 -->
      <div class="relative bg-gray-50 pb-20">
        <div class="max-w-4xl mx-auto px-6">
          <!-- 将这个容器向上移动，与图片区域重叠 -->
          <div class="transform -translate-y-24">
            <!-- 标题和创作者 -->
            <div class="text-center mb-10">
              <h1 class="text-6xl font-bold font-serif text-text-main leading-tight">{{ artwork.title }}</h1>
              <p class="text-xl text-text-light mt-4">
                由 <span class="font-semibold text-primary">{{ artwork.author }}</span> 创作
              </p>
            </div>
            
            <!-- AI解读卡片 -->
            <div class="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-lg">
              <h2 class="text-2xl font-bold font-serif mb-4 text-primary/80">AI 寓意解读</h2>
              <p class="text-text-light leading-relaxed text-lg">{{ artwork.interpretation }}</p>
            </div>
          </div>
          
          <!-- 返回画廊链接 -->
          <div class="text-center">
            <NuxtLink to="/" class="mt-12 inline-flex items-center justify-center gap-2 text-primary hover:text-primary-hover transition-colors duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
              返回画廊
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>