
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
        <fieldset :disabled="isLoggingIn" class="space-y-8 group">
          <div class="space-y-2 group">
            <label class="text-xs text-ink/50 tracking-widest block font-bold uppercase group-focus-within:text-cinnabar transition-colors">用户名 / Mingz</label>
            <input
              v-model="form.username"
              type="text"
              required
              class="w-full bg-paper border-b-2 border-ink/10 py-3 px-4 text-ink focus:outline-none focus:border-cinnabar focus:bg-white transition-all font-serif disabled:opacity-50"
              placeholder="请输入您的名号"
            />
          </div>

          <div class="space-y-2 group">
            <label class="text-xs text-ink/50 tracking-widest block font-bold uppercase group-focus-within:text-cinnabar transition-colors">密码 / Miemaj</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full bg-paper border-b-2 border-ink/10 py-3 px-4 text-ink focus:outline-none focus:border-cinnabar focus:bg-white transition-all font-serif disabled:opacity-50"
              placeholder="请输入通行密钥"
            />
          </div>

          <button
            type="submit"
            class="w-full py-4 bg-indigo text-white mt-6 hover:bg-cinnabar transition-colors duration-300 tracking-[0.3em] font-bold shadow-md flex items-center justify-center group disabled:bg-indigo/80"
          >
            <svg v-if="isLoggingIn" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="isLoggingIn">验证中...</span>
            <span v-else class="group-hover:translate-x-1 transition-transform">确认登入 →</span>
          </button>
        </fieldset>
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

<script setup lang="ts">
const { login } = useAuth()
const { showToast } = useToast() 
const router = useRouter()
const route = useRoute()

const form = reactive({ username: '', password: '' })
const isLoggingIn = ref(false)

const handleLogin = async () => {
  isLoggingIn.value = true
  try {
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
