<template>
  <div v-if="guides && guides.length > 0" class="mb-4 flex flex-wrap gap-2 animate-fade-in">
    <button
      v-for="(guide, index) in guides"
      :key="index"
      @click="$emit('select', guide)"
      class="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-primary/20 hover:text-primary transition-all transform hover:scale-105"
    >
      {{ guide }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  guides?: string[];
}>();
defineEmits(['select']);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>