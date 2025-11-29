<template>
  <Transition name="toast">
    <div 
      v-if="toastState.show" 
      class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] flex items-center justify-center pointer-events-none"
    >
      <div 
        class="bg-paper border px-8 py-4 rounded shadow-2xl flex items-center space-x-3 pointer-events-auto backdrop-blur-md"
        :class="[
          toastState.type === 'error' ? 'border-cinnabar/50 text-cinnabar' : 'border-indigo/50 text-indigo'
        ]"
      >
        <!-- 图标 -->
        <span v-if="toastState.type === 'success'" class="text-xl">✓</span>
        <span v-else-if="toastState.type === 'error'" class="text-xl">✕</span>
        
        <!-- 文字 -->
        <div class="font-serif tracking-widest font-bold">
          {{ toastState.message }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { toastState } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>