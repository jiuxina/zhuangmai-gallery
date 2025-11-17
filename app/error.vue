<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
    <div class="max-w-xl w-full p-8 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2">{{ title }}</h1>
        <p class="text-gray-600 mb-4">{{ message }}</p>
      </div>

      <div v-if="showDetails" class="mb-4">
        <label class="text-sm text-gray-500">错误详情（仅开发环境显示）：</label>
        <pre class="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">{{ details }}</pre>
      </div>

      <div class="flex justify-center gap-3 mt-4">
        <NuxtLink to="/" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">返回首页</NuxtLink>
        <button @click="retry" class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">重试</button>
      </div>

      <div class="mt-3 text-center text-xs text-gray-400">
        若问题持续存在，请稍后重试或联系管理员。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nuxt 3: error 页会收到一个 props 名为 error
const props = defineProps<{ error?: any }>()
const error = props.error || {}

const title = error?.statusCode ? `${error.statusCode} · 出现错误` : '发生错误'
const message = error?.statusMessage || error?.message || '服务器发生问题，请稍后再试。'

// 仅在开发环境显示详细信息
const isDev = process.env.NODE_ENV === 'development'
const details = isDev ? (error?.stack || JSON.stringify(error, null, 2)) : ''
const showDetails = Boolean(details)

const retry = () => {
  // 简单重载页面以重试
  window.location.reload()
}
</script>

<style scoped>
/* 简单样式，按需调整 */
pre {
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 240px;
}
</style>