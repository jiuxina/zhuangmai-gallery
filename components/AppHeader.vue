<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
      <!-- Logo and Title -->
      <NuxtLink to="/" class="flex items-center space-x-3">
        <span class="text-xl font-semibold text-text-main dark:text-gray-200">
          壮脉智承 - 云端艺术馆
        </span>
      </NuxtLink>

      <!-- Navigation Links -->
      <div class="flex items-center space-x-6">
        <NuxtLink
          to="/"
          class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
          active-class="text-primary dark:text-primary font-semibold"
        >
          画廊
        </NuxtLink>
        <NuxtLink
          to="/chat"
          class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
          active-class="text-primary dark:text-primary font-semibold"
        >
          智能体对话
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// Nuxt 3 components are auto-imported, no script needed for basic functionality.
</script>

<style scoped>
/* Ensure active-class is bold */
.font-semibold {
  font-weight: 600;
}
</style>