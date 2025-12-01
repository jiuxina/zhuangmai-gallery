
<template>
  <div class="min-h-screen bg-paper text-ink font-serif relative overflow-hidden transition-colors duration-500 flex flex-col bg-fabric-texture">
    
    <GlobalToast />

    <header v-if="$route.path !== '/'" class="fixed top-0 left-0 w-full z-50 bg-paper/95 border-b-4 border-cinnabar shadow-sm transition-all duration-300 animate-enter-fast">
      <div class="px-6 lg:px-12 py-4 flex justify-between items-center w-full">
        
        <NuxtLink to="/" class="font-calligraphy text-3xl text-indigo hover:text-cinnabar transition-colors duration-200 flex items-center gap-3">
          <div class="w-8 h-8 bg-indigo text-paper rounded-sm flex items-center justify-center shadow-sm group">
            <div class="w-4 h-4 border-2 border-paper rotate-45 group-hover:scale-90 transition-transform"></div>
          </div>
          <span>壮脉智承</span>
        </NuxtLink>
        
        <div class="flex items-center space-x-6 md:space-x-12">
          <nav class="hidden md:flex space-x-8 text-sm tracking-[0.15em] font-bold text-ink/70">
            <NuxtLink to="/gallery" class="relative group py-2 flex flex-col items-center">
              <span class="group-hover:text-cinnabar transition-colors">Ranzva</span>
              <span class="absolute -bottom-2 w-1.5 h-1.5 bg-cinnabar rotate-45 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              <span class="absolute top-full mt-3 text-xs text-indigo font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0 pointer-events-none whitespace-nowrap border-t border-indigo pt-1">画 廊</span>
            </NuxtLink>

            <NuxtLink to="/chat" class="relative group py-2 flex flex-col items-center">
              <span class="group-hover:text-cinnabar transition-colors">Doxgangj</span>
              <span class="absolute -bottom-2 w-1.5 h-1.5 bg-cinnabar rotate-45 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              <span class="absolute top-full mt-3 text-xs text-indigo font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0 pointer-events-none whitespace-nowrap border-t border-indigo pt-1">对 话</span>
            </NuxtLink>

            <NuxtLink to="/about" class="relative group py-2 flex flex-col items-center">
              <span class="group-hover:text-cinnabar transition-colors">Douruengx</span>
              <span class="absolute -bottom-2 w-1.5 h-1.5 bg-cinnabar rotate-45 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              <span class="absolute top-full mt-3 text-xs text-indigo font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0 pointer-events-none whitespace-nowrap border-t border-indigo pt-1">团 队</span>
            </NuxtLink>
          </nav>

          <div class="hidden md:block w-[1px] h-6 border-r border-dashed border-ink/30"></div>

          <div class="text-xs font-bold tracking-widest text-indigo">
            <div v-if="currentUser" class="flex items-center space-x-4">
              <!-- 【核心修改】将用户名改为 Link，增加 hover 效果 -->
              <NuxtLink 
                to="/profile" 
                class="hidden sm:inline border-b border-indigo/20 pb-0.5 hover:text-cinnabar hover:border-cinnabar transition-colors cursor-pointer"
                title="进入个人中心"
              >
                你好, {{ currentUser.username }}
              </NuxtLink>
              
              <button @click="logout" class="text-cinnabar hover:bg-cinnabar hover:text-white px-2 py-1 transition-all rounded-sm">
                退出 / Tuq
              </button>
            </div>
            <div v-else class="space-x-3">
              <NuxtLink to="/login" class="hover:text-cinnabar transition-colors">登录</NuxtLink>
              <span class="text-ink/20">/</span>
              <NuxtLink to="/register" class="hover:text-cinnabar transition-colors">注册</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full relative z-10">
      <NuxtPage />
    </main>

    <footer class="py-12 text-center space-y-6 bg-indigo text-paper relative mt-auto border-t-8 border-cinnabar">
      <div class="absolute top-0 left-0 w-full h-2 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-20"></div>
      <div>
        <div class="w-12 h-1 bg-gold mx-auto mb-6"></div>
        <p class="font-calligraphy text-2xl opacity-90 mb-2 tracking-wide">"文化，因共创而生生不息。"</p>
        <p class="text-xs opacity-40 font-mono tracking-[0.2em] uppercase">
          © 2025 ZhuangMai Heritage. All Rights Reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import GlobalToast from '~/components/GlobalToast.vue'

const { initAuth, currentUser, logout } = useAuth()

onMounted(() => {
  initAuth()
  const coreRoutes = ['/gallery', '/chat', '/about', '/login', '/register', '/profile']
  coreRoutes.forEach(path => {
    preloadRouteComponents(path)
  })
})
</script>

<style>
html { 
  scroll-behavior: smooth; 
  background-color: #FAF8F5;
}
.page-enter-active, .page-leave-active { transition: opacity 0.3s, transform 0.3s; }
.page-enter-from, .page-leave-to { opacity: 0; transform: translateY(5px); filter: blur(2px); }
</style>