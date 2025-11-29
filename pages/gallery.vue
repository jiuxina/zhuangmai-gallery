<template>
  <div class="min-h-screen pt-24 px-4 pb-12 bg-paper/50">
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题区 -->
      <div class="text-center mb-16 space-y-4 opacity-0 animate-enter-medium">
        <h2 class="font-calligraphy text-4xl text-ink">社区艺术画廊</h2>
        <div class="w-12 h-1 bg-cinnabar/20 mx-auto rounded-full"></div>
        <p class="text-ink/60 max-w-xl mx-auto font-light">
          每一件作品，都是传统文化与现代科技的结晶。
        </p>
      </div>

      <!-- 加载状态 -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-20 space-y-6">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-t-2 border-cinnabar rounded-full animate-spin"></div>
          <div class="absolute inset-2 border-r-2 border-indigo/50 rounded-full animate-spin-slow"></div>
        </div>
        <p class="text-ink/50 tracking-widest animate-pulse font-serif text-sm">正在连接云端数据库...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-20 opacity-0 animate-enter-fast">
        <div class="text-cinnabar mb-4 text-4xl font-calligraphy">遗憾</div>
        <p class="text-ink/60 mb-6">暂时无法获取藏品数据</p>
        <button @click="refresh" class="px-6 py-2 border border-ink/30 text-ink/60 hover:text-ink hover:border-ink transition-all">重新连接</button>
        <p class="mt-4 text-xs text-red-400/50">{{ error.message }}</p>
      </div>

      <!-- 画廊网格 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(artwork, index) in artworks" 
          :key="artwork.id"
          class="group bg-white p-3 shadow-sm hover:shadow-2xl transition-all duration-300 border border-ink/5 opacity-0 animate-enter-medium hover:-translate-y-2"
          :style="{ animationDelay: `${index * 60}ms` }"
        >
          <NuxtLink :to="`/artwork/${artwork.id}`" class="block h-full flex flex-col">
            <!-- 图片容器 -->
            <div class="aspect-[4/3] overflow-hidden bg-gray-100 relative mb-4">
              <!-- 【核心优化】前6张优先加载，后面的懒加载 -->
              <img 
                :src="optimizeImage(artwork.imageUrl)" 
                :alt="artwork.title"
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 saturate-[0.8] group-hover:saturate-100"
                :loading="index < 6 ? 'eager' : 'lazy'"
                :fetchpriority="index < 6 ? 'high' : 'auto'"
              />
              <!-- 遮罩动效 -->
              <div class="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span class="text-white font-serif tracking-widest border border-white/50 px-4 py-1 backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">查看详情</span>
              </div>
            </div>
            
            <!-- 信息区 -->
            <div class="text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-lg text-ink group-hover:text-cinnabar transition-colors duration-200 truncate font-serif">
                  {{ artwork.title }}
                </h3>
                <div class="w-4 h-[1px] bg-ink/10 mx-auto my-2 group-hover:w-12 group-hover:bg-cinnabar/30 transition-all duration-300"></div>
                <!-- 简介预览 -->
                <p v-if="artwork.summary" class="text-xs text-ink/40 line-clamp-2 px-2 mb-2 font-serif text-justify">
                  {{ artwork.summary }}
                </p>
              </div>
              <p class="text-xs text-ink/40 font-mono tracking-widest uppercase mt-2">
                Boux {{ artwork.author }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 【核心函数】CDN 图片加速
const optimizeImage = (url: string) => {
  if (!url || url.includes('placeholder')) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=600&q=80&output=webp&n=-1`
}

// 辅助函数：清洗 AI 解读文本
const cleanSummary = (text: string) => {
  if (!text) return '';
  try {
    if (text.trim().startsWith('{')) {
      const obj = JSON.parse(text);
      if (obj.mdText) text = obj.mdText;
    }
  } catch (e) {}
  return text.replace(/[#*`>]/g, '').replace(/<[^>]*>/g, '').substring(0, 60) + '...';
}

// 数据转换函数
const transformArtworks = (data: any) => {
  const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  
  return list.map((item: any) => ({
    id: item.id,
    title: item.user_theme || '无题',       
    author: item.user_name || '匿名',       
    imageUrl: item.art_image_url || 'https://via.placeholder.com/400x300?text=No+Image',
    summary: cleanSummary(item.ai_interpretation)
  }));
};

// 真实 API 调用
const { data: artworks, pending, error, refresh } = await useAsyncData(
  'artworks', 
  () => $fetch('https://api.zhuangmai.cloud/api/gallery/list'), 
  { 
    lazy: true, 
    server: false, 
    transform: transformArtworks 
  }
)

useHead({
  title: '壮脉智承 - 社区画廊'
})
</script>