<template>
  <!-- pt-16 是为了避开 app.vue 中的全局固定导航栏 -->
  <div class="h-screen w-full bg-paper flex flex-col pt-16">
    <!-- Iframe 容器 -->
    <div class="flex-1 w-full relative bg-white">
      <iframe
        src="https://gacbai.gxmzu.edu.cn/chat/share?shareId=yft3kv5dvrdzdzlemelzbl34"
        class="w-full h-full absolute inset-0 border-none"
        frameborder="0" 
        allow="microphone; camera; midi; encrypted-media;"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      ></iframe>
      
      <!-- 加载遮罩 -->
      <div class="absolute inset-0 flex items-center justify-center -z-10 bg-paper">
        <span class="animate-pulse text-ink/40 font-serif tracking-widest">正在连接智能体...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 【核心修改】
// 1. 禁用过渡动画防止白屏
// 2. 启用 auth 中间件，强制登录
definePageMeta({
  pageTransition: false,
  middleware: 'auth' // <--- 添加这行，未登录会被拦截去登录页
})
</script>