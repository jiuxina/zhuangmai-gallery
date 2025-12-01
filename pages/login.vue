
<template>
  <div class="min-h-screen pt-32 px-4 flex items-center justify-center bg-fabric-texture">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="w-full max-w-md bg-white p-10 shadow-xl border-t-4 border-cinnabar relative z-10 animate-enter-fast">
      
      <div class="text-center mb-10 space-y-3">
        <p class="text-xs font-bold text-cinnabar tracking-[0.4em] uppercase">Sign In</p>
        <h1 class="font-calligraphy text-5xl text-indigo">登入云端</h1>
        <div class="w-8 h-1 bg-gold mx-auto"></div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-8">
        <div class="space-y-2 group">
          <label class="text-xs text-ink/50 tracking-widest block font-bold uppercase group-focus-within:text-cinnabar transition-colors">用户名 / Mingz</label>
          <input 
            v-model="form.username" 
            type="text" 
            required
            class="w-full bg-paper border-b-2 border-ink/10 py-3 px-4 text-ink focus:outline-none focus:border-cinnabar focus:bg-white transition-all font-serif"
            placeholder="请输入您的名号"
          />
        </div>

        <div class="space-y-2 group">
          <label class="text-xs text-ink/50 tracking-widest block font-bold uppercase group-focus-within:text-cinnabar transition-colors">密码 / Miemaj</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            class="w-full bg-paper border-b-2 border-ink/10 py-3 px-4 text-ink focus:outline-none focus:border-cinnabar focus:bg-white transition-all font-serif"
            placeholder="请输入通行密钥"
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-4 bg-indigo text-white mt-6 hover:bg-cinnabar transition-colors duration-300 tracking-[0.3em] font-bold shadow-md flex items-center justify-center group"
          :disabled="isLoggingIn"
        >
          <span v-if="isLoggingIn" class="animate-pulse">验证中...</span>
          <span v-else class="group-hover:translate-x-1 transition-transform">确认登入 →</span>
        </button>
      </form>

      <div class="mt-10 text-center border-t border-ink/5 pt-6">
        <span class="text-xs text-ink/40 mr-2">未有账号？</span>
        <NuxtLink to="/register" class="text-sm font-bold text-indigo hover:text-cinnabar hover:underline transition-colors">
          前往注册 (Hwnj)
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<!-- 仅修改 script 部分 -->
<script setup lang="ts">
const { login } = useAuth()
const { showToast } = useToast() 
const router = useRouter()
const route = useRoute()

const form = reactive({ username: '', password: '' })
const isLoggingIn = ref(false)

const handleLogin = async () => {
  isLoggingIn.value = true
  
  // 这里的 setTimeout 可以去掉了，因为真实的 API 请求本身就有延迟
  // 但保留一点点也没关系，增加质感

  try {
    // 【修改】加上 await
    await login(form.username, form.password)
    
    showToast('登录成功，欢迎归来', 'success')

    const redirectUrl = route.query.redirect as string
    if (redirectUrl) {
      router.push(decodeURIComponent(redirectUrl))
    } else {
      router.push('/')
    }

  } catch (e: any) {
    showToast(e.message, 'error')
  } finally {
    isLoggingIn.value = false
  }
}

useHead({ title: '登录 - 壮脉智承' })
</script>