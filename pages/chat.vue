
<template>
  <div class="h-screen w-full bg-paper flex flex-col pt-[72px]">
    <!-- Iframe 容器 -->
    <div class="flex-1 w-full relative bg-fabric-texture border-t-4 border-cinnabar">
      <iframe
        src="https://gacbai.gxmzu.edu.cn/chat/share?shareId=yft3kv5dvrdzdzlemelzbl34"
        class="w-full h-full absolute inset-0 border-none"
        frameborder="0" 
        allow="microphone; camera; midi; encrypted-media;"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      ></iframe>
      
      <!-- 加载遮罩 -->
      <div class="absolute inset-0 flex items-center justify-center -z-10 bg-paper">
        <div class="text-center">
           <div class="spinner-zhuang mx-auto mb-4"></div>
           <span class="animate-pulse text-indigo font-serif tracking-widest">正在连接智能体...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  pageTransition: false,
  middleware: 'auth'
})
</script>