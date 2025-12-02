
<template>
  <div class="min-h-screen pt-32 px-4 pb-20 bg-fabric-texture">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- 左侧：个人身份卡 -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white p-6 shadow-lg border-t-4 border-indigo animate-enter-medium relative overflow-hidden">
          <div class="absolute top-0 right-0 w-20 h-20 bg-indigo/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div class="text-center relative z-10">
            <div class="w-24 h-24 mx-auto bg-paper border-2 border-gold rounded-full flex items-center justify-center mb-4 shadow-sm relative">
              <span class="font-calligraphy text-4xl text-cinnabar">{{ currentUser?.username?.[0]?.toUpperCase() || '客' }}</span>
              <!-- 签到状态点 -->
              <div v-if="isSignedToday" class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]" title="今日已签到">✓</div>
            </div>
            
            <h2 class="text-xl font-bold text-indigo font-serif mb-1">{{ currentUser?.username }}</h2>
            <p class="text-xs text-ink/40 font-mono tracking-widest uppercase mb-4">UID: {{ 20250000 + (currentUser?.id || 1) }}</p>
            
            <!-- 动态等级徽章 -->
            <div class="inline-flex items-center px-3 py-1 bg-indigo/10 rounded-full border border-indigo/20">
              <span class="w-2 h-2 bg-gold rotate-45 mr-2"></span>
              <span class="text-xs text-indigo font-bold tracking-wide">{{ userLevel }}</span>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-ink/5 space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-xs text-ink/60">共创贡献值</span>
              <span class="text-cinnabar font-bold font-mono text-lg">{{ currentPoints }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-ink/60">加入天数</span>
              <span class="text-indigo font-bold font-mono">{{ daysJoined }} Days</span>
            </div>
          </div>
          
          <!-- 签到按钮 -->
          <button 
            @click="handleSignIn"
            :disabled="isSignedToday"
            class="w-full mt-6 py-2 text-xs font-bold tracking-widest uppercase rounded-sm transition-all shadow-sm flex items-center justify-center gap-2"
            :class="isSignedToday ? 'bg-ink/10 text-ink/40 cursor-default' : 'bg-cinnabar text-white hover:bg-indigo'"
          >
            <span v-if="isSignedToday">已签到 / Signed</span>
            <span v-else>每日签到 / Sign In (+10)</span>
          </button>
        </div>

        <!-- 任务中心 (新增) -->
        <div class="bg-white p-6 shadow-md border-t-4 border-gold animate-enter-medium" style="animation-delay: 0.1s">
          <h3 class="text-xs font-bold text-ink/40 tracking-[0.2em] uppercase mb-4">Daily Tasks</h3>
          <div class="space-y-4">
            <!-- 任务1 -->
            <div class="flex items-center justify-between p-3 bg-paper border border-ink/5 rounded-sm">
              <div class="flex items-center gap-3">
                <div class="text-xl">🎨</div>
                <div>
                  <p class="text-xs font-bold text-indigo">与 AI 共创</p>
                  <p class="text-[10px] text-ink/50">+5 贡献/次</p>
                </div>
              </div>
              <NuxtLink to="/chat" class="text-[10px] border border-indigo text-indigo px-2 py-1 hover:bg-indigo hover:text-white transition-colors">去完成</NuxtLink>
            </div>
            <!-- 任务2 -->
            <div class="flex items-center justify-between p-3 bg-paper border border-ink/5 rounded-sm">
              <div class="flex items-center gap-3">
                <div class="text-xl">📤</div>
                <div>
                  <p class="text-xs font-bold text-indigo">分享作品</p>
                  <p class="text-[10px] text-ink/50">+8 贡献/次</p>
                </div>
              </div>
              <NuxtLink to="/gallery" class="text-[10px] border border-indigo text-indigo px-2 py-1 hover:bg-indigo hover:text-white transition-colors">去分享</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容 (保持 Tab 逻辑) -->
      <div class="lg:col-span-3 space-y-6">
        <!-- ... Tab 导航 (保持不变) ... -->
        <div class="flex space-x-8 border-b-2 border-ink/5 px-2 animate-enter-medium" style="animation-delay: 0.2s">
          <button @click="activeTab = 'collection'" class="pb-3 text-sm tracking-[0.2em] font-bold transition-colors relative" :class="activeTab === 'collection' ? 'text-cinnabar' : 'text-ink/40 hover:text-indigo'">我的藏品 / Cangz<span v-if="activeTab === 'collection'" class="absolute bottom-[-2px] left-0 w-full h-[2px] bg-cinnabar"></span></button>
          <button @click="activeTab = 'orders'" class="pb-3 text-sm tracking-[0.2em] font-bold transition-colors relative" :class="activeTab === 'orders' ? 'text-cinnabar' : 'text-ink/40 hover:text-indigo'">实体订单 / Dingdan<span v-if="activeTab === 'orders'" class="absolute bottom-[-2px] left-0 w-full h-[2px] bg-cinnabar"></span></button>
        </div>

        <!-- Tab 1: 藏品 (保持不变) -->
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
          <div v-else class="text-center py-20 text-ink/40"><p>暂无藏品，去画廊看看吧</p></div>
        </div>

        <!-- Tab 2: 订单 (保持不变) -->
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

    <ClientOnly>
      <Transition name="modal"><DigitalCertificate v-if="showCert" :title="certData.title" :image-url="certData.imageUrl" :hash="certData.hash" :owner="currentUser?.username || 'Unknown'" :date="certData.date" @close="showCert = false" /></Transition>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue'
import DigitalCertificate from '~/components/DigitalCertificate.vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const { currentUser } = useAuth()
const { showToast } = useToast()
const activeTab = ref('collection')
const showCert = ref(false)
const certData = reactive({ title: '', imageUrl: '', hash: '', date: '' })
const myOrders = ref<any[]>([])

// 用户状态扩展
const currentPoints = ref(0)
const realCreatedAt = ref('')
const lastSignInDate = ref('')

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

const { data: galleryData } = await useAsyncData('profile-gallery', () => $fetch('https://api.zhuangmai.cloud/api/gallery/list'), { lazy: true, server: false })

const myCollection = computed(() => {
  const list = galleryData.value ? (Array.isArray(galleryData.value) ? galleryData.value : galleryData.value.data) : []
  if (!currentUser.value) return []
  return list.filter((item: any) => item.user_name === currentUser.value.username)
})

onMounted(async () => {
  if (currentUser.value) {
    // 1. 获取真实订单
    const orders: any = await $fetch('/api/user/orders', { params: { username: currentUser.value.username } })
    myOrders.value = orders.reverse()
    
    // 2. 获取最新用户信息 (积分、签到状态、注册时间)
    const userInfo: any = await $fetch('/api/user/me', { params: { username: currentUser.value.username } })
    if (userInfo) {
      currentPoints.value = userInfo.points
      realCreatedAt.value = userInfo.createdAt
      lastSignInDate.value = userInfo.lastSignIn
    }
  }
})

// 计算加入天数
const daysJoined = computed(() => {
  if (!realCreatedAt.value) return 1
  const start = new Date(realCreatedAt.value).getTime()
  const now = Date.now()
  return Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)))
})

// 计算等级
const userLevel = computed(() => {
  const p = currentPoints.value
  if (p < 50) return 'Lv.1 初识壮锦'
  if (p < 200) return 'Lv.2 纹样学徒'
  if (p < 500) return 'Lv.3 织锦匠人'
  if (p < 1000) return 'Lv.4 文化传承者'
  return 'Lv.5 非遗大师'
})

// 判断今日是否签到
const isSignedToday = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return lastSignInDate.value === today
})

// 签到动作
const handleSignIn = async () => {
  if (!currentUser.value) return
  try {
    const res: any = await $fetch('/api/user/action', {
      method: 'POST',
      body: { username: currentUser.value.username, action: 'signin' }
    })
    if (res.success) {
      showToast(res.message, 'success')
      currentPoints.value = res.points
      lastSignInDate.value = new Date().toISOString().split('T')[0]
    } else {
      showToast(res.message, 'info')
    }
  } catch (e) {
    showToast('签到失败', 'error')
  }
}

useHead({ title: '个人中心 - 壮脉智承' })
definePageMeta({ middleware: 'auth' })
</script>