<template>
  <div class="group bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-cyan-500/50 hover:-translate-y-2">
    <!-- 图片部分 -->
    <div class="overflow-hidden h-64">
      <img :src="artwork.art_image_url" :alt="artwork.user_theme" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
    </div>

    <!-- 文字信息部分 -->
    <div class="p-6">
      <h3 class="text-xl font-semibold truncate" :title="artwork.user_theme">
        《{{ artwork.user_theme }}》
      </h3>
      <p class="text-gray-400 mt-2">
        创作者：<span class="font-medium text-cyan-400">{{ artwork.user_name }}</span>
      </p>
      <p class="text-gray-500 mt-4 text-sm h-10 overflow-hidden">
        {{ artwork.ai_interpretation }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义这个组件需要接收的数据类型
// 就像给演员的剧本，告诉他需要哪些台词
defineProps({
  artwork: {
    type: Object,
    required: true
  }
});
</script>