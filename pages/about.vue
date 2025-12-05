
<template>
  <div class="min-h-screen pt-32 px-4 pb-20 bg-fabric-texture">
    <div class="max-w-6xl mx-auto space-y-20">
      
      <!-- 头部 -->
      <div class="text-center space-y-4 opacity-0 animate-enter-medium">
        <p class="text-cinnabar tracking-[0.5em] text-sm uppercase font-bold">Douruengx Dou</p>
        <h1 class="font-calligraphy text-6xl text-indigo">团队介绍</h1>
        <div class="w-16 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
      </div>

      <!-- 团队成员 (保持不变) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="group bg-white p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-ink/5 hover:-translate-y-2 opacity-0 animate-enter-medium" style="animation-delay: 0.05s">
          <div class="w-20 h-20 bg-paper rounded-full flex items-center justify-center mb-6 mx-auto border border-indigo/10"><span class="font-calligraphy text-4xl text-indigo">高</span></div>
          <div class="text-center space-y-3"><div><a href="https://www.zhuangmai.cloud/" target="_blank" class="inline-block"><h3 class="text-2xl font-bold text-indigo font-serif hover:text-cinnabar transition-colors cursor-pointer flex items-center gap-2">高帅<span class="text-xs opacity-50 font-sans">↗</span></h3></a></div><div><p class="text-gold font-bold text-sm tracking-wider uppercase border-b border-gold/20 pb-2 inline-block">项目负责人 & 架构师</p></div><div class="text-ink/60 text-sm space-y-1 pt-2"><p>全栈视野 | 统筹规划</p></div></div>
        </div>
        <div class="group bg-white p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-ink/5 hover:-translate-y-2 opacity-0 animate-enter-medium" style="animation-delay: 0.1s">
          <div class="w-20 h-20 bg-paper rounded-full flex items-center justify-center mb-6 mx-auto border border-indigo/10"><span class="font-calligraphy text-4xl text-indigo">陈</span></div>
          <div class="text-center space-y-3"><h3 class="text-2xl font-bold text-indigo font-serif">陈朝享</h3><p class="text-gold font-bold text-sm tracking-wider uppercase border-b border-gold/20 pb-2 inline-block">核心开发 & 运维工程师</p><div class="text-ink/60 text-sm space-y-1 pt-2"><p>技术攻坚 | 系统维稳</p></div></div>
        </div>
        <div class="group bg-white p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-ink/5 hover:-translate-y-2 opacity-0 animate-enter-medium" style="animation-delay: 0.15s">
          <div class="w-20 h-20 bg-paper rounded-full flex items-center justify-center mb-6 mx-auto border border-indigo/10"><span class="font-calligraphy text-4xl text-indigo">林</span></div>
          <div class="text-center space-y-3"><h3 class="text-2xl font-bold text-indigo font-serif">林泽男</h3><p class="text-gold font-bold text-sm tracking-wider uppercase border-b border-gold/20 pb-2 inline-block">产品运营 & 品牌主讲</p><div class="text-ink/60 text-sm space-y-1 pt-2"><p>内容创意 | 市场洞察</p></div></div>
        </div>
      </div>

      <!-- 指导老师 (保持不变) -->
      <div class="relative max-w-2xl mx-auto opacity-0 animate-enter-medium" style="animation-delay: 0.3s">
        <div class="absolute inset-0 flex items-center justify-center -z-10"><div class="w-full h-[1px] bg-ink/10"></div></div>
        <div class="bg-paper px-8 py-2 mx-auto w-max relative z-10 text-center"><h2 class="font-calligraphy text-4xl text-ink mb-2">指导老师</h2></div>
        <div class="mt-8 text-center bg-white/60 p-8 rounded-2xl border border-indigo/10 backdrop-blur-sm">
          <a href="https://www.zhuangmai.cloud/" target="_blank" class="inline-block mb-2"><h3 class="text-3xl font-bold text-indigo font-serif hover:text-cinnabar transition-colors cursor-pointer flex items-center justify-center gap-2">郭泉<span class="text-sm opacity-50 font-sans">↗</span></h3></a>
          <p class="text-cinnabar text-sm tracking-widest uppercase mb-4 block">Lauxsae</p>
          <p class="text-ink/60 italic leading-relaxed max-w-lg mx-auto">"指引团队在数字与非遗的交汇点上探索，为壮脉智承提供深厚的学术支持与战略指导。"</p>
        </div>
      </div>

      <!-- 【新增】非遗工坊 (方向三) -->
      <div class="opacity-0 animate-enter-medium border-t border-ink/10 pt-16" style="animation-delay: 0.4s">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-2 h-8 bg-cinnabar"></div>
          <div>
            <h3 class="text-2xl font-bold text-indigo font-serif">合作工坊</h3>
            <p class="text-xs text-ink/40 tracking-widest uppercase">Intangible Heritage Workshop</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-4 shadow-md rotate-1 hover:rotate-0 transition-transform duration-500">
            <div class="aspect-video bg-gray-200 overflow-hidden relative">
              <!-- 请将您的图片命名为 workshop.png 并放在 public 目录下 -->
              <img src="/workshop.png" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=800'" />
              <div class="absolute bottom-0 left-0 bg-black/60 text-white text-xs px-3 py-1">广西·南宁</div>
            </div>
            <p class="mt-3 text-sm text-ink/70 leading-relaxed font-serif">
              我们将尝试与与南宁市的壮锦传承工坊建立深度合作，每一份文创产品的收益，都将直接支持当地绣娘的技艺传承与生计改善。
            </p>
          </div>
          
          <div class="bg-indigo text-white p-8 flex flex-col justify-center items-center text-center -rotate-1 hover:rotate-0 transition-transform duration-500 shadow-md relative overflow-hidden">
            <div class="absolute inset-0 bg-fabric-texture opacity-10"></div>
            <span class="text-6xl font-calligraphy text-gold mb-4">承</span>
            <h4 class="text-xl font-bold mb-2">生产性保护</h4>
            <p class="text-sm opacity-70 max-w-xs mx-auto leading-relaxed">
              "让非遗回归生活，才是最好的保护。"
              <br>
              通过 AI 赋能设计，我们让古老的壮锦纹样焕发新生，走进年轻人的日常。
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '关于团队 - 壮脉智承' })
</script>