
<template>
  <div class="min-h-screen pt-32 px-4 pb-20 bg-fabric-texture">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- 左侧身份卡 (不变) -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white p-6 shadow-lg border-t-4 border-indigo animate-enter-medium relative overflow-hidden">
          <div class="absolute top-0 right-0 w-20 h-20 bg-indigo/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div class="text-center relative z-10">
            <div class="w-24 h-24 mx-auto bg-paper border-2 border-gold rounded-full flex items-center justify-center mb-4 shadow-sm">
              <span class="font-calligraphy text-4xl text-cinnabar">{{ currentUser?.username?.[0]?.toUpperCase() || '客' }}</span>
            </div>
            <h2 class="text-xl font-bold text-indigo font-serif mb-1">{{ currentUser?.username }}</h2>
            <p class="text-xs text-ink/40 font-mono tracking-widest uppercase mb-4">UID: {{ 20250000 + (currentUser?.id || 1) }}</p>
            <div class="inline-flex items-center px-3 py-1 bg-indigo/10 rounded-full border border-indigo/20"><span class="w-2 h-2 bg-gold rotate-45 mr-2"></span><span class="text-xs text-indigo font-bold tracking-wide">Lv.3 织锦学徒</span></div>
          </div>
          <div class="mt-8 pt-6 border-t border-ink/5 space-y-4"><div class="flex justify-between items-center"><span class="text-xs text-ink/60">共创贡献值</span><span class="text-cinnabar font-bold font-mono">1,208</span></div><div class="flex justify-between items-center"><span class="text-xs text-ink/60">加入天数</span><span class="text-indigo font-bold font-mono">12 Days</span></div></div>
        </div>
        <!-- 资产 -->
        <div class="bg-indigo text-white p-6 shadow-lg animate-enter-medium" style="animation-delay: 0.1s">
          <h3 class="text-xs opacity-60 tracking-[0.2em] uppercase mb-4">My Assets</h3>
          <div class="grid grid-cols-2 gap-4 text-center"><div><div class="text-2xl font-bold font-serif mb-1">{{ myCollection.length }}</div><div class="text-[10px] opacity-60">数字藏品</div></div><div class="border-l border-white/10"><div class="text-2xl font-bold font-serif mb-1">{{ (myOrders.length * 59).toFixed(1) }}</div><div class="text-[10px] opacity-60">消费金额(¥)</div></div></div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="lg:col-span-3 space-y-6">
        <div class="flex space-x-8 border-b-2 border-ink/5 px-2 animate-enter-medium" style="animation-delay: 0.2s">
          <button @click="activeTab = 'collection'" class="pb-3 text-sm tracking-[0.2em] font-bold transition-colors relative" :class="activeTab === 'collection' ? 'text-cinnabar' : 'text-ink/40 hover:text-indigo'">我的藏品 / Cangz<span v-if="activeTab === 'collection'" class="absolute bottom-[-2px] left-0 w-full h-[2px] bg-cinnabar"></span></button>
          <button @click="activeTab = 'orders'" class="pb-3 text-sm tracking-[0.2em] font-bold transition-colors relative" :class="activeTab === 'orders' ? 'text-cinnabar' : 'text-ink/40 hover:text-indigo'">实体订单 / Dingdan<span v-if="activeTab === 'orders'" class="absolute bottom-[-2px] left-0 w-full h-[2px] bg-cinnabar"></span></button>
        </div>

        <!-- 藏品 -->
        <div v-if="activeTab === 'collection'" class="animate-enter-fast">
          <div v-if="myCollection.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="artwork in myCollection" :key="artwork.id" class="group bg-white p-3 shadow-sm hover:shadow-lg transition-all border border-ink/5 relative flex flex-col">
              <div class="aspect-[4/3] overflow-hidden bg-gray-100 relative mb-3">
                <img :src="optimizeImage(artwork.art_image_url)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <button @click="openCertificate(artwork)" class="absolute top-2 right-2 bg-gold/90 backdrop-blur text-white text-[10px] px-2 py-1 rounded-sm tracking-widest hover:bg-cinnabar transition-colors shadow-sm flex items-center gap-1"><span>📜</span> 证书</button>
              </div>
              <h4 class="font-bold text-sm text-ink font-serif truncate">{{ artwork.user_theme || '无题' }}</h4>
              <p class="text-[10px] text-ink/40 mt-1 font-mono break-all truncate">HASH: {{ artwork.unique_hash || 'SYNCING...' }}</p>
            </div>
            <NuxtLink to="/chat" class="border-2 border-dashed border-ink/10 flex flex-col items-center justify-center text-ink/30 hover:text-cinnabar hover:border-cinnabar/30 transition-all min-h-[200px] bg-paper/50 rounded-sm"><span class="text-2xl mb-2 font-serif">+</span><span class="text-xs tracking-widest">共创更多作品</span></NuxtLink>
          </div>
          <div v-else class="text-center py-20 text-ink/40"><p class="mb-4">暂无藏品，去创造属于你的非遗艺术</p><NuxtLink to="/chat" class="text-indigo hover:text-cinnabar underline">前往创作 →</NuxtLink></div>
        </div>

        <!-- 订单 (真实数据) -->
        <div v-else class="animate-enter-fast space-y-4">
          <div v-if="myOrders.length > 0">
            <div v-for="order in myOrders" :key="order.id" class="bg-white p-6 border border-ink/5 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden mb-4">
              <div class="w-24 h-24 bg-gray-100 shrink-0"><img :src="optimizeImage(order.mockup_url || order.art_image_url)" class="w-full h-full object-cover" /></div>
              <div class="flex-1 text-center md:text-left w-full">
                <div class="flex flex-col md:flex-row md:justify-between mb-2"><h4 class="font-bold text-indigo font-serif text-lg">独家定制帆布袋 - {{ order.user_theme }}</h4><span class="text-cinnabar font-bold text-sm">¥ {{ order.price }}</span></div>
                <p class="text-xs text-ink/50 mb-4">订单号: ZM{{ order.id }} · {{ new Date(order.createdAt).toLocaleDateString() }}</p>
                <div class="w-full bg-ink/5 h-1.5 rounded-full overflow-hidden mb-2"><div class="bg-gold h-full relative" style="width: 30%"><div class="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div></div></div>
                <div class="flex justify-between text-[10px] text-ink/40 tracking-widest uppercase"><span>Ordered</span><span class="text-gold font-bold">Shipped</span><span>Delivered</span></div>
              </div>
              <div class="absolute top-0 right-0 bg-gold text-white text-[10px] px-3 py-1 font-bold tracking-widest">待发货</div>
            </div>
          </div>
          <div v-else class="text-center py-20 text-ink/40"><p>暂无订单</p></div>
        </div>
      </div>
    </div>

    <!-- 证书弹窗 -->
    <ClientOnly>
      <Transition name="modal"><DigitalCertificate v-if="showCert" :title="certData.title" :image-url="certData.imageUrl" :hash="certData.hash" :owner="currentUser?.username || 'Unknown'" :date="certData.date" @close="showCert = false" /></Transition>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue'
import DigitalCertificate from '~/components/DigitalCertificate.vue'
import { useAuth } from '~/composables/useAuth'

const { currentUser } = useAuth()
const activeTab = ref('collection')
const showCert = ref(false)
const certData = reactive({ title: '', imageUrl: '', hash: '', date: '' })
const myOrders = ref<any[]>([])

const openCertificate = (artwork: any) => {
  certData.title = artwork.user_theme || '无题'
  certData.imageUrl = optimizeImage(artwork.art_image_url)
  certData.hash = artwork.unique_hash || 'PENDING'
  certData.date = artwork.created_at ? new Date(artwork.created_at).toLocaleDateString() : new Date().toLocaleDateString()
  showCert.value = true
}

const optimizeImage = (url: string) => {
  if (!url || url.includes('placeholder')) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=400&q=80&output=webp&n=-1`
}

// 1. 获取藏品 (真实筛选)
const { data: galleryData } = await useAsyncData('profile-gallery', () => $fetch('https://api.zhuangmai.cloud/api/gallery/list'), { lazy: true, server: false })

const myCollection = computed(() => {
  const list = galleryData.value ? (Array.isArray(galleryData.value) ? galleryData.value : galleryData.value.data) : []
  if (!currentUser.value) return []
  // 严格匹配用户名
  return list.filter((item: any) => item.user_name === currentUser.value.username)
})

// 2. 获取真实订单
onMounted(async () => {
  if (currentUser.value) {
    const orders: any = await $fetch('/api/user/orders', { params: { username: currentUser.value.username } })
    myOrders.value = orders.reverse() // 最新的在前面
  }
})

useHead({ title: '个人中心 - 壮脉智承' })
definePageMeta({ middleware: 'auth' })
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>