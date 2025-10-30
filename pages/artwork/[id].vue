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
    <!-- 加载与错误状态 -->
    <div v-if="pending" class="text-center py-20">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="mt-4 text-text-light">正在加载作品...</p>
    </div>
    <div v-if="error || (artwork && artwork.error)" class="text-center py-20">
      <h1 class="text-4xl font-bold mb-4">作品未找到</h1>
      <p class="text-lg text-text-light">抱歉，我们无法找到您想查看的艺术品。</p>
      <NuxtLink to="/" class="mt-6 inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl">返回画廊</NuxtLink>
    </div>
    
    <!-- 作品详情 -->
    <div v-if="artwork && !artwork.error" class="max-w-5xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        <!-- 左侧图片 -->
        <div class="lg:col-span-3">
          <img :src="artwork.imageUrl" :alt="artwork.title" class="w-full h-auto rounded-2xl shadow-2xl">
        </div>

        <!-- 右侧信息 -->
        <div class="lg:col-span-2 flex flex-col">
          <h1 class="text-5xl font-bold font-serif text-text-main leading-tight">{{ artwork.title }}</h1>
          <p class="text-xl text-text-light mt-2 mb-8">
            由 <span class="font-semibold text-primary">{{ artwork.author }}</span> 创作
          </p>
          
          <div class="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm">
            <h2 class="text-2xl font-bold font-serif mb-3 text-primary/80">AI 寓意解读</h2>
            <p class="text-text-light leading-relaxed text-base">{{ artwork.interpretation }}</p>
          </div>

          <NuxtLink to="/" class="mt-10 inline-flex items-center justify-center gap-2 text-primary hover:text-primary-hover transition-colors duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            返回画廊
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>