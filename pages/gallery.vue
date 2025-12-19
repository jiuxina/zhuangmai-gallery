<template>
  <div class="min-h-screen pt-32 px-4 pb-20 bg-fabric-texture transition-colors duration-1000" :style="{ backgroundColor: curationData ? curationData.theme_color + '08' : '' }">
    <div class="max-w-7xl mx-auto">
      
      <!-- 1. 静态头部 (始终显示) -->
      <div class="text-center mb-12 space-y-6 opacity-0 animate-enter-medium">
        <div class="inline-block relative">
          <h2 class="font-calligraphy text-5xl md:text-6xl text-indigo relative z-10">社区艺术画廊</h2>
          <div class="absolute bottom-2 left-0 w-full h-3 bg-gold/30 -z-0"></div>
        </div>
        <p class="text-ink/70 max-w-xl mx-auto font-serif tracking-[0.2em] text-sm md:text-base">
          经纬之间，见证传统纹样与现代智能的共创之旅
        </p>
      </div>

      <!-- 2. ==================== Agent 策展展示区 (仅登录显示) ==================== -->
      <div v-if="currentUser" class="mb-16 opacity-0 animate-enter-medium" style="animation-delay: 0.2s">
        <!-- 加载中状态 -->
        <div v-if="isCurating" class="bg-white/50 backdrop-blur-md p-12 rounded-xl border-2 border-dashed border-indigo/20 text-center">
          <div class="spinner-zhuang mx-auto mb-4"></div>
          <p class="text-indigo font-serif italic animate-pulse">Agent 策展人正在为您布置展厅...</p>
        </div>

        <!-- 策展内容 -->
        <div v-else-if="curationData" class="relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-gold/50 via-cinnabar/50 to-indigo/50 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div class="relative bg-white p-8 md:p-12 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-10">
            <!-- 策展视觉符号 -->
            <div class="w-32 h-32 md:w-48 md:h-48 shrink-0 relative flex items-center justify-center">
              <div class="absolute inset-0 animate-spin-slow opacity-10">
                <svg viewBox="0 0 100 100" class="w-full h-full fill-indigo"><path d="M50 0 L100 50 L50 100 L0 50 Z"/></svg>
              </div>
              <div class="text-center relative z-10">
                <span class="text-[10px] uppercase tracking-[0.3em] text-ink/40 block mb-2">Curated By</span>
                <span class="font-calligraphy text-4xl text-indigo">Agent</span>
              </div>
            </div>

            <!-- 策展文字内容 -->
            <div class="flex-1 space-y-4">
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in curationData.focus_keywords" :key="tag" class="px-3 py-1 bg-indigo/5 text-indigo text-[10px] font-bold tracking-widest rounded-full border border-indigo/10"># {{ tag }}</span>
              </div>
              <h2 class="font-calligraphy text-4xl md:text-5xl text-ink leading-tight">{{ curationData.exhibition_title }}</h2>
              <p class="text-ink/60 font-serif leading-loose italic text-sm md:text-base border-l-4 border-gold pl-6 py-2">“ {{ curationData.curator_note }} ”</p>
              <div class="pt-4 flex items-center gap-4">
                <span class="text-[9px] text-ink/30 font-mono uppercase">已根据 Agent 建议为您重排画廊顺序</span>
                <div class="h-[1px] flex-1 bg-ink/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 搜索栏 -->
      <div class="mb-12 max-w-2xl mx-auto opacity-0 animate-enter-medium" style="animation-delay: 0.4s">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索主题、作者或作品 ID..." 
            class="w-full py-4 pl-12 pr-4 bg-white/80 backdrop-blur-sm border border-ink/10 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none transition-all font-serif" 
          />
          <div class="absolute left-5 top-1/2 -translate-y-1/2 text-ink/30">🔍</div>
        </div>
      </div>

      <!-- 4. 作品瀑布流列表 -->
      <div v-if="pending" class="flex flex-col items-center py-40">
        <div class="spinner-zhuang mb-4"></div>
        <p class="text-xs text-indigo/40 tracking-widest animate-pulse uppercase">Retrieving Artworks...</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div 
          v-for="(artwork, index) in sortedArtworks" 
          :key="artwork.id"
          class="group bg-white p-4 shadow-md transition-all duration-500 border-t-4 opacity-0 animate-enter-medium relative hover:-translate-y-2"
          :class="[isRecommended(artwork.id) ? 'border-gold ring-2 ring-gold/20 scale-[1.02] z-10' : 'border-indigo']"
          :style="{ animationDelay: `${index * 60}ms` }"
        >
          <!-- Agent 甄选角标 -->
          <div v-if="isRecommended(artwork.id)" class="absolute -top-3 -right-3 bg-gold text-white text-[10px] px-3 py-1 shadow-lg z-20 font-bold tracking-widest rotate-12">
            AGENT 甄选
          </div>

          <NuxtLink :to="`/artwork/${artwork.id}`" class="block h-full flex flex-col">
            <div class="aspect-[4/3] overflow-hidden bg-gray-100 relative mb-5 shadow-inner">
              <img :src="artwork.imageUrl" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div class="absolute inset-0 bg-indigo/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="text-white font-serif tracking-[0.2em] border border-white/50 px-6 py-2 backdrop-blur-sm">入 场 赏 析</span>
              </div>
            </div>
            <div class="text-center flex-1">
              <h3 class="font-bold text-xl text-indigo group-hover:text-cinnabar transition-colors truncate font-serif mb-3">{{ artwork.title }}</h3>
              <div class="w-8 h-[1px] bg-gold mx-auto mb-3"></div>
              <p class="text-xs text-ink/40 font-mono tracking-widest uppercase">Boux {{ artwork.author }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- 5. 空状态 -->
      <div v-if="!pending && sortedArtworks.length === 0" class="text-center py-40 text-ink/30 italic font-serif">
        <div class="text-4xl mb-4 opacity-20">🍃</div>
        <p>暂未找到符合条件的织锦作品</p>
        <button @click="searchQuery = ''" class="mt-4 text-indigo text-xs underline">重置搜索</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { currentUser } = useAuth()
const searchQuery = ref('')
const isCurating = ref(false)
const curationData = ref<any>(null)

// 转换 API 数据
const transformArtworks = (data: any) => {
  const list = Array.isArray(data) ? data : (data?.data || []);
  return list.map((item: any) => ({
    id: item.id,
    title: item.user_theme || '无题',       
    author: item.user_name || '匿名',       
    imageUrl: item.art_image_url
  }));
};

const { data: allArtworks, pending } = await useAsyncData('artworks', () => $fetch('/api/gallery/list'), { transform: transformArtworks })

// 获取 Agent 策展方案
const fetchCuration = async () => {
  if (!currentUser.value) return
  isCurating.value = true
  try {
    const res: any = await $fetch('/api/agent/curate', {
      method: 'POST',
      body: { userId: currentUser.value.id }
    })
    if (res.success) curationData.value = res.curation
  } catch (e) {
    console.error("策展请求失败，切换至默认模式");
  } finally {
    isCurating.value = false
  }
}

onMounted(fetchCuration)

// 判断是否为 Agent 推荐作品
const isRecommended = (id: number) => {
  return curationData.value?.recommended_ids?.includes(id);
}

// 核心：智能重排逻辑
const sortedArtworks = computed(() => {
  if (!allArtworks.value) return [];
  let list = [...allArtworks.value];
  
  // 1. 如果有 Agent 推荐，将推荐的 ID 强制置顶
  if (curationData.value?.recommended_ids?.length > 0) {
    list.sort((a, b) => {
      const aScore = isRecommended(a.id) ? 1 : 0;
      const bScore = isRecommended(b.id) ? 1 : 0;
      return bScore - aScore; // 推荐的排前面
    });
  }
  
  // 2. 搜索过滤
  const query = searchQuery.value.toLowerCase().trim();
  if (query) {
    list = list.filter(a => 
      a.title.toLowerCase().includes(query) || 
      a.author.toLowerCase().includes(query) ||
      String(a.id).includes(query)
    );
  }
  
  return list;
});

useHead({ title: '社区画廊 - 壮脉智承' })
</script>

<style scoped>
.animate-spin-slow { animation: spin 20s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* 页面入场动画 */
.animate-enter-medium {
  animation: enter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes enter {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* 解决 opacity-0 导致的瞬间隐藏 */
.opacity-0 {
  opacity: 0;
  animation-fill-mode: forwards;
}
</style>