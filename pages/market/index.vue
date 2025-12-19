<template>
  <div class="min-h-screen pt-28 px-4 pb-20 bg-fabric-texture">
    <div class="max-w-7xl mx-auto">
      
      <!-- 头部 Banner (保持不变) -->
      <div class="relative bg-indigo text-paper rounded-xl overflow-hidden shadow-2xl mb-8 animate-enter-medium">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-cinnabar/20 rounded-full blur-3xl"></div>
        
        <div class="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between">
          <div class="space-y-4 text-center md:text-left">
            <div class="flex items-center justify-center md:justify-start gap-3 text-gold/80 text-sm font-bold tracking-[0.3em] uppercase">
              <span class="w-8 h-[1px] bg-gold/50"></span>
              <span>Marketplace</span>
            </div>
            <h1 class="font-calligraphy text-5xl md:text-6xl text-white">锦绣集市</h1>
            <p class="text-white/60 max-w-lg leading-relaxed font-serif">
              每一次抽取，都是与非遗文化的期遇。<br>
              收集限量数字藏品，支持原创纹样设计。
            </p>
          </div>
          
          <!-- 积分卡片 -->
          <div class="mt-8 md:mt-0 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-lg text-center min-w-[200px]">
            <p class="text-xs text-white/50 uppercase tracking-widest mb-2">My Balance</p>
            <div class="text-3xl font-bold font-mono text-gold mb-4">{{ currentUser?.points || 0 }}</div>
            <button @click="showRecharge = true" class="w-full py-2 bg-cinnabar hover:bg-white hover:text-cinnabar transition-colors text-xs font-bold tracking-widest text-white rounded-sm">充值 / CWN</button>
          </div>
        </div>
      </div>

      <!-- 【新增】排行榜区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-enter-medium" style="animation-delay: 0.1s">
        <!-- 勤耕榜 -->
        <div class="bg-white p-6 border-t-4 border-indigo shadow-sm relative overflow-hidden">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-calligraphy text-2xl text-indigo">勤耕织造榜</h3>
            <span class="text-xs text-ink/30 tracking-widest uppercase">Diligent Weavers</span>
          </div>
          <div class="space-y-3">
            <div v-for="(user, idx) in leaderboard?.diligenceList" :key="idx" class="flex items-center justify-between p-2 hover:bg-paper transition-colors rounded-sm">
              <div class="flex items-center gap-3">
                <span class="font-mono font-bold text-ink/30 italic w-4">#{{ idx + 1 }}</span>
                <div class="w-8 h-8 bg-indigo/10 rounded-full flex items-center justify-center text-xs font-bold text-indigo">{{ user.avatar }}</div>
                <span class="text-sm font-bold text-ink">{{ user.username }}</span>
              </div>
              <span class="text-xs font-mono text-cinnabar">{{ user.count }} 织</span>
            </div>
            <div v-if="!leaderboard?.diligenceList?.length" class="text-center text-xs text-ink/30 py-4">虚位以待</div>
          </div>
        </div>

        <!-- 锦鲤榜 -->
        <div class="bg-white p-6 border-t-4 border-gold shadow-sm relative overflow-hidden">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-calligraphy text-2xl text-gold">天眷锦鲤榜</h3>
            <span class="text-xs text-ink/30 tracking-widest uppercase">Lucky Stars</span>
          </div>
          <div class="space-y-3">
            <div v-for="(user, idx) in leaderboard?.luckyList" :key="idx" class="flex items-center justify-between p-2 hover:bg-paper transition-colors rounded-sm">
              <div class="flex items-center gap-3">
                <span class="font-mono font-bold text-ink/30 italic w-4">#{{ idx + 1 }}</span>
                <div class="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-xs font-bold text-gold">{{ user.avatar }}</div>
                <span class="text-sm font-bold text-ink">{{ user.username }}</span>
              </div>
              <span class="text-xs font-mono text-gold">{{ user.count }} SSR</span>
            </div>
            <div v-if="!leaderboard?.luckyList?.length" class="text-center text-xs text-ink/30 py-4">虚位以待</div>
          </div>
        </div>
      </div>

      <!-- 卡池列表 (保持不变) -->
      <div v-if="pending" class="text-center py-20">
        <div class="spinner-zhuang mx-auto mb-4"></div>
        <p class="text-ink/40 tracking-widest animate-pulse">正在布置集市...</p>
      </div>

      <div v-else-if="pools.length === 0" class="text-center py-20 bg-white/50 border border-ink/5 rounded-lg">
        <p class="text-xl text-ink/60 font-serif mb-2">暂无活动卡池</p>
        <p class="text-xs text-ink/30">请管理员在后台发布新的收藏集</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(pool, idx) in pools" :key="pool.id" class="group bg-white rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-ink/5 flex flex-col animate-enter-medium" :style="{ animationDelay: `${idx * 0.1}s` }">
          <div class="h-64 overflow-hidden relative">
            <img :src="optimizeImage(pool.coverUrl)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
            <div class="absolute bottom-4 left-4 text-white">
               <div class="bg-cinnabar px-2 py-0.5 text-[10px] font-bold inline-block rounded-sm mb-2">限时活动</div>
               <h3 class="font-bold text-xl font-serif tracking-wide shadow-black drop-shadow-md">{{ pool.title }}</h3>
            </div>
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <p class="text-xs text-ink/50 leading-relaxed mb-6 line-clamp-2 h-10">{{ pool.description }}</p>
            <div class="mt-auto flex items-center justify-between border-t border-ink/5 pt-4">
              <div class="text-xs text-ink/40 font-mono"><span class="block">包含卡面</span><span class="text-lg font-bold text-indigo">{{ pool._count.CardTemplate }}</span> 张</div>
              <div class="text-right"><div class="text-xs text-ink/40 mb-1">单抽仅需</div><div class="text-lg font-bold text-cinnabar font-mono">{{ pool.pricePerDraw }} 共创值</div></div>
            </div>
            <NuxtLink :to="`/market/${pool.id}`" class="mt-4 w-full py-3 bg-indigo text-white text-center text-sm font-bold tracking-[0.2em] hover:bg-cinnabar transition-colors">立即前往</NuxtLink>
          </div>
        </div>
      </div>

    </div>

    <!-- 充值弹窗 (保持不变) -->
    <Transition name="modal">
      <div v-if="showRecharge" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-ink/80 backdrop-blur-sm" @click="showRecharge = false"></div>
        <div class="bg-paper w-full max-w-sm p-8 rounded-lg shadow-2xl relative z-10 text-center animate-enter-fast border-t-4 border-gold">
          <h3 class="font-calligraphy text-3xl text-indigo mb-2">积分充值</h3>
          <p class="text-xs text-ink/40 mb-8 tracking-widest uppercase">Demo Recharge</p>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <button @click="handleRecharge(6480)" class="p-4 border border-ink/10 hover:border-gold hover:bg-gold/5 transition-all rounded-sm group"><div class="text-2xl mb-1">💎</div><div class="font-bold text-indigo group-hover:text-gold">6480 共创值</div></button>
            <button @click="handleRecharge(12800)" class="p-4 border border-ink/10 hover:border-gold hover:bg-gold/5 transition-all rounded-sm group"><div class="text-2xl mb-1">👑</div><div class="font-bold text-indigo group-hover:text-gold">12800 共创值</div></button>
          </div>
          <button @click="showRecharge = false" class="text-xs text-ink/40 hover:text-ink underline">取消</button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

const { currentUser } = useAuth()
const { showToast } = useToast()
const showRecharge = ref(false)

const optimizeImage = (url: string) => {
  if (!url) return '';
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=600&q=80&output=webp&n=-1`
}

const { data: pools, pending } = await useAsyncData('market-pools', () => $fetch('/api/market/pools'), { lazy: true })
// 【新增】获取排行榜数据
const { data: leaderboard } = await useAsyncData('market-leaderboard', () => $fetch('/api/market/leaderboard'), { lazy: true })

const handleRecharge = async (amount: number) => {
  if (!currentUser.value) return showToast('请先登录', 'error')
  try {
    const res: any = await $fetch('/api/user/recharge', { method: 'POST', body: { userId: currentUser.value.id, amount } })
    currentUser.value.points = res.points
    localStorage.setItem('current_session', JSON.stringify(currentUser.value))
    showToast(`充值成功！当前余额: ${res.points}`, 'success')
    showRecharge.value = false
  } catch (e) { showToast('充值失败', 'error') }
}

useHead({ title: '锦绣集市 - 壮脉智承' })
</script>