
<template>
  <div class="min-h-screen pt-32 px-4 pb-12 bg-fabric-texture">
    <div class="max-w-7xl mx-auto">
      
      <div class="text-center mb-16 space-y-6 opacity-0 animate-enter-medium">
        <div class="inline-block relative">
          <h2 class="font-calligraphy text-5xl text-indigo relative z-10">社区艺术画廊</h2>
          <div class="absolute bottom-2 left-0 w-full h-3 bg-gold/30 -z-0"></div>
        </div>
        <p class="text-ink/70 max-w-xl mx-auto font-serif tracking-widest text-sm">
          每一件作品，都是传统文化与现代科技的结晶。
        </p>
      </div>

      <div v-if="pending" class="flex flex-col items-center justify-center py-20 space-y-8">
        <div class="spinner-zhuang"></div>
        <p class="text-indigo/60 tracking-[0.2em] animate-pulse font-serif text-xs uppercase">
          Loading Data...
        </p>
      </div>

      <div v-else-if="error" class="text-center py-20 opacity-0 animate-enter-fast">
        <div class="text-cinnabar mb-4 text-4xl font-calligraphy">遗憾</div>
        <p class="text-ink/60 mb-6">暂时无法获取藏品数据</p>
        <button @click="refresh" class="px-6 py-2 border border-ink/30 text-ink/60 hover:text-white hover:bg-cinnabar hover:border-cinnabar transition-all">重新连接</button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div 
          v-for="(artwork, index) in artworks" 
          :key="artwork.id"
          class="group bg-white p-4 shadow-md hover:shadow-xl transition-all duration-500 border-t-4 border-indigo opacity-0 animate-enter-medium hover:-translate-y-1"
          :style="{ animationDelay: `${index * 60}ms` }"
        >
          <NuxtLink :to="`/artwork/${artwork.id}`" class="block h-full flex flex-col">
            <div class="aspect-[4/3] overflow-hidden bg-gray-100 relative mb-5 shadow-inner">
              <!-- 图片优化 & 错误回退 -->
              <img 
                :src="optimizeImage(artwork.imageUrl)" 
                :alt="artwork.title"
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 saturate-[0.8] group-hover:saturate-100"
                loading="lazy"
                :loading="index < 6 ? 'eager' : 'lazy'"
                :fetchpriority="index < 6 ? 'high' : 'auto'"
                @error="(e) => handleImgError(e, artwork.imageUrl)"
              />
              <div class="absolute inset-0 bg-indigo/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span class="text-white font-serif tracking-[0.2em] border border-white/50 px-6 py-2 backdrop-blur-sm">赏 析</span>
              </div>
            </div>
            
            <div class="text-center flex-1 flex flex-col justify-between px-2">
              <div>
                <h3 class="font-bold text-xl text-indigo group-hover:text-cinnabar transition-colors duration-300 truncate font-serif mb-3">
                  {{ artwork.title }}
                </h3>
                <div class="w-8 h-[1px] bg-gold mx-auto mb-3"></div>
                <p v-if="artwork.summary" class="text-xs text-ink/60 line-clamp-2 leading-relaxed font-serif text-justify mb-4">
                  {{ artwork.summary }}
                </p>
              </div>
              <div class="border-t border-ink/5 pt-3 mt-auto">
                <p class="text-xs text-ink/40 font-mono tracking-widest uppercase">
                  Boux {{ artwork.author }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleImgError = (e: Event, originalUrl: string) => {
  const img = e.target as HTMLImageElement
  if (img.src !== originalUrl) img.src = originalUrl
}

const optimizeImage = (url: string) => {
  if (!url || url.includes('placeholder')) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=600&q=80&output=webp&n=-1`
}

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

const { data: artworks, pending, error, refresh } = await useAsyncData(
  'artworks', 
  () => $fetch('https://api.zhuangmai.cloud/api/gallery/list'), 
  { lazy: true, server: false, transform: transformArtworks }
)

useHead({ title: '壮脉智承 - 社区画廊' })
</script>