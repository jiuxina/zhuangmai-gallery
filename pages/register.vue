
<template>
  <div class="min-h-screen pt-32 px-4 flex items-center justify-center bg-fabric-texture">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cinnabar/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="w-full max-w-md bg-white p-10 shadow-xl border-t-4 border-indigo relative z-10 animate-enter-fast">
      
      <div class="text-center mb-10 space-y-3">
        <p class="text-xs font-bold text-indigo tracking-[0.4em] uppercase">Register</p>
        <h1 class="font-calligraphy text-5xl text-cinnabar">加入共创</h1>
        <div class="w-8 h-1 bg-gold mx-auto"></div>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div class="space-y-2">
          <label class="text-xs text-ink/50 tracking-widest block font-bold uppercase">拟定名号 / Mingz</label>
          <input v-model="form.username" type="text" required class="w-full bg-paper border-b-2 border-ink/10 py-3 px-4 text-ink focus:outline-none focus:border-indigo focus:bg-white transition-all font-serif" placeholder="请设置用户名" />
        </div>

        <div class="space-y-2">
          <label class="text-xs text-ink/50 tracking-widest block font-bold uppercase">设置密钥 / Miemaj</label>
          <input v-model="form.password" type="password" required class="w-full bg-paper border-b-2 border-ink/10 py-3 px-4 text-ink focus:outline-none focus:border-indigo focus:bg-white transition-all font-serif" placeholder="请设置密码" />
        </div>

        <div class="space-y-2">
          <label class="text-xs text-ink/50 tracking-widest block font-bold uppercase">确认密钥 / Naenx</label>
          <input v-model="form.confirmPass" type="password" required class="w-full bg-paper border-b-2 border-ink/10 py-3 px-4 text-ink focus:outline-none focus:border-indigo focus:bg-white transition-all font-serif" placeholder="再次输入密码" />
        </div>

        <!-- 【新增】用户协议勾选 -->
        <div class="flex items-center gap-2 pt-2">
          <input 
            id="agreement" 
            type="checkbox" 
            v-model="form.agreed"
            class="w-4 h-4 accent-cinnabar cursor-pointer"
          />
          <label for="agreement" class="text-xs text-ink/60 select-none cursor-pointer">
            我已阅读并同意 <span class="text-indigo underline">《壮脉智承用户服务协议》</span>
          </label>
        </div>

        <button 
          type="submit" 
          class="w-full py-4 border-2 border-indigo text-indigo mt-4 hover:bg-indigo hover:text-white transition-all duration-300 tracking-[0.3em] font-bold shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSubmitting"
        >
           <span v-if="isSubmitting" class="animate-pulse">镌刻中...</span>
           <span v-else>提交注册</span>
        </button>
      </form>

      <div class="mt-10 text-center border-t border-ink/5 pt-6">
        <span class="text-xs text-ink/40 mr-2">已有账号？</span>
        <NuxtLink to="/login" class="text-sm font-bold text-cinnabar hover:text-indigo hover:underline transition-colors">
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

const form = reactive({ username: '', password: '', confirmPass: '', agreed: false })
const isSubmitting = ref(false)

const handleRegister = async () => {
  if (!form.agreed) {
    showToast('请先同意用户协议', 'error')
    return
  }
  if (form.password !== form.confirmPass) {
    showToast('两次输入的密码不一致', 'error')
    return
  }
  
  isSubmitting.value = true
  
  try {
    await register(form.username, form.password)
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