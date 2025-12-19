<template>
  <div class="min-h-screen bg-gray-900 text-white relative overflow-hidden flex flex-col items-center justify-center">
    
    <!-- 1. 背景氛围 -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-30"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo/50 to-black/90"></div>
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cinnabar/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <!-- 2. 顶栏 -->
    <div class="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center" v-if="phase === 'standby' || phase === 'summary'">
      <button @click="$router.back()" class="text-white/50 hover:text-white transition-colors flex items-center gap-2">
        <span>← 退出集市</span>
      </button>
      <div class="bg-black/40 backdrop-blur border border-white/10 px-4 py-1 rounded-full text-xs font-mono text-gold">
        余额: {{ currentUser?.points || 0 }} 共创值
      </div>
    </div>

    <!-- ==================== 阶段 1: 待机 (Standby) ==================== -->
    <div v-if="phase === 'standby'" class="relative z-10 max-w-4xl w-full px-4 flex flex-col gap-8 animate-enter-medium">
      
      <!-- 主内容区 -->
      <div class="flex flex-col md:flex-row gap-12 items-center">
        <!-- 封面卡 -->
        <div class="w-64 md:w-80 aspect-[2/3] bg-gray-800 rounded-xl border-4 border-gold/30 shadow-[0_0_50px_rgba(212,160,23,0.2)] relative overflow-hidden group">
          <img v-if="pool" :src="optimizeImage(pool.coverUrl)" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div class="absolute bottom-0 left-0 w-full p-6 text-center">
            <div class="text-gold font-bold text-2xl font-serif mb-1">{{ pool?.title }}</div>
            <div class="text-white/50 text-xs tracking-widest uppercase">Limited Collection</div>
          </div>
        </div>

        <!-- 操作区 -->
        <div class="flex-1 text-center md:text-left space-y-8">
          <div>
            <h1 class="text-4xl md:text-5xl font-calligraphy text-white mb-4">经纬织梦</h1>
            <p class="text-white/60 leading-relaxed font-serif max-w-md">{{ pool?.description }}</p>
          </div>
          <div class="flex items-center justify-center md:justify-start gap-4 text-sm text-white/40 font-mono uppercase tracking-widest">
            <span>SSR 5%</span> · <span>SR 15%</span> · <span>R 80%</span>
          </div>
          <div class="flex gap-6 justify-center md:justify-start">
            <button @click="startDraw(1)" class="w-32 py-4 border border-white/20 rounded-sm hover:bg-white/10 transition-colors flex flex-col items-center">
              <span class="text-sm font-bold tracking-widest">织造一次</span>
              <span class="text-[10px] text-white/50 mt-1">{{ pool?.pricePerDraw }} 共创值</span>
            </button>
            <button @click="startDraw(5)" class="w-40 py-4 bg-cinnabar rounded-sm shadow-[0_0_30px_rgba(188,47,46,0.6)] hover:bg-red-600 transition-all transform hover:-translate-y-1 flex flex-col items-center relative overflow-hidden group">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span class="text-lg font-bold tracking-widest font-calligraphy text-gold">五连织造</span>
              <span class="text-[10px] text-white/80 mt-1">{{ (pool?.pricePerDraw || 100) * 5 }} 共创值</span>
              <div class="absolute top-0 right-0 bg-gold text-black text-[9px] px-1.5 font-bold">必出R以上</div>
            </button>
          </div>
        </div>
      </div>

      <!-- 里程碑奖励进度条 -->
      <div class="bg-black/30 border border-white/10 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-gold to-yellow-700 rounded-lg flex items-center justify-center text-2xl shadow-lg">🎁</div>
          <div>
            <h4 class="text-gold font-bold text-lg">锦绣献礼</h4>
            <p class="text-white/50 text-xs">累计织造 {{ myDrawCount }}/10 次，必得实体非遗盲盒</p>
          </div>
        </div>
        <div class="flex-1 w-full max-w-sm">
          <div class="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div class="h-full bg-gold transition-all duration-1000 relative" :style="{ width: `${Math.min(myDrawCount * 10, 100)}%` }">
              <div class="absolute right-0 top-0 w-2 h-full bg-white/50 animate-pulse"></div>
            </div>
          </div>
        </div>
        <button 
          @click="openRewardModal"
          :disabled="myDrawCount < 10 || rewardClaimed"
          class="px-6 py-2 rounded text-xs font-bold tracking-widest transition-all"
          :class="(myDrawCount >= 10 && !rewardClaimed) ? 'bg-gold text-black hover:bg-white animate-pulse' : 'bg-white/10 text-white/30 cursor-not-allowed'"
        >
          {{ rewardClaimed ? '已领取' : (myDrawCount >= 10 ? '立即领取' : '未达成') }}
        </button>
      </div>
    </div>

    <!-- ==================== 阶段 2: 织造动画 (Animation) ==================== -->
    <div v-if="phase === 'animation'" class="absolute inset-0 z-40 flex items-center justify-center bg-black/95">
      <div class="relative w-full h-full max-w-5xl mx-auto overflow-hidden">
        <div class="absolute inset-0 flex justify-center gap-4 opacity-50"><div v-for="n in 12" :key="`v-${n}`" class="w-1 h-full bg-gradient-to-b from-transparent via-gold to-transparent animate-thread-v shadow-[0_0_10px_rgba(212,160,23,0.5)]" :style="{ animationDelay: `${n * 0.05}s` }"></div></div>
        <div class="absolute inset-0 flex flex-col justify-center gap-8 opacity-50"><div v-for="n in 8" :key="`h-${n}`" class="h-1 w-full bg-gradient-to-r from-transparent via-cinnabar to-transparent animate-thread-h shadow-[0_0_10px_rgba(188,47,46,0.5)]" :style="{ animationDelay: `${n * 0.05}s` }"></div></div>
        <div class="absolute top-1/2 left-0 w-full h-20 -translate-y-1/2 animate-shuttle-fly"><div class="w-32 h-8 bg-white blur-md absolute top-1/2 transform -translate-y-1/2 right-0"></div><div class="w-16 h-8 bg-gold rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 shadow-[0_0_50px_rgba(255,255,255,1)]"></div></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><div class="w-8 h-8 bg-white rounded-full animate-core-expand shadow-[0_0_100px_rgba(255,255,255,1)]"></div></div>
        <div class="absolute bottom-32 w-full text-center"><p class="text-gold font-calligraphy text-4xl animate-pulse tracking-[0.5em] shadow-black drop-shadow-lg">织造中...</p></div>
      </div>
    </div>

    <!-- ==================== 阶段 3: SSR 演出 (Cutscene) ==================== -->
    <div v-if="phase === 'ssr_cutscene'" class="absolute inset-0 z-[60] bg-black flex items-center justify-center overflow-hidden cursor-pointer" @click="endSSRCutscene">
      <div class="absolute inset-0 bg-gradient-radial from-gold/40 to-black animate-pulse-fast"></div>
      <div class="absolute top-1/2 left-1/2 w-[2px] h-[2px] shadow-[0_0_1000px_300px_rgba(255,215,0,0.8)] animate-explode"></div>
      <div class="relative z-10 text-center animate-scale-in">
        <div class="text-[120px] md:text-[200px] text-gold font-calligraphy drop-shadow-[0_0_30px_rgba(212,160,23,0.8)] leading-none">天工<br>开物</div>
        <p class="text-white/80 tracking-[1em] text-xl mt-8 font-serif uppercase">Legendary Artifact</p>
      </div>
    </div>

    <!-- ==================== 阶段 4: 逐张揭示 (Reveal) ==================== -->
    <div v-if="phase === 'reveal'" class="relative z-50 w-full h-full flex flex-col items-center justify-center cursor-pointer" @click="nextCard">
      
      <!-- 进度指示器 -->
      <div class="absolute top-8 flex gap-2 z-50">
        <div v-for="(card, idx) in drawResults" :key="idx" class="w-16 h-1.5 rounded-full transition-all duration-300" 
          :class="[
            idx === currentRevealIndex ? 'bg-white' : (idx < currentRevealIndex ? 'bg-white/40' : 'bg-white/10'),
            (card.rarity === 'SSR' && idx <= currentRevealIndex) ? 'shadow-[0_0_10px_gold] bg-gold' : ''
          ]"
        ></div>
      </div>

      <!-- 卡片展示容器 -->
      <div :key="currentRevealIndex" class="relative animate-card-appear">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-60 pointer-events-none"
          :class="{'bg-gold': currentCard.rarity === 'SSR', 'bg-purple-600': currentCard.rarity === 'SR', 'bg-blue-600': currentCard.rarity === 'R'}"></div>
        <div class="relative w-80 aspect-[2/3] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-[6px]"
          :class="{'border-gold shadow-[0_0_60px_rgba(212,160,23,0.6)]': currentCard.rarity === 'SSR', 'border-purple-500 shadow-purple-500/50': currentCard.rarity === 'SR', 'border-blue-500 shadow-blue-500/50': currentCard.rarity === 'R'}">
          <img :src="optimizeImage(currentCard.imageUrl)" class="absolute inset-0 w-full h-full object-cover z-0" style="background-color: #1a1a1a;" />
          <div class="absolute top-2 right-2 text-5xl font-black italic text-transparent bg-clip-text drop-shadow-md z-10"
             :class="{'bg-gradient-to-b from-yellow-300 to-yellow-600': currentCard.rarity === 'SSR', 'text-purple-400': currentCard.rarity === 'SR', 'text-blue-400': currentCard.rarity === 'R'}">{{ currentCard.rarity }}</div>
          <div class="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12 text-center z-10">
            <div class="text-white font-bold text-xl font-serif mb-1">{{ currentCard.cardName }}</div>
            <div class="text-white/50 text-[10px] uppercase tracking-widest">Tap to continue</div>
          </div>
        </div>
      </div>

      <button @click.stop="finishDraw" class="absolute bottom-12 right-8 text-white/40 text-sm border-b border-white/20 hover:text-white transition-colors z-50">跳过 (Skip)</button>
    </div>

    <!-- ==================== 阶段 5: 结算总览 (Summary) ==================== -->
    <div v-if="phase === 'summary'" class="relative z-50 w-full max-w-5xl px-4 animate-enter-fast flex flex-col items-center">
      <h2 class="text-3xl font-calligraphy text-white mb-8">织造完成</h2>
      <div class="flex flex-wrap justify-center gap-4 mb-10">
        <div v-for="(card, idx) in drawResults" :key="idx" 
          class="relative w-32 md:w-40 aspect-[2/3] rounded-lg overflow-hidden border-2 transition-transform hover:scale-110 hover:z-10 bg-gray-800 animate-pop-in"
          :style="{ animationDelay: `${idx * 0.1}s` }"
          :class="{'border-gold shadow-[0_0_20px_gold]': card.rarity === 'SSR', 'border-purple-500': card.rarity === 'SR', 'border-blue-500': card.rarity === 'R'}">
          <img :src="optimizeImage(card.imageUrl)" class="w-full h-full object-cover absolute inset-0" />
          <div class="absolute bottom-0 w-full bg-black/60 text-[10px] text-center py-1 truncate px-1 z-10">{{ card.cardName }}</div>
          <div v-if="card.rarity === 'SSR'" class="absolute top-1 right-1 text-gold font-black text-xs z-10">SSR</div>
        </div>
      </div>
      <div class="flex gap-6">
        <button @click="resetToStandby" class="px-8 py-3 border border-white/30 rounded text-white hover:bg-white/10">返回集市</button>
        <button @click="startDraw(drawResults.length)" class="px-8 py-3 bg-cinnabar rounded text-white font-bold hover:bg-red-600 shadow-lg">再来一次</button>
      </div>
    </div>

    <!-- 领奖弹窗 -->
    <Transition name="modal">
      <div v-if="showRewardModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 text-ink">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="showRewardModal = false"></div>
        <div class="bg-paper w-full max-w-md p-8 rounded-lg shadow-2xl relative z-10 border-t-4 border-gold animate-enter-fast">
          <div class="text-center mb-6">
            <div class="text-4xl mb-2">🎁</div>
            <h3 class="font-calligraphy text-3xl text-indigo">领取锦绣好礼</h3>
            <p class="text-xs text-ink/40 mt-2">恭喜达成 10 次织造里程碑！</p>
          </div>
          <form @submit.prevent="handleClaimReward" class="space-y-4">
            <div class="space-y-1"><label class="text-xs font-bold text-ink/50 uppercase">收货人</label><input required v-model="rewardForm.name" type="text" class="w-full bg-white border border-ink/10 p-2 text-sm" placeholder="姓名"></div>
            <div class="space-y-1"><label class="text-xs font-bold text-ink/50 uppercase">电话</label><input required v-model="rewardForm.phone" type="tel" class="w-full bg-white border border-ink/10 p-2 text-sm" placeholder="手机号"></div>
            <div class="space-y-1"><label class="text-xs font-bold text-ink/50 uppercase">地址</label><textarea required v-model="rewardForm.address" rows="2" class="w-full bg-white border border-ink/10 p-2 text-sm" placeholder="详细地址"></textarea></div>
            <button type="submit" class="w-full py-3 bg-gold text-black font-bold mt-4 hover:bg-yellow-500 transition-colors shadow-md">确认领取 (0元)</button>
          </form>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const router = useRouter()
const { currentUser } = useAuth()
const { showToast } = useToast()

const poolId = parseInt(route.params.id as string)
const { data: pools } = await useAsyncData('market-pools', () => $fetch('/api/market/pools'))
const pool = computed(() => pools.value?.find((p: any) => p.id === poolId))

const optimizeImage = (url: string) => url || ''

type Phase = 'standby' | 'animation' | 'reveal' | 'ssr_cutscene' | 'summary'
const phase = ref<Phase>('standby')
const drawResults = ref<any[]>([])
const currentRevealIndex = ref(0)
const myDrawCount = ref(0)
const rewardClaimed = ref(false)
const showRewardModal = ref(false)
const rewardForm = reactive({ name: '', phone: '', address: '' })

const currentCard = computed(() => drawResults.value[currentRevealIndex] || {})
const isLastCard = computed(() => currentRevealIndex.value >= drawResults.value.length - 1)

// 获取进度数据
const fetchDrawStats = async () => {
  if (!currentUser.value) return
  try {
    const cards: any = await $fetch('/api/user/cards', { params: { userId: currentUser.value.id } })
    myDrawCount.value = cards.length
    const orders: any = await $fetch('/api/user/orders', { params: { username: currentUser.value.username } })
    rewardClaimed.value = orders.some((o: any) => o.type === 'milestone_reward')
  } catch (e) {}
}

onMounted(fetchDrawStats)

const preloadImages = (cards: any[]) => {
  cards.forEach(card => { if (card.imageUrl) { const img = new Image(); img.src = card.imageUrl; } });
}

const startDraw = async (count: number) => {
  if (!currentUser.value) return showToast('请先登录', 'error')
  if ((currentUser.value.points || 0) < (pool.value?.pricePerDraw || 100) * count) {
    return showToast('积分不足', 'error')
  }

  phase.value = 'animation'
  currentRevealIndex.value = 0
  drawResults.value = []

  const minWait = new Promise(resolve => setTimeout(resolve, 1200))
  const apiReq = $fetch('/api/market/draw', { method: 'POST', body: { userId: currentUser.value.id, poolId, count } })

  try {
    const [_, res] = await Promise.all([minWait, apiReq]) as [any, any]
    if (res.success) {
      drawResults.value = res.data.cards
      preloadImages(res.data.cards)
      currentUser.value.points = res.data.remainingPoints
      localStorage.setItem('current_session', JSON.stringify(currentUser.value))
      // 成功抽卡后增加本地进度显示
      myDrawCount.value += count
      checkAndShowCard()
    }
  } catch (e: any) {
    phase.value = 'standby'
    showToast(e.data?.message || '织造失败', 'error')
  }
}

const checkAndShowCard = () => {
  const card = drawResults.value[currentRevealIndex];
  if (card && card.rarity === 'SSR') {
    phase.value = 'ssr_cutscene'
    setTimeout(() => { if (phase.value === 'ssr_cutscene') endSSRCutscene() }, 3000)
  } else { phase.value = 'reveal' }
}

const endSSRCutscene = () => { phase.value = 'reveal' }
const nextCard = () => { if (!isLastCard.value) { currentRevealIndex.value++; checkAndShowCard(); } else { finishDraw(); } }
const finishDraw = () => { phase.value = 'summary' }
const resetToStandby = () => { phase.value = 'standby' }

const openRewardModal = () => { showRewardModal.value = true }
const handleClaimReward = async () => {
  try {
    await $fetch('/api/user/claim-reward', { method: 'POST', body: { userId: currentUser.value.id, ...rewardForm } })
    showToast('领取成功！请至个人中心查看订单', 'success')
    showRewardModal.value = false
    rewardClaimed.value = true
  } catch (e: any) { showToast(e.data?.message || '领取失败', 'error') }
}

useHead({ title: '织造 - 锦绣集市' })
definePageMeta({ middleware: 'auth', layout: false })
</script>

<style scoped>
@keyframes thread-v { 0% { transform: scaleY(0); transform-origin: top; } 50% { transform: scaleY(1); } 100% { transform: scaleY(0); transform-origin: bottom; } }
@keyframes thread-h { 0% { transform: scaleX(0); transform-origin: left; } 50% { transform: scaleX(1); } 100% { transform: scaleX(0); transform-origin: right; } }
@keyframes shuttle-fly { 0% { left: -10%; } 100% { left: 110%; } }
@keyframes core-expand { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0; } 50% { transform: translate(-50%, -50%) scale(20); opacity: 1; } 100% { opacity: 0; } }
@keyframes card-appear { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes pop-in { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
@keyframes explode { 0% { transform: translate(-50%, -50%) scale(0); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 0; } }
@keyframes scale-in { 0% { transform: scale(2); opacity: 0; filter: blur(20px); } 100% { transform: scale(1); opacity: 1; filter: blur(0); } }

.animate-thread-v { animation: thread-v 0.8s ease-in-out infinite; }
.animate-thread-h { animation: thread-h 0.8s ease-in-out infinite; }
.animate-shuttle-fly { animation: shuttle-fly 1.0s ease-in-out infinite; }
.animate-core-expand { animation: core-expand 1.2s cubic-bezier(0.7, 0, 0.84, 0) forwards; }
.animate-card-appear { animation: card-appear 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards; }
.animate-pop-in { animation: pop-in 0.3s ease-out backwards; }
.animate-explode { animation: explode 1s ease-out forwards; }
.animate-scale-in { animation: scale-in 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards; }
.animate-pulse-fast { animation: pulse 0.5s infinite; }
</style>