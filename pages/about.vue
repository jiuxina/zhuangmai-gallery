<template>
  <div class="min-h-screen pt-24 px-4 pb-20 bg-paper">
    <div class="max-w-6xl mx-auto space-y-24">
      
      <!-- 头部：无需延迟 -->
      <div class="text-center space-y-4 opacity-0 animate-enter-medium">
        <p class="text-cinnabar tracking-[0.5em] text-sm uppercase font-bold">Douruengx Dou</p>
        <h1 class="font-calligraphy text-6xl text-ink">团队介绍</h1>
        <div class="w-16 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
        <p class="text-xl text-ink/60 font-serif italic">“黄金三角”</p>
      </div>

      <!-- 成员：延迟缩短 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="group bg-white p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-ink/5 hover:-translate-y-2 opacity-0 animate-enter-medium" style="animation-delay: 0.05s"> <!-- was 0.1s -->
          <!-- ...高帅... -->
           <div class="w-20 h-20 bg-indigo/5 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo/10 transition-colors"><span class="font-calligraphy text-4xl text-indigo">高</span></div>
           <div class="text-center space-y-3"><h3 class="text-2xl font-bold text-indigo font-serif">高帅</h3><p class="text-gold font-bold text-sm tracking-wider uppercase border-b border-gold/20 pb-2 inline-block">项目负责人 & 架构师</p><div class="text-ink/60 text-sm space-y-1 pt-2"><p>全栈视野 | 统筹规划</p></div></div>
        </div>

        <div class="group bg-white p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-ink/5 hover:-translate-y-2 opacity-0 animate-enter-medium" style="animation-delay: 0.1s"> <!-- was 0.2s -->
           <!-- ...陈朝亨... -->
           <div class="w-20 h-20 bg-indigo/5 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo/10 transition-colors"><span class="font-calligraphy text-4xl text-indigo">陈</span></div>
           <div class="text-center space-y-3"><h3 class="text-2xl font-bold text-indigo font-serif">陈朝亨</h3><p class="text-gold font-bold text-sm tracking-wider uppercase border-b border-gold/20 pb-2 inline-block">核心开发 & 运维工程师</p><div class="text-ink/60 text-sm space-y-1 pt-2"><p>技术攻坚 | 系统维稳</p></div></div>
        </div>

        <div class="group bg-white p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-ink/5 hover:-translate-y-2 opacity-0 animate-enter-medium" style="animation-delay: 0.15s"> <!-- was 0.3s -->
           <!-- ...林泽男... -->
           <div class="w-20 h-20 bg-indigo/5 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo/10 transition-colors"><span class="font-calligraphy text-4xl text-indigo">林</span></div>
           <div class="text-center space-y-3"><h3 class="text-2xl font-bold text-indigo font-serif">林泽男</h3><p class="text-gold font-bold text-sm tracking-wider uppercase border-b border-gold/20 pb-2 inline-block">产品运营 & 品牌主讲</p><div class="text-ink/60 text-sm space-y-1 pt-2"><p>内容创意 | 市场洞察</p></div></div>
        </div>
      </div>

      <!-- 导师：Delay 0.5s -> 0.3s -->
      <div class="relative max-w-2xl mx-auto opacity-0 animate-enter-medium" style="animation-delay: 0.3s">
        <!-- 装饰线 -->
        <div class="absolute inset-0 flex items-center justify-center -z-10"><div class="w-full h-[1px] bg-ink/10"></div></div>
        <div class="bg-paper px-8 py-2 mx-auto w-max relative z-10 text-center"><h2 class="font-calligraphy text-4xl text-ink mb-2">指导老师</h2></div>
        <div class="mt-8 text-center bg-white/60 p-8 rounded-2xl border border-indigo/10 backdrop-blur-sm">
          <h3 class="text-3xl font-bold text-indigo font-serif mb-2">郭泉</h3>
          <p class="text-cinnabar text-sm tracking-widest uppercase mb-4">Lauxsae</p>
          <p class="text-ink/60 italic leading-relaxed max-w-lg mx-auto">"指引团队在数字与非遗的交汇点上探索，为壮脉智承提供深厚的学术支持与战略指导。"</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '关于团队 - 壮脉智承' })
</script>