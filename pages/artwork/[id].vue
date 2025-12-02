
<template>
  <div class="min-h-screen pt-24 pb-12 px-4 bg-paper relative">
    
    <button @click="$router.back()" class="fixed top-24 left-4 z-40 w-10 h-10 border border-ink/10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-ink hover:bg-indigo hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group hidden md:flex" title="返回 / Dauq"><span class="group-hover:-translate-x-0.5 transition-transform">←</span></button>
    <div class="md:hidden mb-6"><button @click="$router.back()" class="text-ink/50 hover:text-cinnabar flex items-center text-sm"><span>← Ranzva (返回)</span></button></div>
    
    <div v-if="pending || assetsLoading" class="flex flex-col items-center justify-center py-40 space-y-8"><div class="spinner-zhuang"></div><div class="animate-pulse text-indigo/60 tracking-widest font-serif text-xs uppercase">{{ pending ? 'Reading Data...' : 'Rendering Assets...' }}</div></div>
    
    <div v-else-if="error || !artwork" class="text-center py-40 opacity-0 animate-enter-fast"><h2 class="text-3xl font-calligraphy text-ink mb-4">作品未找到</h2><NuxtLink to="/gallery" class="text-cinnabar border-b border-cinnabar/30 hover:border-cinnabar transition-colors pb-1">返回画廊</NuxtLink></div>

    <div v-else class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        <!-- 左侧：作品展示 -->
        <div class="lg:col-span-5 relative opacity-0 animate-enter-medium group lg:sticky lg:top-32" style="animation-delay: 0.05s">
          <div class="absolute inset-0 bg-ink/5 transform translate-x-4 translate-y-4 rounded-sm transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
          <div class="relative bg-white p-4 shadow-lg border border-ink/5 rotate-1 group-hover:rotate-0 transition-transform duration-700 ease-out z-10">
            <img :src="optimizeDetailImage(artwork.art_image_url)" :alt="artwork.user_theme" class="w-full h-auto object-cover select-none" />
          </div>
          
          <!-- 互动栏：点赞与Hash -->
          <div class="mt-6 flex justify-between items-center bg-white/50 p-3 rounded-sm border border-ink/5">
             <div class="text-[9px] text-ink/30 font-mono break-all w-2/3 truncate">HASH: {{ artwork.unique_hash || 'PENDING' }}</div>
             <!-- 点赞按钮 -->
             <button @click="toggleLike" class="flex items-center space-x-1 group">
                <span class="text-xl transition-transform group-active:scale-125" :class="interactData.liked ? 'text-cinnabar' : 'text-ink/20'">♥</span>
                <span class="text-xs font-mono text-ink/60">{{ interactData.likes }}</span>
             </button>
          </div>
        </div>

        <!-- 右侧：信息与互动 -->
        <div class="lg:col-span-7 space-y-8">
          <div class="opacity-0 animate-enter-medium" style="animation-delay: 0.2s"><h1 class="font-calligraphy text-5xl lg:text-6xl text-ink mb-4 leading-tight">{{ artwork.user_theme || '无题' }}</h1><div class="flex items-center space-x-3 text-ink/60"><span class="w-12 h-[1px] bg-cinnabar"></span><span class="font-serif italic tracking-wide">Boux {{ artwork.user_name || '匿名创作者' }}</span></div></div>

          <div v-if="formattedInterpretation" class="opacity-0 animate-enter-medium relative" style="animation-delay: 0.25s">
            <div class="absolute -top-3 -left-2 text-6xl text-ink/5 font-serif">“</div>
            <div class="relative bg-white/40 p-6 border-y border-ink/10 backdrop-blur-sm">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold text-indigo flex items-center text-sm tracking-widest uppercase"><span class="mr-2">🔮</span> AI Gaii</h3>
                <button @click="showPatternModal = true" class="text-xs text-cinnabar border border-cinnabar/30 px-2 py-1 hover:bg-cinnabar hover:text-white transition-colors flex items-center gap-1"><span>◎</span> 纹样解构</button>
              </div>
              <div class="text-ink/90 leading-relaxed font-serif text-sm md:text-base whitespace-pre-wrap markdown-body">{{ formattedInterpretation }}</div>
            </div>
            <div class="absolute -bottom-6 right-4 text-6xl text-ink/5 font-serif rotate-180">“</div>
          </div>

          <div v-if="artwork.audio_url" class="opacity-0 animate-enter-medium" style="animation-delay: 0.3s"><div class="bg-indigo/5 border border-indigo/10 rounded-full p-2 pr-6 flex items-center space-x-4 transition-all hover:bg-indigo/10"><button @click="toggleAudio" class="w-10 h-10 bg-indigo text-white rounded-full flex items-center justify-center hover:bg-cinnabar transition-colors shadow-sm shrink-0"><span v-if="isPlaying">❚❚</span><span v-else>▶</span></button><div class="flex-1 overflow-hidden"><div class="text-xs text-indigo/60 font-bold uppercase tracking-widest mb-0.5">Sing Vwnz</div><div class="text-sm text-ink font-serif truncate">非遗之声 · 听见壮锦</div></div><audio ref="audioRef" :src="artwork.audio_url" @ended="isPlaying = false" class="hidden"></audio></div></div>

          <div class="opacity-0 animate-enter-medium" style="animation-delay: 0.35s"><div class="flex items-start space-x-4 bg-paper border border-gold/30 p-4 rounded-lg shadow-sm"><div class="bg-cinnabar text-white w-10 h-10 flex items-center justify-center rounded-full shrink-0 font-calligraphy text-xl shadow-md">签</div><div><h4 class="font-bold text-ink text-sm mb-1">今日纹样灵签</h4><p class="text-ink/60 text-sm italic">“{{ displayFortune }}”</p></div></div></div>

          <div class="grid grid-cols-2 gap-4 opacity-0 animate-enter-medium" style="animation-delay: 0.4s">
            <NuxtLink to="/chat" class="py-3 border border-ink text-ink hover:bg-ink hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 group"><span class="group-hover:-rotate-12 transition-transform">🎨</span><span>生成类似作品</span></NuxtLink>
            <button @click="showShareModal = true" class="py-3 bg-cinnabar text-white hover:bg-red-800 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 flex items-center justify-center space-x-2"><span>📤</span><span>一键分享</span></button>
          </div>
        </div>
      </div>

      <!-- 文创部分 -->
      <div class="opacity-0 animate-enter-medium mb-16" style="animation-delay: 0.5s">
         <div class="flex items-center justify-center mb-10 space-x-4"><div class="h-[1px] w-12 bg-ink/20"></div><h3 class="font-calligraphy text-3xl text-ink">文创衍生品预览</h3><div class="h-[1px] w-12 bg-ink/20"></div></div>
         <div @click="openProductModal" class="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg border border-ink/5 flex flex-col md:flex-row transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 max-w-4xl mx-auto">
            <div class="w-full md:w-1/2 h-64 md:h-80 bg-gray-100 relative overflow-hidden flex items-center justify-center">
               <div class="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10"></div>
               <img :src="optimizeDetailImage(artwork.mockup_url || artwork.art_image_url)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div v-if="!artwork.mockup_url" class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-4"><span class="text-white text-xs tracking-[0.2em] uppercase border border-white/50 px-3 py-1 backdrop-blur-sm">Gawq Fuz</span></div>
            </div>
            <div class="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-paper/30">
               <div><div class="text-xs text-cinnabar font-bold uppercase tracking-wider mb-3 flex items-center"><span class="w-2 h-2 bg-cinnabar rounded-full mr-2 animate-pulse"></span>{{ artwork.mockup_url ? '实物预览' : '定制模拟' }}</div><h4 class="font-bold text-2xl text-ink font-serif mb-2">独家定制帆布袋</h4><p class="text-sm text-ink/60 leading-relaxed mb-6">将《{{ artwork.user_theme }}》的数字灵感实体化。采用 100% 天然纤维制作，环保印染。</p></div>
               <div class="flex items-center space-x-6 mt-4"><span class="text-3xl font-serif text-ink font-bold">¥ 59.00</span><button class="flex-1 bg-ink text-white px-6 py-3 rounded hover:bg-cinnabar transition-colors shadow-lg tracking-widest text-sm">立即购买</button></div>
            </div>
         </div>
      </div>

      <!-- 【新增】评论区 -->
      <div class="max-w-3xl mx-auto border-t border-ink/10 pt-12 mb-20 animate-enter-medium" style="animation-delay: 0.6s">
        <h3 class="font-calligraphy text-2xl text-ink mb-6">社区评论 <span class="text-sm text-ink/40 font-mono ml-2">{{ interactData.comments.length }}</span></h3>
        
        <!-- 评论输入 -->
        <div class="flex gap-4 mb-8">
          <div class="w-10 h-10 bg-indigo/10 rounded-full flex items-center justify-center text-indigo font-bold shrink-0">{{ currentUser?.username?.[0]?.toUpperCase() || '?' }}</div>
          <div class="flex-1">
            <textarea v-model="commentText" class="w-full bg-white border border-ink/10 p-3 text-sm focus:border-indigo focus:outline-none rounded-sm" rows="2" placeholder="写下你的文化感悟..."></textarea>
            <div class="text-right mt-2"><button @click="postComment" :disabled="!commentText" class="bg-indigo text-white text-xs px-4 py-2 rounded-sm hover:bg-cinnabar transition-colors disabled:opacity-50">发表评论</button></div>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="space-y-6">
          <div v-for="(comment, idx) in interactData.comments" :key="idx" class="flex gap-4 pb-6 border-b border-ink/5 last:border-0">
            <div class="w-8 h-8 bg-paper border border-ink/10 rounded-full flex items-center justify-center text-xs shrink-0">{{ comment.username?.[0] }}</div>
            <div>
              <div class="flex items-baseline gap-2 mb-1"><span class="text-sm font-bold text-ink">{{ comment.username }}</span><span class="text-[10px] text-ink/30">{{ new Date(comment.date).toLocaleDateString() }}</span></div>
              <p class="text-sm text-ink/70 leading-relaxed">{{ comment.content }}</p>
            </div>
          </div>
          <div v-if="interactData.comments.length === 0" class="text-center text-ink/30 text-xs py-4">暂无评论，快来抢沙发</div>
        </div>
      </div>

    </div>

    <!-- 弹窗组件挂载区 -->
    <ClientOnly>
      <!-- 购买弹窗 (含支付成功) -->
      <Transition name="modal">
        <div v-if="showProductModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity" @click="showProductModal = false"></div>
          <div class="bg-paper w-full max-w-md rounded-lg shadow-2xl relative z-10 overflow-hidden flex flex-col transform transition-all duration-300">
            
            <!-- 支付成功状态 -->
            <div v-if="orderStep === 'success'" class="p-8 text-center bg-fabric-texture h-full flex flex-col items-center justify-center min-h-[300px]">
              <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 border-2 border-green-200">
                <span class="text-3xl text-green-600">✓</span>
              </div>
              <h3 class="font-calligraphy text-2xl text-ink mb-2">支付成功</h3>
              <p class="text-sm text-ink/60 mb-6">感谢您对非遗传承的支持！</p>
              <button @click="closeSuccessModal" class="px-8 py-2 border border-ink/20 text-ink/60 hover:text-indigo hover:border-indigo transition-colors text-sm">查看订单</button>
            </div>

            <!-- 原有流程 -->
            <div v-else>
              <!-- 头部 (Preview / Form) 略，保持原样逻辑 -->
              <div v-if="orderStep === 'preview'" class="relative h-64 bg-gray-100 group overflow-hidden">
                <img :src="optimizeDetailImage(artwork.mockup_url || artwork.art_image_url)" class="w-full h-full object-cover"/>
                <button @click="showProductModal = false" class="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-cinnabar transition-colors z-20">✕</button>
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-4 left-6 text-white"><div class="text-xs opacity-80 uppercase tracking-widest">Cangz</div><div class="text-xl font-serif">{{ artwork.user_theme }} Hienq</div></div>
              </div>
              <div v-else class="relative h-20 bg-indigo flex items-center justify-between px-6"><h3 class="text-white font-calligraphy text-2xl">收货信息</h3><button @click="orderStep = 'preview'" class="text-white/60 hover:text-white text-sm">← 返回预览</button></div>

              <div class="p-6 bg-fabric-texture">
                <div v-if="orderStep === 'preview'" class="space-y-5">
                  <div class="space-y-3 py-2 border-b border-ink/10">
                    <div class="flex justify-between text-sm items-center"><span class="text-ink/70">产品类型</span><span class="font-bold text-ink">独家定制帆布袋</span></div>
                    <div class="flex justify-between text-sm items-center"><span class="text-ink/70">材质</span><span class="font-medium bg-indigo/5 text-indigo px-2 py-0.5 rounded text-xs">100% 天然纤维</span></div>
                    <div class="flex justify-between text-sm items-center"><span class="text-ink/70">预计发货</span><span class="font-medium">3-5 个工作日</span></div>
                  </div>
                  <div class="flex flex-col gap-2 pt-2">
                    <div class="flex items-center justify-between"><div class="text-3xl font-serif text-cinnabar">¥ 59.00</div><button @click="orderStep = 'form'" class="px-8 py-3 bg-ink text-white rounded hover:bg-cinnabar hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 tracking-widest font-bold">立即下单</button></div>
                    <div class="text-[10px] text-ink/40 text-center bg-gold/10 py-1 rounded">❤️ 本次消费包含 5% 非遗传承公益捐赠</div>
                  </div>
                </div>
                <form v-else @submit.prevent="handlePay" class="space-y-4">
                  <div class="space-y-1"><label class="text-xs font-bold text-ink/50 uppercase tracking-wider">姓名</label><input required v-model="orderForm.name" type="text" class="w-full bg-white border border-ink/10 p-2 text-sm focus:border-cinnabar focus:outline-none" /></div>
                  <div class="space-y-1"><label class="text-xs font-bold text-ink/50 uppercase tracking-wider">电话</label><input required v-model="orderForm.phone" type="tel" class="w-full bg-white border border-ink/10 p-2 text-sm focus:border-cinnabar focus:outline-none" /></div>
                  <div class="space-y-1"><label class="text-xs font-bold text-ink/50 uppercase tracking-wider">地址</label><textarea required v-model="orderForm.address" rows="3" class="w-full bg-white border border-ink/10 p-2 text-sm focus:border-cinnabar focus:outline-none"></textarea></div>
                  <div class="pt-2"><button type="submit" class="w-full py-3 bg-cinnabar text-white rounded hover:bg-red-700 transition-all shadow-md font-bold tracking-widest flex items-center justify-center"><span v-if="isPaying" class="animate-pulse">支付处理中...</span><span v-else>立即支付 ¥59.00</span></button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="modal"><ShareModal v-if="showShareModal" :imageUrl="optimizeDetailImage(artwork.art_image_url)" :title="artwork.user_theme" :interpretation="plainInterpretation" @close="showShareModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="showPatternModal" class="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-ink/90 backdrop-blur-sm transition-opacity" @click="showPatternModal = false"></div>
          <div class="bg-paper w-full max-w-lg rounded-lg shadow-2xl relative z-10 overflow-hidden border-2 border-gold p-8 text-center animate-enter-fast min-h-[400px] flex flex-col justify-center">
            <h3 class="font-calligraphy text-3xl text-indigo mb-4">纹样解构</h3><div class="w-16 h-1 bg-cinnabar mx-auto mb-6"></div>
            <div v-if="isAnalyzingPattern" class="flex flex-col items-center justify-center py-8"><div class="spinner-zhuang mb-4"></div><p class="text-indigo/60 tracking-widest animate-pulse font-serif text-sm">AI 正在分析纹样结构...</p></div>
            <div v-else-if="patternData" class="space-y-6 text-left">
              <div class="p-4 bg-white border border-ink/10 rounded-sm"><p class="font-bold text-lg mb-1 text-ink">{{ patternData.main.name }}</p><p class="text-ink/60 text-sm leading-relaxed">{{ patternData.main.desc }}</p></div>
              <div class="grid grid-cols-2 gap-4"><div v-for="(el, idx) in patternData.elements" :key="idx" class="p-3 bg-white border border-ink/10 rounded-sm"><div class="text-2xl mb-1">{{ el.icon }}</div><p class="font-bold text-sm">{{ el.name }}</p><p class="text-[10px] text-ink/50">{{ el.desc }}</p></div></div>
              <div class="text-center pt-2"><p class="text-xs text-indigo/70 font-bold">🎨 视觉风格：{{ patternData.color }}</p></div>
            </div>
            <div v-else class="text-center py-8"><p class="text-cinnabar mb-2">分析服务暂时繁忙</p><button @click="handleAnalyzePattern" class="text-sm underline">重试</button></div>
            <button @click="showPatternModal = false" class="mt-8 px-6 py-2 border border-ink/20 text-ink/60 hover:text-indigo hover:border-indigo transition-colors text-sm mx-auto block">关闭</button>
          </div>
        </div>
      </Transition>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, reactive, onMounted } from 'vue'
import ShareModal from '~/components/ShareModal.vue'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()
const { currentUser } = useAuth()

const showProductModal = ref(false)
const showShareModal = ref(false)
const showPatternModal = ref(false)
const assetsLoading = ref(true)

// 订单
const orderStep = ref<'preview' | 'form' | 'success'>('preview')
const orderForm = reactive({ name: '', phone: '', address: '' })
const isPaying = ref(false)

const openProductModal = () => { orderStep.value = 'preview'; showProductModal.value = true }

const handlePay = async () => {
  if (!currentUser.value) { showToast('请先登录', 'error'); return router.push('/login') }
  isPaying.value = true
  
  // 模拟支付延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 调用后端创建订单
  try {
    const orderData = {
      ...orderForm,
      user_theme: artwork.value.user_theme,
      art_image_url: artwork.value.art_image_url,
      mockup_url: artwork.value.mockup_url,
      price: 59.00
    }
    await $fetch('/api/user/orders', {
      method: 'POST',
      body: { username: currentUser.value.username, orderData }
    })
    
    // 成功状态
    orderStep.value = 'success'
  } catch (e) {
    showToast('支付失败', 'error')
  } finally {
    isPaying.value = false
  }
}

const closeSuccessModal = () => {
  showProductModal.value = false
  router.push('/profile')
}

// 互动
const interactData = reactive({ likes: 0, liked: false, comments: [] as any[] })
const commentText = ref('')

const fetchInteraction = async () => {
  if (!artwork.value) return
  const data: any = await $fetch('/api/artwork/interact', {
    params: { id: artwork.value.id, username: currentUser.value?.username }
  })
  interactData.likes = data.likes
  interactData.liked = data.liked
  interactData.comments = data.comments
}

const toggleLike = async () => {
  if (!currentUser.value) { showToast('请先登录', 'error'); return }
  
  // 乐观更新
  interactData.liked = !interactData.liked
  interactData.likes += interactData.liked ? 1 : -1
  
  await $fetch('/api/artwork/interact', {
    method: 'POST',
    body: { type: 'like', artworkId: artwork.value.id, username: currentUser.value.username }
  })
}

const postComment = async () => {
  if (!currentUser.value) { showToast('请先登录', 'error'); return }
  
  const res: any = await $fetch('/api/artwork/interact', {
    method: 'POST',
    body: { type: 'comment', artworkId: artwork.value.id, username: currentUser.value.username, content: commentText.value }
  })
  
  if (res.success) {
    interactData.comments.unshift(res.comment)
    commentText.value = ''
    showToast('评论发表成功', 'success')
  }
}

// --- 基础逻辑 (复制之前的) ---
const optimizeDetailImage = (url: string) => { if (!url || url.includes('placeholder')) return url; return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=1200&q=85&output=webp&n=-1` }
const { data: artwork, pending, error } = await useAsyncData(`artwork-${route.params.id}`, async () => {
  const response: any = await $fetch('https://api.zhuangmai.cloud/api/gallery/list'); const list = Array.isArray(response) ? response : (response?.data || []); const found = list.find((item: any) => String(item.id) === String(route.params.id)); if (!found) throw createError({ statusCode: 404 }); return found
}, { lazy: true })

watch(artwork, (newVal) => { 
  if (newVal) {
    preloadAssets(newVal)
    // 获取互动数据
    fetchInteraction()
  }
}, { immediate: true })

const preloadAssets = (data: any) => { assetsLoading.value = true; const imagesToLoad = [optimizeDetailImage(data.art_image_url), optimizeDetailImage(data.mockup_url || data.art_image_url)]; let cnt = 0; imagesToLoad.forEach(url => { const img = new Image(); img.src = url; img.onload = img.onerror = () => { cnt++; if (cnt >= imagesToLoad.length) assetsLoading.value = false } }) }

// 纹样分析
const isAnalyzingPattern = ref(false); const patternData = ref<any>(null);
const handleAnalyzePattern = async () => { showPatternModal.value = true; if (patternData.value) return; isAnalyzingPattern.value = true; try { const data = await $fetch('/api/analyze-pattern', { method: 'POST', body: { imageUrl: optimizeDetailImage(artwork.value.art_image_url) } }); patternData.value = data } catch (e) { showPatternModal.value = false; showToast('分析失败', 'error') } finally { isAnalyzingPattern.value = false } }

const audioRef = ref<HTMLAudioElement | null>(null); const isPlaying = ref(false); const toggleAudio = () => { if (!audioRef.value) return; if (isPlaying.value) { audioRef.value.pause(); isPlaying.value = false } else { audioRef.value.play(); isPlaying.value = true } }
const formattedInterpretation = computed(() => { if (!artwork.value?.ai_interpretation) return ''; let text = artwork.value.ai_interpretation; try { if (text.trim().startsWith('{') || text.trim().startsWith('<|begin_of_box|>')) { const cleanJson = text.replace('<|begin_of_box|>', '').replace('<|end_of_box|>', ''); const obj = JSON.parse(cleanJson); if (obj.mdText) return obj.mdText } } catch (e) {} return text })
const plainInterpretation = computed(() => formattedInterpretation.value.replace(/[#*`>]/g, '').substring(0, 300))
const displayFortune = computed(() => { const fortunes = ["纹样如流水，上善若水...", "菱形稳固，寓意守护..."]; return fortunes[parseInt(String(artwork.value?.id || 0)) % fortunes.length] })
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.markdown-body { white-space: pre-wrap; }
</style>