<template>
  <div class="bg-secondary min-h-screen text-text-main">
    <header class="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="font-serif text-2xl font-bold text-primary">
          壮脉智承 - <span class="opacity-80">云端艺术馆</span>
        </NuxtLink>
        <nav class="text-lg space-x-6">
          <NuxtLink to="/" class="font-sans text-text-light hover:text-primary transition-colors duration-300">画廊</NuxtLink>
          <NuxtLink to="/chat" class="font-sans text-text-light hover:text-primary transition-colors duration-300">智能体对话</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-6 py-12">
      <NuxtPage />
    </main>

    <footer class="bg-transparent mt-16 py-8">
      <div class="container mx-auto px-6 text-center text-text-light/70">
        <p class="font-serif text-xl mb-3">"文化，因共创而生生不息。"</p>
        <p class="text-sm">&copy; 2025 壮脉智承. All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* 全局页面过渡 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* 全局样式 */
body {
  background-color: #F5F5F5; /* secondary color */
}
</style>