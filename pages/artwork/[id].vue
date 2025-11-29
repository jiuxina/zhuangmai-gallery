<template>
  <div class="min-h-screen pt-24 pb-12 px-4 bg-paper">
    
    <!-- 加载与错误处理 -->
    <!-- 【核心修改】这里同时判断数据 loading 和 图片 loading -->
    <div v-if="pending || assetsLoading" class="flex flex-col items-center justify-center py-40 space-y-4">
       <div class="w-12 h-12 border-2 border-cinnabar/20 border-t-cinnabar rounded-full animate-spin"></div>
       <div class="animate-pulse text-ink/40 tracking-widest font-serif text-sm">
         {{ pending ? '正在读取藏品信息...' : '正在渲染数字资产...' }}
       </div>
    </div>
    
    <div v-else-if="error || !artwork" class="text-center py-40 opacity-0 animate-enter-fast">
      <h2 class="text-3xl font-calligraphy text-ink mb-4">作品未找到</h2>
      <NuxtLink to="/gallery" class="text-cinnabar border-b border-cinnabar/30 hover:border-cinnabar transition-colors pb-1">返回画廊</NuxtLink>
    </div>

    <!-- 真实数据展示区 -->
    <div v-else class="max-w-6xl mx-auto">
      
      <!-- 上半部分：左右分栏 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        
        <!-- 左侧：作品展示 -->
        <div class="lg:col-span-5 relative opacity-0 animate-enter-medium group lg:sticky lg:top-32" style="animation-delay: 0.05s">
          <div class="absolute inset-0 bg-ink/5 transform translate-x-4 translate-y-4 rounded-sm transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
          
          <div class="relative bg-white p-4 shadow-lg border border-ink/5 rotate-1 group-hover:rotate-0 transition-transform duration-700 ease-out z-10">
            <!-- 图片资源已预加载，此处会瞬间显示 -->
            <img 
              :src="optimizeDetailImage(artwork.art_image_url)" 
              :alt="artwork.user_theme" 
              class="w-full h-auto object-cover select-none"
            />
          </div>
          
          <div class="flex justify-between items-center text-[10px] text-ink/30 font-mono mt-8 px-2 tracking-widest">
            <span>Hauh: {{ artwork.id }}</span>
            <span class="animate-pulse">Yunh</span>
          </div>
        </div>

        <!-- 右侧：信息与互动 -->
        <div class="lg:col-span-7 space-y-8">
          <!-- 标题与作者 -->
          <div class="opacity-0 animate-enter-medium" style="animation-delay: 0.2s">
            <h1 class="font-calligraphy text-5xl lg:text-6xl text-ink mb-4 leading-tight">
              {{ artwork.user_theme || '无题' }}
            </h1>
            <div class="flex items-center space-x-3 text-ink/60">
              <span class="w-12 h-[1px] bg-cinnabar"></span>
              <span class="font-serif italic tracking-wide">
                由 {{ artwork.user_name || '匿名创作者' }} 创作
              </span>
            </div>
          </div>

          <!-- AI 寓意解读 -->
          <div v-if="formattedInterpretation" class="opacity-0 animate-enter-medium relative" style="animation-delay: 0.25s">
            <div class="absolute -top-3 -left-2 text-6xl text-ink/5 font-serif">“</div>
            <div class="relative bg-white/40 p-6 border-y border-ink/10 backdrop-blur-sm">
              <h3 class="font-bold text-indigo mb-3 flex items-center text-sm tracking-widest uppercase">
                <span class="mr-2">🔮</span> AI Gaii
              </h3>
              <div class="text-ink/90 leading-relaxed font-serif text-sm md:text-base whitespace-pre-wrap markdown-body">
                {{ formattedInterpretation }}
              </div>
            </div>
            <div class="absolute -bottom-6 right-4 text-6xl text-ink/5 font-serif rotate-180">“</div>
          </div>

          <!-- 非遗之声 (音频播放器) -->
          <div v-if="artwork.audio_url" class="opacity-0 animate-enter-medium" style="animation-delay: 0.3s">
            <div class="bg-indigo/5 border border-indigo/10 rounded-full p-2 pr-6 flex items-center space-x-4 transition-all hover:bg-indigo/10">
              <button 
                @click="toggleAudio" 
                class="w-10 h-10 bg-indigo text-white rounded-full flex items-center justify-center hover:bg-cinnabar transition-colors shadow-sm shrink-0"
              >
                <span v-if="isPlaying">❚❚</span>
                <span v-else>▶</span>
              </button>
              <div class="flex-1 overflow-hidden">
                <div class="text-xs text-indigo/60 font-bold uppercase tracking-widest mb-0.5">Sing Vwnz</div>
                <div class="text-sm text-ink font-serif truncate">非遗之声 · 听见壮锦</div>
              </div>
              <div v-if="isPlaying" class="flex items-end space-x-1 h-4">
                <div class="w-1 bg-cinnabar/60 animate-bounce" style="animation-duration: 0.5s"></div>
                <div class="w-1 bg-cinnabar/60 animate-bounce" style="animation-duration: 0.7s"></div>
                <div class="w-1 bg-cinnabar/60 animate-bounce" style="animation-duration: 0.4s"></div>
                <div class="w-1 bg-cinnabar/60 animate-bounce" style="animation-duration: 0.6s"></div>
              </div>
              <audio ref="audioRef" :src="artwork.audio_url" @ended="isPlaying = false" class="hidden"></audio>
            </div>
          </div>

          <!-- 今日纹样灵签 -->
          <div class="opacity-0 animate-enter-medium" style="animation-delay: 0.35s">
            <div class="flex items-start space-x-4 bg-paper border border-gold/30 p-4 rounded-lg shadow-sm">
              <div class="bg-cinnabar text-white w-10 h-10 flex items-center justify-center rounded-full shrink-0 font-calligraphy text-xl shadow-md">签</div>
              <div>
                <h4 class="font-bold text-ink text-sm mb-1">今日纹样灵签</h4>
                <p class="text-ink/60 text-sm italic">
                  “{{ displayFortune }}”
                </p>
              </div>
            </div>
          </div>

          <!-- 功能按钮区 -->
          <div class="grid grid-cols-2 gap-4 opacity-0 animate-enter-medium" style="animation-delay: 0.4s">
            <NuxtLink to="/chat" class="py-3 border border-ink text-ink hover:bg-ink hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 group">
              <span class="group-hover:-rotate-12 transition-transform">🎨</span>
              <span>生成类似作品</span>
            </NuxtLink>
            <button 
              @click="showShareModal = true"
              class="py-3 bg-cinnabar text-white hover:bg-red-800 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <span>📤</span>
              <span>一键分享</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 下半部分：通栏文创预览 -->
      <div class="opacity-0 animate-enter-medium mb-12" style="animation-delay: 0.5s">
        <div class="flex items-center justify-center mb-10 space-x-4">
           <div class="h-[1px] w-12 bg-ink/20"></div>
           <h3 class="font-calligraphy text-3xl text-ink">文创衍生品预览</h3>
           <div class="h-[1px] w-12 bg-ink/20"></div>
        </div>
        
        <div 
          @click="showProductModal = true"
          class="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg border border-ink/5 flex flex-col md:flex-row transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 max-w-4xl mx-auto"
        >
          <!-- 图片区域 -->
          <div class="w-full md:w-1/2 h-64 md:h-80 bg-gray-100 relative overflow-hidden flex items-center justify-center">
             <div class="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10"></div>
             <!-- 同样已预加载 -->
             <img :src="optimizeDetailImage(artwork.mockup_url || artwork.art_image_url)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
             <div v-if="!artwork.mockup_url" class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-4">
               <span class="text-white text-xs tracking-[0.2em] uppercase border border-white/50 px-3 py-1 backdrop-blur-sm">Gawq Fuz</span>
             </div>
          </div>

          <!-- 商品详情区 -->
          <div class="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-paper/30">
            <div>
              <div class="text-xs text-cinnabar font-bold uppercase tracking-wider mb-3 flex items-center">
                 <span class="w-2 h-2 bg-cinnabar rounded-full mr-2 animate-pulse"></span>
                 {{ artwork.mockup_url ? '实物预览' : '定制模拟' }}
              </div>
              <h4 class="font-bold text-2xl text-ink font-serif mb-2">独家定制帆布袋</h4>
              <p class="text-sm text-ink/60 leading-relaxed mb-6">
                将《{{ artwork.user_theme }}》的数字灵感实体化。采用 100% 天然纤维制作，环保印染，经久耐用。让非遗美学成为您的日常随行。
              </p>
            </div>
            <div class="flex items-center space-x-6 mt-4">
              <span class="text-3xl font-serif text-ink font-bold">¥ 59.00</span>
              <button class="flex-1 bg-ink text-white px-6 py-3 rounded hover:bg-cinnabar transition-colors shadow-lg tracking-widest text-sm">
                立即购买
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 弹窗组件挂载区 -->
    <ClientOnly>
      <!-- 1. 购买弹窗 -->
      <Transition name="modal">
        <div v-if="showProductModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity" @click="showProductModal = false"></div>
          <div class="bg-paper w-full max-w-md rounded-lg shadow-2xl relative z-10 overflow-hidden flex flex-col transform transition-all duration-300">
            <div class="relative h-64 bg-gray-100 group overflow-hidden">
              <img :src="optimizeDetailImage(artwork.mockup_url || artwork.art_image_url)" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <button @click="showProductModal = false" class="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-cinnabar transition-colors z-20">✕</button>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-6 text-white">
                <div class="text-xs opacity-80 uppercase tracking-widest">Cangz</div>
                <div class="text-xl font-serif">{{ artwork.user_theme }} Hienq</div>
              </div>
            </div>

            <div class="p-6 space-y-5">
              <div class="space-y-3 py-2 border-b border-ink/10">
                <div class="flex justify-between text-sm items-center"><span class="text-ink/70">产品类型</span><span class="font-bold text-ink">独家定制帆布袋</span></div>
                <div class="flex justify-between text-sm items-center"><span class="text-ink/70">材质</span><span class="font-medium bg-indigo/5 text-indigo px-2 py-0.5 rounded text-xs">100% 天然纤维</span></div>
                <div class="flex justify-between text-sm items-center"><span class="text-ink/70">预计发货</span><span class="font-medium">3-5 个工作日</span></div>
              </div>
              <div class="flex items-center justify-between pt-2">
                <div class="text-3xl font-serif text-cinnabar">¥ 59.00</div>
                <button @click="handleBuy" class="px-8 py-3 bg-ink text-white rounded hover:bg-cinnabar hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 tracking-widest font-bold">立即下单</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 2. 分享弹窗 -->
      <Transition name="modal">
        <ShareModal 
          v-if="showShareModal"
          :imageUrl="optimizeDetailImage(artwork.art_image_url)"
          :title="artwork.user_theme"
          :interpretation="plainInterpretation"
          @close="showShareModal = false"
        />
      </Transition>
    </ClientOnly>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ShareModal from '~/components/ShareModal.vue'

const route = useRoute()
const showProductModal = ref(false)
const showShareModal = ref(false)
// 【核心修改】新增资源加载状态，默认为 true (加载中)
const assetsLoading = ref(true)

// CDN 加速
const optimizeDetailImage = (url: string) => {
  if (!url || url.includes('placeholder')) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=1200&q=85&output=webp&n=-1`
}

// 1. 获取数据
const { data: artwork, pending, error } = await useAsyncData(`artwork-${route.params.id}`, async () => {
  const response: any = await $fetch('https://api.zhuangmai.cloud/api/gallery/list')
  const list = Array.isArray(response) ? response : (response?.data || [])
  const found = list.find((item: any) => String(item.id) === String(route.params.id))
  
  if (!found) {
    throw createError({ statusCode: 404, statusMessage: 'Artwork not found' })
  }
  return found
}, {
  lazy: true
})

// 【核心修改】监听数据变化，一旦拿到数据，开始预加载图片
watch(artwork, (newVal) => {
  if (newVal) {
    preloadAssets(newVal)
  }
}, { immediate: true })

// 【核心修改】预加载函数
const preloadAssets = (data: any) => {
  assetsLoading.value = true
  
  const imagesToLoad = [
    optimizeDetailImage(data.art_image_url),
    optimizeDetailImage(data.mockup_url || data.art_image_url) // 预加载文创图
  ]

  let loadedCount = 0
  let hasError = false

  // 辅助加载函数
  const loadImage = (url: string) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = url
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false) // 即使失败也 resolve，防止卡死
    })
  }

  // 并行加载所有图片
  Promise.all(imagesToLoad.map(url => loadImage(url))).then(() => {
    // 图片加载完成（或失败），解除 loading
    assetsLoading.value = false
  })
}

// ... 后续逻辑保持不变 ...
const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)

const toggleAudio = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    audioRef.value.play()
    isPlaying.value = true
  }
}

const formattedInterpretation = computed(() => {
  if (!artwork.value?.ai_interpretation) return '';
  let text = artwork.value.ai_interpretation;
  try {
    if (text.trim().startsWith('{') || text.trim().startsWith('<|begin_of_box|>')) {
        const cleanJson = text.replace('<|begin_of_box|>', '').replace('<|end_of_box|>', '');
        const obj = JSON.parse(cleanJson);
        if (obj.mdText) return obj.mdText; 
    }
  } catch (e) {}
  return text;
})

const plainInterpretation = computed(() => {
  const text = formattedInterpretation.value;
  if (!text) return '暂无解读';
  return text.replace(/[#*`>]/g, '').replace(/<[^>]*>/g, '').substring(0, 300);
})

const localFortunes = [
  "纹样如流水，上善若水，今日宜顺势而为。",
  "菱形稳固，寓意守护，家宅安宁，万事胜意。",
  "色彩斑斓，如繁花似锦，事业将有新的转机。",
  "经纬交织，因缘际会，今日由于贵人相助。",
  "图腾古老，智慧常新，保持学习，必有所得。",
  "双凤朝阳，喜气洋洋，适合表白或商谈合作。"
]
const displayFortune = computed(() => {
  if (artwork.value?.fortune_text) return artwork.value.fortune_text;
  const idNum = parseInt(String(artwork.value?.id)) || 0;
  return localFortunes[idNum % localFortunes.length];
})

const handleBuy = () => {
  showProductModal.value = false
  setTimeout(() => {
    throw createError({
      statusCode: 503,
      message: '抱歉，该文创产品的第三方商家支付接口暂未连通。',
      fatal: true
    })
  }, 300)
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .bg-paper, .modal-leave-active .bg-paper { transition: all 0.3s ease-out; }
.modal-enter-from .bg-paper, .modal-leave-to .bg-paper { transform: scale(0.95) translateY(10px); opacity: 0; }
.markdown-body { white-space: pre-wrap; }
</style>