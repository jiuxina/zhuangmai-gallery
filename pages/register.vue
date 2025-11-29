<template>
  <div class="min-h-screen pt-24 px-4 flex items-center justify-center bg-paper">
    <div class="w-full max-w-md bg-white/60 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-ink/5 animate-enter-fast">
      
      <div class="text-center mb-10 space-y-2">
        <p class="text-xs font-bold text-indigo tracking-[0.3em] uppercase">Register</p>
        <!-- 【核心修改】文案改为 加入共创 -->
        <h1 class="font-calligraphy text-4xl text-ink">加入共创</h1>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div class="space-y-1">
          <label class="text-xs text-ink/50 tracking-widest block">拟定名号 / Mingz</label>
          <input 
            v-model="form.username" 
            type="text" 
            required
            class="w-full bg-transparent border-b border-ink/20 py-2 text-ink focus:outline-none focus:border-indigo transition-colors"
            placeholder="请设置用户名"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-ink/50 tracking-widest block">设置密钥 / Miemaj</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            class="w-full bg-transparent border-b border-ink/20 py-2 text-ink focus:outline-none focus:border-indigo transition-colors"
            placeholder="请设置密码"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-ink/50 tracking-widest block">确认密钥 / Naenx</label>
          <input 
            v-model="form.confirmPass" 
            type="password" 
            required
            class="w-full bg-transparent border-b border-ink/20 py-2 text-ink focus:outline-none focus:border-indigo transition-colors"
            placeholder="再次输入密码"
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-3 border border-ink text-ink mt-4 hover:bg-ink hover:text-white transition-colors tracking-[0.2em] rounded-sm flex items-center justify-center"
          :disabled="isSubmitting"
        >
           <span v-if="isSubmitting" class="animate-pulse">处理中...</span>
           <span v-else>提交注册</span>
        </button>
      </form>

      <div class="mt-8 text-center text-xs text-ink/40">
        <span class="mr-2">已有账号？</span>
        <NuxtLink to="/login" class="text-indigo underline hover:text-cinnabar">
          直接登入 (Hwd)
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { register } = useAuth()
const { showToast } = useToast()
const router = useRouter()

const form = reactive({ username: '', password: '', confirmPass: '' })
const isSubmitting = ref(false)

const handleRegister = async () => {
  if (form.password !== form.confirmPass) {
    showToast('两次输入的密码不一致 (Miemaj mbouj doengz)', 'error')
    return
  }
  
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 800)) 

  try {
    register(form.username, form.password)
    showToast('注册成功，请登录', 'success')
    router.push('/login')
  } catch (e: any) {
    showToast(e.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

useHead({ title: '注册 - 壮脉智承' })
</script>