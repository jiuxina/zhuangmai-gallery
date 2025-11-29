<template>
  <div class="min-h-screen bg-paper text-ink selection:bg-cinnabar selection:text-white font-serif relative overflow-hidden transition-colors duration-500 flex flex-col">
    <!-- 1. 挂载全局消息弹窗 -->
    <GlobalToast />

    <!-- 顶部极简导航 -->
    <header v-if="$route.path !== '/'" class="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-paper/90 backdrop-blur-md border-b border-ink/5 transition-all duration-300 animate-enter-fast">
      <!-- 左侧：Logo -->
      <NuxtLink to="/" class="font-calligraphy text-2xl text-indigo hover:text-cinnabar transition-colors duration-200">
        壮脉智承
      </NuxtLink>
      
      <!-- 右侧区域：导航菜单 + 登录状态 -->
      <div class="flex items-center space-x-6 md:space-x-10">
        <!-- 导航菜单 -->
        <nav class="hidden md:flex space-x-8 text-sm tracking-[0.2em] font-medium">
          
          <!-- 1. Ranzva -> 画廊 -->
          <NuxtLink to="/gallery" class="relative group py-2 flex flex-col items-center">
            <span class="group-hover:text-cinnabar transition-colors">Ranzva</span>
            <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-cinnabar transition-all duration-300 group-hover:w-full"></span>
            
            <!-- 悬浮中文注释 -->
            <span class="absolute top-full mt-2 text-[10px] text-cinnabar/80 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap font-serif">
              · 画 廊 ·
            </span>
          </NuxtLink>

          <!-- 2. Doxgangj -> 对话 -->
          <NuxtLink to="/chat" class="relative group py-2 flex flex-col items-center">
            <span class="group-hover:text-cinnabar transition-colors">Doxgangj</span>
            <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-cinnabar transition-all duration-300 group-hover:w-full"></span>
            
            <!-- 悬浮中文注释 -->
            <span class="absolute top-full mt-2 text-[10px] text-cinnabar/80 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap font-serif">
              · 对 话 ·
            </span>
          </NuxtLink>

          <!-- 3. Douruengx -> 团队 -->
          <NuxtLink to="/about" class="relative group py-2 flex flex-col items-center">
            <span class="group-hover:text-cinnabar transition-colors">Douruengx</span>
            <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-cinnabar transition-all duration-300 group-hover:w-full"></span>
            
            <!-- 悬浮中文注释 -->
            <span class="absolute top-full mt-2 text-[10px] text-cinnabar/80 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap font-serif">
              · 团 队 ·
            </span>
          </NuxtLink>

        </nav>

        <!-- 分割线 -->
        <div class="hidden md:block w-[1px] h-4 bg-ink/20"></div>

        <!-- 登录状态 -->
        <div class="text-xs font-medium tracking-widest">
          <div v-if="currentUser" class="flex items-center space-x-4">
            <span class="text-ink/60 hidden sm:inline">你好, {{ currentUser.username }}</span>
            <button @click="logout" class="text-cinnabar hover:underline">
              退出 / Tuq
            </button>
          </div>
          <div v-else class="space-x-4">
            <NuxtLink to="/login" class="hover:text-cinnabar transition-colors">登录</NuxtLink>
            <span class="text-ink/20">|</span>
            <NuxtLink to="/register" class="hover:text-cinnabar transition-colors">注册</NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full">
      <NuxtPage />
    </main>

    <footer class="py-12 text-center space-y-4 border-t border-ink/5 mt-auto bg-paper">
      <div class="w-8 h-[1px] bg-cinnabar mx-auto opacity-50"></div>
      <div>
        <p class="font-calligraphy text-xl text-ink/80 mb-2">"文化，因共创而生生不息。"</p>
        <p class="text-xs text-ink/40 font-serif tracking-widest uppercase">
          © 2025 壮脉智承. All Rights Reserved.
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
  const coreRoutes = ['/gallery', '/chat', '/about', '/login', '/register']
  coreRoutes.forEach(path => {
    preloadRouteComponents(path)
  })
})
</script>

<style>
html { scroll-behavior: smooth; }
.page-enter-active, .page-leave-active { transition: opacity 0.3s, transform 0.3s; }
.page-enter-from, .page-leave-to { opacity: 0; transform: translateY(5px); filter: blur(2px); }
</style>