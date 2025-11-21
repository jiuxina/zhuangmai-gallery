<script setup>
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';
// 【新增】引入 Markdown 解析器
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  breaks: true, // 把换行符转换成 <br>
  linkify: true
});

const route = useRoute();
const { id } = route.params;

const { data: artwork, pending, error } = await useAsyncData(`artwork-${id}`, () => $fetch(`/api/artworks?id=${id}`), { lazy: true })

const showShare = ref(false);

const hasExtras = computed(() => {
  if (!artwork.value) return false;
  return !!(artwork.value.fortune || artwork.value.mockupUrl);
});

// --- 【核心修改 1：清洗并渲染寓意解读】 ---
const formattedInterpretation = computed(() => {
  if (!artwork.value || !artwork.value.interpretation) return '';
  
  let rawText = artwork.value.interpretation;

  // 1. 尝试检测是否是 JSON 格式 (例如 {"mdText": "..."})
  try {
    // 如果开头是 {，尝试解析 JSON
    if (rawText.trim().startsWith('{')) {
      const jsonObj = JSON.parse(rawText);
      // 提取 mdText 字段，如果没有就用原文本
      if (jsonObj.mdText) {
        rawText = jsonObj.mdText;
      }
    }
  } catch (e) {
    // 解析失败说明不是 JSON，直接用原文本，不做处理
    console.log('Interpretation is not JSON, using raw text');
  }

  // 2. 去掉可能存在的 Markdown 代码块包裹 (```markdown ... ```)
  // 使用正则表达式替换开头和结尾的 ```markdown 和 ```
  rawText = rawText.replace(/^```markdown\s*/i, '').replace(/```$/, '');

  // 3. 使用 markdown-it 渲染成 HTML
  return md.render(rawText);
});

// --- 【核心修改 2：美化运势排版】 ---
const formattedFortune = computed(() => {
  if (!artwork.value || !artwork.value.fortune) return '';
  let text = artwork.value.fortune;
  
  // 策略：在每一个 "【" 前面加换行，除了第一个
  // 并给【标题】加粗
  text = text.replace(/【/g, '<br><br><span class="font-bold text-purple-700 text-lg">【').replace(/】/g, '】</span>');
  
  // 去掉开头多余的 <br> (如果第一个字符就是换行)
  if (text.startsWith('<br><br>')) {
    text = text.substring(8);
  }
  
  return text;
});

useHead({
  title: () => artwork.value ? `${artwork.value.title} - 云端艺术馆` : '作品详情',
  meta: [
    { name: 'description', content: () => artwork.value ? artwork.value.interpretation : '数字壮锦艺术作品详情' }
  ]
})
</script>

<template>
  <div>
    <!-- 加载与错误状态 -->
    <div v-if="pending" class="text-center py-20">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="mt-4 text-text-light">正在加载作品...</p>
    </div>
    <div v-if="error || (artwork && artwork.error)" class="text-center py-20">
      <h1 class="text-4xl font-bold mb-4">作品未找到</h1>
      <p class="text-lg text-text-light">抱歉，我们无法找到您想查看的艺术品。</p>
      <NuxtLink to="/" class="mt-6 inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl">返回画廊</NuxtLink>
    </div>
    
    <!-- 作品详情 -->
    <div v-if="artwork && !artwork.error">
      <!-- 1. 顶部英雄图片区域 -->
      <div 
        class="h-[70vh] w-full bg-cover bg-center relative"
        :style="{ backgroundImage: `url(${artwork.imageUrl})` }"
      >
        <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent"></div>
      </div>

      <!-- 2. 内容区域 -->
      <div class="relative bg-gray-50 pb-20">
        <div class="max-w-5xl mx-auto px-6">
          <div class="transform -translate-y-24">
            
            <!-- 标题部分 -->
            <div class="text-center mb-12 drop-shadow-sm">
              <h1 class="text-6xl font-bold font-serif text-gray-900 leading-tight">{{ artwork.title }}</h1>
              <div class="mt-4 flex flex-col items-center gap-2">
                <p class="text-xl text-gray-700 font-medium">
                  由 <span class="font-semibold text-primary">{{ artwork.author }}</span> 创作
                </p>
                <div v-if="artwork.hashId" class="flex items-center gap-1 text-xs text-gray-400 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-100" title="区块链级唯一标识">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span class="font-mono">Hash: {{ artwork.hashId.substring(0, 16) }}...</span>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <!-- 左侧：AI解读 -->
              <div 
                :class="[
                  'bg-white p-8 md:p-10 rounded-2xl border border-gray-200/60 shadow-xl flex flex-col',
                  hasExtras ? 'lg:col-span-7' : 'lg:col-span-12'
                ]"
              >
                <div class="flex justify-between items-start mb-6">
                  <h2 class="text-2xl font-bold font-serif text-primary/90 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    AI 寓意解读
                  </h2>
                </div>

                <!-- 语音播放器 -->
                <div v-if="artwork.audioUrl" class="mb-6 bg-primary/5 rounded-xl p-3 flex items-center gap-3 border border-primary/10">
                  <div class="bg-white p-2 rounded-full shadow-sm text-primary">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" /></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-primary font-bold mb-1">非遗之声 · 听见壮锦</div>
                    <audio controls :src="artwork.audioUrl" class="w-full h-6 block custom-audio"></audio>
                  </div>
                </div>

                <!-- 【核心修改】使用 v-html 渲染处理后的 HTML，并添加 prose 类来优化排版 -->
                <div 
                  class="prose prose-slate max-w-none text-gray-600 leading-loose text-lg text-justify" 
                  v-html="formattedInterpretation"
                ></div>
              </div>

              <!-- 右侧：特色功能 -->
              <div v-if="hasExtras" class="lg:col-span-5 space-y-6">
                
                <!-- 赛博占卜 -->
                <div v-if="artwork.fortune" class="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-100 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div class="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:opacity-20 transition-opacity">🔮</div>
                  <h3 class="text-xl font-bold text-purple-900 mb-4 font-serif flex items-center gap-2">
                    今日纹样灵签
                  </h3>
                  <div class="relative">
                    <!-- 【核心修改】使用 v-html 渲染处理后的运势 -->
                    <div 
                      class="text-purple-800/90 italic leading-relaxed text-lg px-2 font-medium"
                      v-html="formattedFortune"
                    ></div>
                  </div>
                </div>

                <!-- 文创预览 -->
                <div v-if="artwork.mockupUrl" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg group">
                  <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>🛍️</span> 文创衍生品预览
                    <span class="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded">AI生成</span>
                  </h3>
                  <div class="overflow-hidden rounded-xl bg-gray-50 border border-gray-100 aspect-square relative">
                    <img :src="artwork.mockupUrl" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out" alt="文创效果图">
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          <!-- 底部按钮 -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 pb-10">
            <NuxtLink to="/" class="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-primary transition-colors duration-300 group px-6 py-3 rounded-full hover:bg-white/50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              返回画廊
            </NuxtLink>

            <button 
              @click="showShare = true"
              class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              AI 一键生成分享
            </button>
          </div>

        </div>
      </div>
    </div>

    <ShareModal 
      :is-open="showShare" 
      :artwork="artwork" 
      @close="showShare = false" 
    />

  </div>
</template>

<style scoped>
.custom-audio {
  height: 32px;
}
.custom-audio::-webkit-media-controls-panel {
  background-color: transparent;
}
/* 针对 Markdown 内容的一些基础样式优化 */
:deep(.prose h3) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-size: 1.25em;
  font-weight: bold;
  color: #1f2937;
}
:deep(.prose ul) {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-bottom: 1em;
}
:deep(.prose p) {
  margin-bottom: 1em;
}
:deep(.prose strong) {
  color: #b91c1c; /* 让强调文字变成壮锦红 */
}
</style>