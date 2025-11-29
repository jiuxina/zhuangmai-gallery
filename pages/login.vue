<template>
  <div class="min-h-screen pt-24 px-4 flex items-center justify-center bg-paper">
    <div class="w-full max-w-md bg-white/60 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-ink/5 animate-enter-fast">
      
      <div class="text-center mb-10 space-y-2">
        <p class="text-xs font-bold text-cinnabar tracking-[0.3em] uppercase">Sign In</p>
        <h1 class="font-calligraphy text-4xl text-ink">登入雅舍</h1>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-1">
          <label class="text-xs text-ink/50 tracking-widest block">用户名 / Mingz</label>
          <input 
            v-model="form.username" 
            type="text" 
            required
            class="w-full bg-transparent border-b border-ink/20 py-2 text-ink focus:outline-none focus:border-cinnabar transition-colors"
            placeholder="请输入您的名号"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-ink/50 tracking-widest block">密码 / Miemaj</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            class="w-full bg-transparent border-b border-ink/20 py-2 text-ink focus:outline-none focus:border-cinnabar transition-colors"
            placeholder="请输入通行密钥"
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-3 bg-ink text-paper mt-4 hover:bg-cinnabar transition-colors tracking-[0.2em] rounded-sm shadow-md flex items-center justify-center"
          :disabled="isLoggingIn"
        >
          <span v-if="isLoggingIn" class="animate-pulse">验证中...</span>
          <span v-else>确认登入</span>
        </button>
      </form>

      <div class="mt-8 text-center text-xs text-ink/40">
        <span class="mr-2">未有账号？</span>
        <NuxtLink to="/register" class="text-indigo underline hover:text-cinnabar">
          前往注册 (Hwnj)
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const { showToast } = useToast() // 使用全局 Toast
const router = useRouter()
const route = useRoute()

const form = reactive({ username: '', password: '' })
const isLoggingIn = ref(false)

const handleLogin = async () => {
  isLoggingIn.value = true
  
  // 模拟网络延迟感
  await new Promise(resolve => setTimeout(resolve, 600))

  try {
    login(form.username, form.password)
    
    // 显示成功弹窗
    showToast('登录成功，欢迎归来', 'success')

    // 【核心】判断是否有回调地址
    const redirectUrl = route.query.redirect as string
    if (redirectUrl) {
      router.push(decodeURIComponent(redirectUrl))
    } else {
      router.push('/')
    }

  } catch (e: any) {
    // 显示错误弹窗
    showToast(e.message, 'error')
  } finally {
    isLoggingIn.value = false
  }
}

useHead({ title: '登录 - 壮脉智承' })
</script>