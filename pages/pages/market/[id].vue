<template>
  <div class="min-h-screen bg-gray-900 text-white relative overflow-hidden flex flex-col items-center justify-center">
    
    <!-- 背景氛围 -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-30"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo/50 to-black/90"></div>
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cinnabar/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <!-- 顶栏返回 -->
    <div class="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center">
      <button @click="$router.back()" class="text-white/50 hover:text-white transition-colors flex items-center gap-2">
        <span>← 退出集市</span>
      </button>
      <div class="bg-black/40 backdrop-blur border border-white/10 px-4 py-1 rounded-full text-xs font-mono text-gold">
        余额: {{ currentUser?.points || 0 }} pts
      </div>
    </div>

    <!-- 状态 1: 详情与待机 -->
    <div v-if="!isDrawing && !showResult" class="relative z-10 max-w-4xl w-full px-4 flex flex-col gap-8 animate-enter-medium">
      
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
            <p class="text-white/60 leading-relaxed font-serif max-w-md">
              {{ pool?.description }}
            </p>
          </div>

          <div class="space-y-2">
            <div class="flex items-center gap-4 text-sm text-white/40 font-mono uppercase tracking-widest">
              <span>概率公示:</span>
              <span class="text-gold">SSR 5%</span>
              <span class="text-purple-400">SR 15%</span>
              <span class="text-blue-400">R 80%</span>
            </div>
          </div>

          <div class="flex gap-4 justify-center md:justify-start">
            <button 
              @click="handleDraw" 
              class="relative overflow-hidden group bg-cinnabar px-12 py-5 rounded-sm shadow-[0_0_30px_rgba(188,47,46,0.6)] hover:shadow-[0_0_50px_rgba(188,47,46,0.8)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span class="relative z-10 font-bold tracking-[0.2em] text-white flex flex-col items-center leading-none">
                <span class="text-2xl mb-1">开始织造</span>
                <span class="text-[10px] opacity-80 font-mono">-{{ pool?.pricePerDraw }} pts</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- 【新增】里程碑奖励进度条 -->
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

    <!-- 状态 2: 增强版织造动画 (高对比度/适合投影) -->
    <div v-if="isDrawing" class="absolute inset-0 z-40 flex items-center justify-center bg-black/95">
      <!-- 经纬线动画容器 -->
      <div class="relative w-full h-full max-w-5xl mx-auto overflow-hidden">
        <!-- 经线 (竖) - 加粗 -->
        <div class="absolute inset-0 flex justify-center gap-4 opacity-50">
          <div v-for="n in 12" :key="`v-${n}`" class="w-1 h-full bg-gradient-to-b from-transparent via-gold to-transparent animate-thread-v shadow-[0_0_10px_rgba(212,160,23,0.5)]" :style="{ animationDelay: `${n * 0.1}s` }"></div>
        </div>
        <!-- 纬线 (横) - 加粗 -->
        <div class="absolute inset-0 flex flex-col justify-center gap-8 opacity-50">
          <div v-for="n in 8" :key="`h-${n}`" class="h-1 w-full bg-gradient-to-r from-transparent via-cinnabar to-transparent animate-thread-h shadow-[0_0_10px_rgba(188,47,46,0.5)]" :style="{ animationDelay: `${n * 0.1}s` }"></div>
        </div>
        
        <!-- 金梭穿梭动画 (Shuttle) -->
        <div class="absolute top-1/2 left-0 w-full h-20 -translate-y-1/2 animate-shuttle-fly">
           <div class="w-32 h-8 bg-white blur-md absolute top-1/2 transform -translate-y-1/2 right-0"></div>
           <div class="w-16 h-8 bg-gold rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 shadow-[0_0_50px_rgba(255,255,255,1)]"></div>
        </div>

        <!-- 核心光球爆发 -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div class="w-8 h-8 bg-white rounded-full animate-core-expand shadow-[0_0_100px_rgba(255,255,255,1)]"></div>
        </div>
        
        <!-- 文字提示 -->
        <div class="absolute bottom-32 w-full text-center">
           <p class="text-gold font-calligraphy text-4xl animate-pulse tracking-[0.5em] shadow-black drop-shadow-lg">织造中...</p>
        </div>
      </div>
    </div>

    <!-- 状态 3: 结果展示 (Result Reveal) -->
    <div v-if="showResult && drawResult" class="relative z-50 animate-enter-fast flex flex-col items-center">
      
      <!-- 光效背景 -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-60"
        :class="{
          'bg-gold': drawResult.rarity === 'SSR',
          'bg-purple-600': drawResult.rarity === 'SR',
          'bg-blue-600': drawResult.rarity === 'R'
        }"
      ></div>

      <!-- 卡片主体 -->
      <div class="relative w-80 aspect-[2/3] bg-gray-900 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 border-[6px]"
        :class="{
          'border-gold shadow-[0_0_60px_rgba(212,160,23,0.6)]': drawResult.rarity === 'SSR',
          'border-purple-500 shadow-purple-500/50': drawResult.rarity === 'SR',
          'border-blue-500 shadow-blue-500/50': drawResult.rarity === 'R'
        }"
      >
        <img :src="optimizeImage(drawResult.imageUrl)" class="w-full h-full object-cover" />
        
        <div class="absolute top-0 right-0 p-4">
          <div class="text-5xl font-black italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            :class="{
              'text-gold': drawResult.rarity === 'SSR',
              'text-purple-400': drawResult.rarity === 'SR',
              'text-blue-400': drawResult.rarity === 'R'
            }"
          >
            {{ drawResult.rarity }}
          </div>
        </div>

        <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12">
          <div class="text-white font-bold text-2xl font-serif mb-1">{{ drawResult.cardName }}</div>
          <div class="text-white/60 text-xs font-mono uppercase">ZhuangMai Collection</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-12 flex gap-6 relative z-50">
        <button @click="resetDraw" class="px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-full text-white transition-colors font-bold tracking-widest">
          返回集市
        </button>
        <button @click="handleDraw" class="px-12 py-4 bg-cinnabar hover:bg-red-600 text-white font-bold tracking-widest rounded-full shadow-[0_0_30px_rgba(188,47,46,0.6)] transition-all transform hover:scale-105 flex flex-col items-center leading-none justify-center">
          <span class="text-lg">再织一次</span>
        </button>
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

const isDrawing = ref(false)
const showResult = ref(false)
const drawResult = ref<any>(null)
const myDrawCount = ref(0)
const rewardClaimed = ref(false)
const showRewardModal = ref(false)
const rewardForm = reactive({ name: '', phone: '', address: '' })

// 获取用户卡包来计算抽数（简单逻辑）
const fetchDrawStats = async () => {
  if (!currentUser.value) return
  try {
    // 复用 card 接口获取总数，或者最好单独写个 count 接口，这里为了省事直接取列表长度
    const cards: any = await $fetch('/api/user/cards', { params: { userId: currentUser.value.id } })
    myDrawCount.value = cards.length
    // 检查是否领过奖
    const orders: any = await $fetch('/api/user/orders', { params: { username: currentUser.value.username } })
    rewardClaimed.value = orders.some((o: any) => o.type === 'milestone_reward')
  } catch (e) {}
}

onMounted(() => fetchDrawStats())

const optimizeImage = (url: string) => {
  if (!url) return '';
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=800&q=85&output=webp&n=-1`
}

const handleDraw = async () => {
  if (!currentUser.value) return showToast('请先登录', 'error')
  if ((currentUser.value.points || 0) < (pool.value?.pricePerDraw || 100)) {
    return showToast('积分不足，请先前往集市充值', 'error')
  }

  isDrawing.value = true
  showResult.value = false
  drawResult.value = null

  try {
    const res: any = await $fetch('/api/market/draw', {
      method: 'POST',
      body: { userId: currentUser.value.id, poolId, count: 1 }
    })

    if (res.success) {
      drawResult.value = res.data
      currentUser.value.points = res.data.remainingPoints
      localStorage.setItem('current_session', JSON.stringify(currentUser.value))
      
      // 动画 2.5s
      setTimeout(() => {
        isDrawing.value = false
        showResult.value = true
        myDrawCount.value++ // 增加本地计数
      }, 2500)
    }
  } catch (e: any) {
    isDrawing.value = false
    showToast(e.data?.message || '织造失败', 'error')
  }
}

const openRewardModal = () => {
  showRewardModal.value = true
}

const handleClaimReward = async () => {
  try {
    await $fetch('/api/user/claim-reward', {
      method: 'POST',
      body: { 
        userId: currentUser.value.id,
        ...rewardForm
      }
    })
    showToast('领取成功！请至个人中心查看订单', 'success')
    showRewardModal.value = false
    rewardClaimed.value = true
  } catch (e: any) {
    showToast(e.data?.message || '领取失败', 'error')
  }
}

const resetDraw = () => {
  showResult.value = false
  drawResult.value = null
  router.push('/market')
}

useHead({ title: '织造 - 锦绣集市' })
definePageMeta({ middleware: 'auth', layout: false })
</script>

<style scoped>
/* 经纬线动画 - 投影优化版 */
@keyframes thread-v {
  0% { transform: scaleY(0); transform-origin: top; opacity: 0; }
  50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
  100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
}
@keyframes thread-h {
  0% { transform: scaleX(0); transform-origin: left; opacity: 0; }
  50% { transform: scaleX(1); transform-origin: left; opacity: 1; }
  100% { transform: scaleX(0); transform-origin: right; opacity: 0; }
}
@keyframes shuttle-fly {
  0% { left: -10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: 110%; opacity: 0; }
}
@keyframes core-expand {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  50% { transform: translate(-50%, -50%) scale(20); opacity: 1; }
  80% { transform: translate(-50%, -50%) scale(60); opacity: 1; background: white; }
  100% { transform: translate(-50%, -50%) scale(150); opacity: 0; }
}

.animate-thread-v { animation: thread-v 1.5s ease-in-out infinite; }
.animate-thread-h { animation: thread-h 1.5s ease-in-out infinite; }
.animate-shuttle-fly { animation: shuttle-fly 2s ease-in-out infinite; }
.animate-core-expand { animation: core-expand 2.5s cubic-bezier(0.7, 0, 0.84, 0) forwards; }
</style>