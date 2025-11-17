<template>
  <div class="bg-gray-50 dark:bg-gray-900 text-text-main min-h-screen font-sans">
    <!-- AppHeader 组件在这里被直接使用，Nuxt会自动找到它 -->
    <AppHeader />
    <main class="container mx-auto px-6 py-12">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
// 这里不需要任何 import 语句，Nuxt 3 会自动处理。
</script>

<style>
/* 全局过渡动画等保持不变 */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>