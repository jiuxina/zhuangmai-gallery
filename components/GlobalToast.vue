
<template>
  <Transition name="toast">
    <div 
      v-if="toastState.show" 
      class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[120] flex items-center justify-center pointer-events-none"
    >
      <div 
        class="bg-paper bg-fabric-texture border-l-4 px-8 py-4 shadow-2xl flex items-center space-x-4 pointer-events-auto min-w-[300px]"
        :class="[
          toastState.type === 'error' ? 'border-cinnabar text-cinnabar' : 'border-indigo text-indigo'
        ]"
      >
        <div 
          class="w-3 h-3 transform rotate-45"
          :class="toastState.type === 'error' ? 'bg-cinnabar' : 'bg-indigo'"
        ></div>
        
        <div class="flex-1">
          <div class="font-serif tracking-widest font-bold text-base">
            {{ toastState.message }}
          </div>
          <div class="text-[9px] opacity-40 uppercase tracking-[0.2em] font-mono mt-1">
            {{ toastState.type === 'error' ? 'System Alert' : 'System Notice' }}
          </div>
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
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -40px) scale(0.9);
}
</style>