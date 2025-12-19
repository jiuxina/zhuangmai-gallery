<template>
  <div class="min-h-screen pt-32 px-4 pb-20 bg-fabric-texture">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-8">
      <div class="spinner-zhuang"></div>
      <p class="text-indigo/60 tracking-[0.2em] animate-pulse font-serif text-xs uppercase">Loading Profile...</p>
    </div>

    <!-- 主体内容 -->
    <div v-else class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- 左侧边栏：个人身份卡 -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white p-6 shadow-lg border-t-4 border-indigo animate-enter-medium relative overflow-hidden">
          <div class="text-center relative z-10">
            <div class="w-24 h-24 mx-auto bg-paper border-2 border-gold rounded-full flex items-center justify-center mb-4 shadow-sm relative">
              <span class="font-calligraphy text-4xl text-cinnabar">{{ currentUser?.username?.[0]?.toUpperCase() || '客' }}</span>
              <div v-if="isSignedToday" class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
            </div>
            <h2 class="text-xl font-bold text-indigo font-serif mb-1">{{ currentUser?.username }}</h2>
            <p class="text-xs text-ink/40 font-mono tracking-widest uppercase mb-4">UID: {{ 20250000 + (currentUser?.id || 1) }}</p>
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
            <div class="bg-gold/10 p-3 rounded-sm border border-gold/20 mt-2">
              <div class="flex justify-between items-start mb-2">
                <p class="text-[10px] text-ink/40 uppercase tracking-widest">Copyright Income</p>
                <button @click="showLogModal = true" class="text-[10px] text-indigo border-b border-indigo/30 hover:text-cinnabar hover:border-cinnabar transition-colors">查看账单</button>
              </div>
              <div class="flex items-baseline gap-1">
                 <span class="text-xl font-bold text-gold">{{ copyrightEarnings }}</span>
                 <span class="text-xs text-ink/50">共创贡献值</span>
              </div>
              <p class="text-[10px] text-ink/40 mt-1">来自他人抽卡的分成收益</p>
            </div>
          </div>

          <button @click="handleSignIn" :disabled="isSignedToday || isSigningIn" class="w-full mt-6 py-2 text-xs font-bold tracking-widest uppercase rounded-sm transition-all shadow-sm flex items-center justify-center gap-2" :class="isSignedToday ? 'bg-ink/10 text-ink/40 cursor-default' : 'bg-cinnabar text-white hover:bg-indigo disabled:bg-cinnabar/70'">
            <span v-if="isSigningIn">处理中...</span>
            <span v-else-if="isSignedToday">已签到 / Signed</span>
            <span v-else>每日签到 / Sign In (+10)</span>
          </button>
        </div>
        
        <!-- 任务中心 -->
        <div class="bg-white p-6 shadow-md border-t-4 border-gold animate-enter-medium" style="animation-delay: 0.1s">
          <h3 class="text-xs font-bold text-ink/40 tracking-[0.2em] uppercase mb-4">Daily Tasks</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-paper border border-ink/5 rounded-sm">
              <div class="flex items-center gap-3"><div class="text-xl">🎨</div><div><p class="text-xs font-bold text-indigo">与 AI 共创</p><p class="text-[10px] text-ink/50">+5 奖励/次</p></div></div>
              <NuxtLink to="/chat" class="text-[10px] border border-indigo text-indigo px-2 py-1 hover:bg-indigo hover:text-white transition-colors">去完成</NuxtLink>
            </div>
            <div class="flex items-center justify-between p-3 bg-paper border border-ink/5 rounded-sm">
              <div class="flex items-center gap-3"><div class="text-xl">💰</div><div><p class="text-xs font-bold text-indigo">申请收录</p><p class="text-[10px] text-ink/50">获10%抽卡分成</p></div></div>
              <button @click="activeTab = 'collection'" class="text-[10px] border border-indigo text-indigo px-2 py-1 hover:bg-indigo hover:text-white transition-colors">去申请</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Tab 导航 -->
        <div class="flex space-x-8 border-b-2 border-ink/5 px-2 animate-enter-medium" style="animation-delay: 0.2s">
          <button @click="activeTab = 'collection'" class="pb-3 text-sm tracking-[0.2em] font-bold transition-colors relative" :class="activeTab === 'collection' ? 'text-cinnabar' : 'text-ink/40 hover:text-indigo'">我的画作 / Vah<span v-if="activeTab === 'collection'" class="absolute bottom-[-2px] left-0 w-full h-[2px] bg-cinnabar"></span></button>
          <button @click="activeTab = 'cards'" class="pb-3 text-sm tracking-[0.2em] font-bold transition-colors relative" :class="activeTab === 'cards' ? 'text-cinnabar' : 'text-ink/40 hover:text-indigo'">我的卡包 / Ka<span v-if="activeTab === 'cards'" class="absolute bottom-[-2px] left-0 w-full h-[2px] bg-cinnabar"></span></button>
          <button @click="activeTab = 'orders'" class="pb-3 text-sm tracking-[0.2em] font-bold transition-colors relative" :class="activeTab === 'orders' ? 'text-cinnabar' : 'text-ink/40 hover:text-indigo'">实体订单 / Dingdan<span v-if="activeTab === 'orders'" class="absolute bottom-[-2px] left-0 w-full h-[2px] bg-cinnabar"></span></button>
        </div>

        <!-- Tab 1: 我的画作 -->
        <div v-if="activeTab === 'collection'" class="animate-enter-fast">
          <div v-if="myCollection.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="artwork in myCollection" :key="artwork.id" class="group bg-white p-3 shadow-sm hover:shadow-lg transition-all border border-ink/5 relative flex flex-col">
              <div class="aspect-[4/3] overflow-hidden bg-gray-100 relative mb-3">
                <img :src="optimizeImage(artwork.art_image_url)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div v-if="artwork.status === 'ACCEPTED'" class="absolute inset-0 bg-gold/20 flex items-center justify-center backdrop-blur-[1px] z-10"><div class="bg-white/90 px-4 py-2 border-2 border-gold text-gold font-bold text-xs tracking-widest shadow-lg transform -rotate-12">已收录·可分润</div></div>
                <div v-else-if="artwork.status === 'SUBMITTED'" class="absolute inset-0 bg-indigo/20 flex items-center justify-center backdrop-blur-[1px] z-10"><div class="bg-indigo text-white px-4 py-2 text-xs tracking-widest shadow-lg">审核中...</div></div>
              </div>
              <h4 class="font-bold text-sm text-ink font-serif truncate">{{ artwork.user_theme || '无题' }}</h4>
              <button v-if="artwork.status === 'OWNED'" @click="handleSubmit(artwork)" class="mt-3 w-full py-2 bg-paper border border-indigo/20 text-indigo text-xs hover:bg-indigo hover:text-white transition-colors">申请收录 (赚取收益)</button>
              <div v-else class="mt-3 text-center text-[10px] text-ink/30 py-2 bg-paper">{{ artwork.status === 'ACCEPTED' ? '该作品正在为您赚取贡献值' : '等待管理员审核' }}</div>
            </div>
            <NuxtLink to="/chat" class="border-2 border-dashed border-ink/10 flex flex-col items-center justify-center text-ink/30 hover:text-cinnabar hover:border-cinnabar/30 transition-all min-h-[280px] bg-paper/50 rounded-sm"><span class="text-2xl mb-2 font-serif">+</span><span class="text-xs tracking-widest">共创更多作品</span></NuxtLink>
          </div>
          <div v-else class="text-center py-20 text-ink/40"><p>暂无藏品，去画廊看看吧</p></div>
        </div>

        <!-- Tab 2: 我的卡包 -->
        <div v-else-if="activeTab === 'cards'" class="animate-enter-fast">
           <div v-if="myCards.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div 
                v-for="card in myCards" 
                :key="card.id"
                @click="openCardDetail(card)"
                class="cursor-pointer bg-white rounded-lg shadow-sm border overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1 relative"
                :class="{
                  'border-gold/50 bg-gold/5': card.CardTemplate.rarity === 'SSR',
                  'border-purple-300 bg-purple-50': card.CardTemplate.rarity === 'SR',
                  'border-blue-200 bg-blue-50': card.CardTemplate.rarity === 'R'
                }"
             >
                <div class="aspect-[2/3] overflow-hidden relative">
                   <img :src="optimizeImage(card.CardTemplate.imageUrl)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-black italic bg-black/60 text-white backdrop-blur-sm z-10" :class="{ 'text-gold': card.CardTemplate.rarity === 'SSR', 'text-purple-400': card.CardTemplate.rarity === 'SR' }">{{ card.CardTemplate.rarity }}</div>
                   <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                      <div class="text-white font-mono text-[10px] opacity-90">NO.{{ String(card.cardNumber).padStart(4, '0') }}</div>
                   </div>
                </div>
                <div class="p-3 text-center"><div class="text-xs font-bold truncate mb-1 text-ink">{{ card.CardTemplate.name }}</div></div>
             </div>
           </div>
           <div v-else class="text-center py-20 bg-white border border-ink/5 rounded-sm"><div class="text-4xl mb-4 grayscale opacity-50">🃏</div><p class="text-ink/60 font-serif mb-4">暂无卡片</p><NuxtLink to="/market" class="text-xs text-indigo border-b border-indigo/20 hover:text-cinnabar">去锦绣集市抽取第一张卡</NuxtLink></div>
        </div>

        <!-- Tab 3: 订单 -->
        <div v-else class="animate-enter-fast space-y-4">
          <div v-if="myOrders.length > 0" class="space-y-4">
            <div v-for="order in myOrders" :key="order.id" class="bg-white p-6 border border-ink/5 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
              <div class="w-24 h-24 bg-gray-100 shrink-0 overflow-hidden border border-ink/5">
                <img :src="optimizeImage(order.community_gallery?.mockup_url || order.community_gallery?.art_image_url || 'https://via.placeholder.com/150?text=Gift')" class="w-full h-full object-cover" @error="(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image'"/>
              </div>
              <div class="flex-1 text-center md:text-left w-full">
                <h4 class="font-bold text-indigo font-serif text-lg">{{ order.type === 'milestone_reward' ? '里程碑奖励：非遗盲盒' : `独家定制帆布袋 - ${order.community_gallery?.user_theme || '锦绣好礼'}` }}</h4>
                <p class="text-xs text-ink/50 mb-4">订单号: ZM{{ order.id }} · {{ new Date(order.created_at).toLocaleDateString() }}</p>
                <div class="w-full bg-ink/5 h-1.5 rounded-full overflow-hidden mb-2"><div class="bg-gold h-full relative" style="width: 30%"><div class="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div></div></div>
                <div class="flex justify-between text-[10px] text-ink/40 tracking-widest uppercase"><span>Ordered</span><span class="text-gold font-bold">Shipped</span><span>Delivered</span></div>
              </div>
              <div class="absolute top-0 right-0 bg-gold text-white text-[10px] px-3 py-1 font-bold tracking-widest">{{ order.status === 'pending_shipment' ? '待发货' : '运输中' }}</div>
            </div>
          </div>
          <div v-else class="text-center py-20 text-ink/40"><p>暂无订单</p></div>
        </div>

        <!-- 【新增】模块四：Agent 织梦日志 (传承卷轴) -->
        <div class="mt-12 opacity-0 animate-enter-medium" style="animation-delay: 0.4s">
          <div class="flex items-center gap-3 mb-6">
            <div class="h-[1px] flex-1 bg-gradient-to-r from-transparent via-indigo/20 to-transparent"></div>
            <h3 class="font-calligraphy text-2xl text-indigo flex items-center gap-2">
              <span>📜</span> 织梦日志
            </h3>
            <div class="h-[1px] flex-1 bg-gradient-to-r from-indigo/20 via-indigo/20 to-transparent"></div>
          </div>

          <div class="relative bg-white p-8 border-x-8 border-gold shadow-2xl overflow-hidden group min-h-[200px]">
            <!-- 卷轴装饰背景 -->
            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-50"></div>
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-indigo/5 rounded-full blur-[80px] group-hover:bg-cinnabar/5 transition-colors duration-1000"></div>
            
            <!-- 卷轴轴头视觉 -->
            <div class="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-yellow-700 via-gold to-yellow-700 shadow-lg z-20"></div>
            <div class="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-yellow-700 via-gold to-yellow-700 shadow-lg z-20"></div>

            <!-- Agent 思考状态 -->
            <div v-if="isGeneratingDiary" class="relative z-10 flex flex-col items-center py-10">
              <div class="spinner-zhuang mb-4"></div>
              <p class="text-xs text-indigo/40 animate-pulse font-serif italic tracking-widest">史官 Agent 正在检索经纬碎片，为您编撰卷轴...</p>
            </div>

            <!-- 日志内容 -->
            <div v-else class="relative z-10 animate-enter-fast">
              <div class="text-ink/80 leading-[2.2] font-serif text-justify indent-8 text-sm md:text-base italic px-4">
                {{ weavingDiary || '您的传承事迹尚未载入卷轴。点击下方按钮，唤醒 Agent 史官为您复盘这段云端非遗旅途。' }}
              </div>
              <div class="mt-10 text-center md:text-right">
                <button 
                  @click="generateDiary"
                  class="px-6 py-2 border-2 border-indigo text-indigo text-[10px] tracking-[0.3em] uppercase hover:bg-indigo hover:text-white transition-all font-bold rounded-sm shadow-md active:scale-95"
                >
                  {{ weavingDiary ? '重书卷轴 / Rewrite' : '编撰卷轴 / Write' }}
                </button>
              </div>
            </div>
          </div>
          
          <p class="text-[9px] text-center text-ink/20 mt-4 tracking-[0.3em] uppercase font-mono">
            Chronicle System v1.2 · Powered by Historian Agent
          </p>
        </div>

      </div>
    </div>

    <!-- 弹窗组件挂载区 -->
    <ClientOnly>
      <Transition name="modal"><DigitalCertificate v-if="showCert" :title="certData.title" :image-url="certData.imageUrl" :hash="certData.hash" :owner="currentUser?.username || 'Unknown'" :date="certData.date" @close="showCert = false" /></Transition>
      
      <!-- 积分账单弹窗 -->
      <Transition name="modal">
        <div v-if="showLogModal" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-ink/80 backdrop-blur-sm" @click="showLogModal = false"></div>
          <div class="bg-paper w-full max-w-md rounded-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh] animate-enter-fast border-t-4 border-indigo">
            <div class="p-6 border-b border-ink/10 flex justify-between items-center bg-white">
              <h3 class="font-calligraphy text-2xl text-indigo">贡献值记录</h3>
              <button @click="showLogModal = false" class="text-2xl text-ink/30 hover:text-cinnabar">×</button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-fabric-texture">
              <div v-if="logs.length === 0" class="text-center py-10 text-ink/40 text-xs">暂无记录</div>
              <div v-for="log in logs" :key="log.id" class="bg-white p-4 rounded-sm shadow-sm border border-ink/5 flex justify-between items-center">
                <div>
                  <p class="font-bold text-sm text-ink mb-1">{{ log.reason }}</p>
                  <p class="text-[10px] text-ink/40 font-mono">{{ new Date(log.created_at).toLocaleString() }}</p>
                </div>
                <div class="font-mono font-bold text-lg" :class="log.type === 'income' ? 'text-cinnabar' : 'text-green-600'">
                  {{ log.type === 'income' ? '+' : '' }}{{ log.amount }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 卡牌展示弹窗 -->
      <Transition name="card-reveal">
        <div v-if="showCardModal && selectedCard" class="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden" @click.self="showCardModal = false">
          <div class="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
          <div class="absolute inset-0 pointer-events-none">
             <div v-if="selectedCard.CardTemplate.rarity === 'SSR'" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold/30 to-transparent blur-[80px] animate-pulse-slow"></div>
             <div v-if="selectedCard.CardTemplate.rarity === 'SR'" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/30 to-transparent blur-[100px] animate-pulse"></div>
             <div v-if="selectedCard.CardTemplate.rarity === 'R'" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-blue-500/20 to-transparent blur-[100px]"></div>
          </div>
          <div class="relative z-10 w-full max-w-lg flex flex-col items-center animate-card-pop">
            <div class="relative w-72 md:w-80 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 border-4" :class="{'border-gold shadow-gold/50': selectedCard.CardTemplate.rarity === 'SSR','border-purple-400': selectedCard.CardTemplate.rarity === 'SR','border-blue-400': selectedCard.CardTemplate.rarity === 'R'}">
              <div v-if="selectedCard.CardTemplate.rarity === 'SSR'" class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 z-20 w-[200%] h-[200%] -translate-x-full -translate-y-full animate-shine pointer-events-none"></div>
              <img :src="optimizeImage(selectedCard.CardTemplate.imageUrl)" class="w-full h-full object-cover" />
              <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12 z-10 text-center">
                <div class="text-3xl font-black italic mb-2 tracking-tighter" :class="{'text-gold': selectedCard.CardTemplate.rarity === 'SSR','text-purple-400': selectedCard.CardTemplate.rarity === 'SR','text-blue-400': selectedCard.CardTemplate.rarity === 'R'}">{{ selectedCard.CardTemplate.rarity }}</div>
                <div class="text-white font-bold text-xl font-serif mb-1">{{ selectedCard.CardTemplate.name }}</div>
                <div class="inline-block mt-2 px-3 py-1 border border-white/20 rounded-full bg-white/10 backdrop-blur-sm"><span class="text-xs text-white/60 font-mono mr-1">Unique ID:</span><span class="text-sm font-mono font-bold text-gold tracking-widest">No.{{ String(selectedCard.cardNumber).padStart(4, '0') }}</span></div>
              </div>
            </div>
            <div class="mt-8 flex gap-4"><button @click="showCardModal = false" class="px-6 py-2 rounded-full border border-white/20 text-white/60 hover:text-white transition-colors text-sm">关闭展示</button></div>
          </div>
        </div>
      </Transition>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, onActivated } from 'vue'
import DigitalCertificate from '~/components/DigitalCertificate.vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const { currentUser } = useAuth()
const { showToast } = useToast()
const activeTab = ref('collection')
const showCert = ref(false)
const showLogModal = ref(false)
const showCardModal = ref(false)
const selectedCard = ref<any>(null)

// 模块四变量
const weavingDiary = ref("")
const isGeneratingDiary = ref(false)

const certData = reactive({ title: '', imageUrl: '', hash: '', date: '' })
const myOrders = ref<any[]>([])
const myCards = ref<any[]>([])
const logs = ref<any[]>([])
const isLoading = ref(true)
const isSigningIn = ref(false)

const currentPoints = ref(0)
const copyrightEarnings = ref(0)
const realCreatedAt = ref('')
const lastSignInDate = ref<Date | null>(null)

const optimizeImage = (url: string) => {
  if (!url || url.includes('placeholder')) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=600&q=80&output=webp&n=-1`
}

const openCertificate = (artwork: any) => {
  certData.title = artwork.user_theme || '无题'
  certData.imageUrl = optimizeImage(artwork.art_image_url)
  certData.hash = artwork.unique_hash || 'PENDING'
  certData.date = artwork.created_at ? new Date(artwork.created_at).toLocaleDateString() : new Date().toLocaleDateString()
  showCert.value = true
}

const openCardDetail = (card: any) => {
  selectedCard.value = card
  showCardModal.value = true
}

const { data: galleryData, refresh: refreshGallery } = await useAsyncData('profile-gallery', () => $fetch('/api/gallery/list'), { lazy: true, server: false })

const myCollection = computed(() => {
  const list = galleryData.value ? (Array.isArray(galleryData.value) ? galleryData.value : galleryData.value.data) : []
  if (!currentUser.value) return []
  return list.filter((item: any) => item.owner_id === currentUser.value.id)
})

const acceptedCount = computed(() => myCollection.value.filter((item: any) => item.status === 'ACCEPTED').length)

const handleSubmit = async (artwork: any) => {
  if (!confirm(`确定申请收录吗？`)) return;
  try {
    await $fetch('/api/user/submit-work', { method: 'POST', body: { userId: currentUser.value.id, artworkId: artwork.id } })
    showToast('提交成功', 'success')
    refreshGallery()
  } catch (e: any) { showToast(e.message, 'error') }
}

const fetchUserInfo = async () => {
  if (!currentUser.value) return;
  try {
    const userInfo: any = await $fetch('/api/user/me', { params: { username: currentUser.value.username } });
    if (userInfo) {
      currentPoints.value = userInfo.points;
      realCreatedAt.value = userInfo.created_at;
      lastSignInDate.value = userInfo.last_sign_in;
    }
  } catch (error) {}
};

const fetchUserCards = async () => {
  if (!currentUser.value) return;
  try {
     const cards: any = await $fetch('/api/user/cards', { params: { userId: currentUser.value.id } });
     myCards.value = cards;
  } catch(e) {}
}

const fetchLogs = async () => {
  if (!currentUser.value) return;
  try {
    const data: any = await $fetch('/api/user/logs', { params: { userId: currentUser.value.id } });
    logs.value = data;
    copyrightEarnings.value = data
      .filter((l: any) => l.reason.includes('版权收益'))
      .reduce((sum: number, l: any) => sum + l.amount, 0);
  } catch(e) {}
}

// 模块四逻辑：编撰日志
const generateDiary = async () => {
  if (!currentUser.value) return
  isGeneratingDiary.value = true
  try {
    const res: any = await $fetch('/api/agent/diary', {
      params: { userId: currentUser.value.id }
    })
    weavingDiary.value = res.content
  } catch (e) {
    showToast('卷轴编撰中断，请重试', 'error')
  } finally {
    isGeneratingDiary.value = false
  }
}

const refreshAllData = async () => {
  if (!currentUser.value) return;
  try {
    await Promise.all([
      $fetch('/api/user/orders', { params: { username: currentUser.value.username } }).then(orders => { myOrders.value = (orders as any[]).reverse() }),
      fetchUserInfo(),
      fetchUserCards(),
      fetchLogs()
    ]);
  } catch (e) {
    showToast('数据同步异常', 'error')
  }
}

const handleSignIn = async () => {
  if (!currentUser.value || isSigningIn.value) return
  isSigningIn.value = true
  try {
    const res: any = await $fetch('/api/user/action', { method: 'POST', body: { userId: currentUser.value.id, action: 'signin' } })
    if (res.success) { showToast(res.message, 'success'); await refreshAllData(); } 
    else { showToast(res.message, 'info') }
  } catch (e) { showToast('签到失败', 'error') } 
  finally { isSigningIn.value = false }
}

onMounted(async () => {
  isLoading.value = true;
  await refreshAllData();
  // 页面挂载后可以自动生成一次日志
  if (currentUser.value) generateDiary();
  isLoading.value = false;
})

onActivated(async () => {
  await refreshAllData();
})

const daysJoined = computed(() => {
  if (!realCreatedAt.value) return 1
  const start = new Date(realCreatedAt.value).getTime()
  return Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)))
})

const userLevel = computed(() => {
  const p = currentPoints.value
  if (p < 50) return 'Lv.1 初识壮锦'
  if (p < 200) return 'Lv.2 纹样学徒'
  if (p < 500) return 'Lv.3 织锦匠人'
  if (p < 1000) return 'Lv.4 文化传承者'
  return 'Lv.5 非遗大师'
})

const isSignedToday = computed(() => {
  if (!lastSignInDate.value) return false
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const last = new Date(lastSignInDate.value); last.setHours(0, 0, 0, 0);
  return last.getTime() === today.getTime()
})

useHead({ title: '个人中心 - 壮脉智承' })
definePageMeta({ middleware: 'auth' })
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .bg-paper, .modal-leave-active .bg-paper { transition: all 0.3s ease-out; }
.modal-enter-from .bg-paper, .modal-leave-to .bg-paper { transform: scale(0.95) translateY(10px); opacity: 0; }

.card-reveal-enter-active, .card-reveal-leave-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.card-reveal-enter-from, .card-reveal-leave-to { opacity: 0; transform: scale(0.8) translateY(20px); filter: blur(10px); }

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}
.animate-shine { animation: shine 3s infinite linear; }
.animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
</style>