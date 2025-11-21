<script setup>
  // 定义数据转换函数：把后端字段映射为前端字段
  const transformArtworks = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map(item => ({
      id: item.id,
      title: item.user_theme,       // 映射: user_theme -> title
      author: item.user_name,       // 映射: user_name -> author
      imageUrl: item.art_image_url  // 映射: art_image_url -> imageUrl
    }));
  };

  const { data: artworks, pending, error } = await useAsyncData(
    'artworks', 
    // 【核心】直连阿里云后端 API
    () => $fetch('https://api.zhuangmai.cloud/api/gallery/list'), 
    { 
      lazy: true, 
      server: false, // 强制客户端请求
      transform: transformArtworks // 收到数据后立即转换格式
    }
  )

  useHead({
    title: '云端艺术馆 - 首页',
    meta: [
      { name: 'description', content: '探索由AI与用户共同创作的数字壮锦艺术作品。' }
    ]
  })
</script>

<template>
  <div>
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold mb-3">社区艺术画廊</h1>
      <p class="text-xl text-text-light">每一件作品，都是传统文化与现代科技的结晶。</p>
    </div>

    <!-- 骨架屏加载效果 -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-lg p-4 animate-pulse">
        <div class="w-full h-64 bg-gray-200 rounded-lg"></div>
        <div class="mt-4 h-6 bg-gray-200 rounded w-3/4"></div>
        <div class="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <div v-if="error" class="text-center text-red-500">加载作品失败，请稍后再试。</div>

    <!-- 作品列表 -->
    <div v-if="artworks" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      <NuxtLink 
        v-for="(artwork, index) in artworks" 
        :key="artwork.id" 
        :to="`/artwork/${artwork.id}`"
        class="artwork-card group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
        :style="{ '--delay': `${index * 100}ms` }"
      >
        <div class="overflow-hidden">
          <img :src="artwork.imageUrl" :alt="artwork.title" class="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out">
        </div>
        <div class="p-6">
          <h2 class="text-2xl font-bold text-text-main group-hover:text-primary transition-colors">{{ artwork.title }}</h2>
          <p class="text-text-light/80 mt-1">创作者: {{ artwork.author }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.artwork-card {
  animation: fadeInUp 0.8s ease-out both;
  animation-delay: var(--delay);
}
</style>