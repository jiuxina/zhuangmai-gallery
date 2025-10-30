<template>
  <div class="bg-gray-900 text-white min-h-screen font-sans">
    <!-- 头部 -->
    <header class="py-8 text-center border-b border-gray-700">
      <h1 class="text-5xl font-bold tracking-tight">壮脉智承</h1>
      <h2 class="text-2xl font-light text-gray-400 mt-2">云端文化馆</h2>
    </header>

    <!-- 主体内容 -->
    <main class="container mx-auto px-4 py-12">
      <!-- 数据加载状态处理 -->
      <div v-if="pending" class="text-center text-gray-400">正在加载来自宇宙的灵感...</div>
      <div v-else-if="error" class="text-center text-red-400">加载失败：{{ error.message }}</div>
      
      <!-- 作品画廊网格 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 循环渲染作品卡片 -->
        <ArtworkCard v-for="artwork in artworks" :key="artwork.id" :artwork="artwork" />
      </div>
    </main>

    <!-- 尾部 -->
    <footer class="py-6 text-center text-gray-500 border-t border-gray-700 mt-12">
      <p>“文化，因共创而生生不息。”</p>
      <p>&copy; 2025 壮脉智承 开发组</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from 'nuxt/app';

// 使用Nuxt强大的useFetch来获取我们的API数据
const { data: artworks, pending, error } = await useFetch('/api/gallery');
</script>