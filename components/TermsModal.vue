<template>
  <div class="fixed inset-0 z-[300] flex items-center justify-center p-4">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- 弹窗主体 -->
    <div class="bg-paper w-full max-w-4xl h-[85vh] rounded-lg shadow-2xl relative z-10 flex flex-col border-t-8 border-indigo animate-enter-medium overflow-hidden">
      
      <!-- 头部：政务严肃感与非遗美学结合 -->
      <div class="p-6 border-b border-ink/10 flex justify-between items-center bg-white shrink-0 relative z-10">
        <div>
          <h3 class="font-calligraphy text-3xl text-indigo">用户服务协议、版权声明与隐私政策</h3>
          <div class="flex gap-2 mt-2">
            <span class="text-[9px] px-2 py-0.5 bg-indigo/5 text-indigo border border-indigo/10 rounded">依据 2023 AIGC 新规拟定</span>
            <span class="text-[9px] px-2 py-0.5 bg-gold/5 text-gold border border-gold/10 rounded">非遗数字化保护专项</span>
          </div>
        </div>
        <button @click="$emit('close')" class="text-3xl text-ink/20 hover:text-cinnabar transition-colors">×</button>
      </div>

      <!-- 条文内容 -->
      <div class="flex-1 overflow-y-auto p-8 text-sm text-ink/80 leading-loose font-serif space-y-8 custom-scrollbar relative z-10 bg-white/50">
        
        <div class="bg-paper p-6 border-2 border-gold/20 rounded-sm mb-6">
          <p class="font-bold text-ink mb-2">【首部提示】</p>
          <p class="text-xs">欢迎使用“壮脉智承”。本协议是您与平台之间关于生成式人工智能服务、数字藏品确权及文创兑换的法律协议。我们非常重视您的权益保障，请您在点击“同意”前务必审慎阅读。</p>
        </div>

        <!-- 第一部分：AIGC 规范 -->
        <section>
          <h4 class="font-bold text-lg text-indigo mb-4 flex items-center gap-2">
            <span class="w-1.5 h-6 bg-cinnabar"></span>第一章 生成式人工智能（AIGC）服务规范
          </h4>
          <div class="space-y-3 pl-4 border-l border-ink/5">
            <p>1. <strong>合规性承诺</strong>：依据《<a href="https://www.gov.cn/zhengce/zhengceku/202307/content_6891752.htm" target="_blank" class="text-indigo underline font-bold">生成式人工智能服务管理暂行办法</a>》第四条，用户承诺在使用本平台“对话织锦”、“纹样解构”功能时，不生成煽动颠覆国家政权、暴力淫秽、虚假有害及法律行政法规禁止的内容。</p>
            <p>2. <strong>技术局限性</strong>：基于算法特性，Agent 生成的文字及图片可能存在事实性瑕疵或审美偏好差异。提供者将依据本办法第十五条建立投诉举报机制，及时处理公众投诉。</p>
            <p>3. <strong>标识义务</strong>：本平台所有 AI 生成图片均依据《互联网信息服务深度合成管理规定》进行数字标识，用户不得恶意遮盖或篡改此类标识。</p>
          </div>
        </section>

        <!-- 第二部分：知识产权 -->
        <section>
          <h4 class="font-bold text-lg text-indigo mb-4 flex items-center gap-2">
            <span class="w-1.5 h-6 bg-cinnabar"></span>第二章 著作权归属与区块链确权声明
          </h4>
          <div class="space-y-3 pl-4 border-l border-ink/5">
            <p>1. <strong>著作权权属</strong>：依据《<a href="https://www.gov.cn/guoqing/2021-10/29/content_5647633.htm" target="_blank" class="text-indigo underline font-bold">中华人民共和国著作权法</a>》第三条及 AIGC 相关司法实践，用户通过输入独创性提示词（Prompts）产生的纹样作品，其著作权由<strong>用户与平台共有</strong>。</p>
            <p>2. <strong>哈希指纹存证</strong>：Agent 自动为每张作品生成基于 <strong>SHA-256</strong> 算法的唯一哈希值。该哈希值作为作品在数字空间内的“出生证明”，确保作品不可篡改并锚定创作者身份。</p>
            <p>3. <strong>商业授权</strong>：用户参与“收录”即表示许可平台将该作品用于“收藏集”制作及衍生品开发。平台承诺按照公示的分润比例返还虚拟贡献值。</p>
          </div>
        </section>

        <!-- 第三部分：金融合规 -->
        <section>
          <h4 class="font-bold text-lg text-indigo mb-4 flex items-center gap-2">
            <span class="w-1.5 h-6 bg-cinnabar"></span>第三章 虚拟资产与非金融化声明
          </h4>
          <div class="space-y-3 pl-4 border-l border-ink/5">
            <p>1. <strong>禁止炒作承诺</strong>：依据《<a href="https://bbaachina.org.cn/show/620.html" target="_blank" class="text-indigo underline font-bold">关于防范NFT相关金融风险的倡议</a>》，本平台发行的卡牌仅具艺术欣赏价值，<strong>严禁</strong>进行任何形式的份额拆分、代币发行（ICO）或集中交易。</p>
            <p>2. <strong>抽卡合规</strong>：依据文化部《<a href="https://www.mct.gov.cn/whzx/ggtz/201612/t20161205_695627.htm" target="_blank" class="text-indigo underline font-bold">关于规范网络游戏运营的通知</a>》，锦绣集市公示真实抽取概率，虚拟积分仅限平台内兑换，不具备法定货币兑换功能。</p>
          </div>
        </section>

        <!-- 第四部分：个人信息保护 -->
        <section>
          <h4 class="font-bold text-lg text-indigo mb-4 flex items-center gap-2">
            <span class="w-1.5 h-6 bg-cinnabar"></span>第四章 个人信息与隐私保护义务
          </h4>
          <div class="space-y-3 pl-4 border-l border-ink/5">
            <p>1. <strong>最小必要原则</strong>：依据《<a href="http://www.npc.gov.cn/npc/c2/c30834/202108/t20210820_313088.html" target="_blank" class="text-indigo underline font-bold">中华人民共和国个人信息保护法</a>》第六条，我们仅收集实现织锦、物流配送所必需的个人信息（如收货地址、对话记录）。</p>
            <p>2. <strong>数据加密</strong>：所有用户输入信息和使用记录均依法履行保护义务，不得非法向他人提供，确保您的文化创作隐私受到国家级标准保护。</p>
          </div>
        </section>

        <section class="pb-12 text-center text-ink/40 text-xs">
          <p>—————— 协议终了 ——————</p>
          <p class="mt-2">壮脉智承 研发团队 2025年12月 宣</p>
        </section>

      </div>

      <!-- 底部操作：强制阅读视觉引导 -->
      <div class="p-6 border-t border-ink/10 bg-white shrink-0 flex flex-col items-center gap-4 relative z-10">
        <p class="text-[10px] text-ink/40">点击下方按钮即表示您已阅读并自愿遵守上述所有国家法律法规及平台规范</p>
        <div class="flex gap-4 w-full max-w-md">
          <button @click="$emit('close')" class="flex-1 py-3 border border-ink/20 text-ink/60 hover:bg-paper transition-all rounded-sm font-bold tracking-widest">拒绝</button>
          <button 
            @click="$emit('agree')" 
            class="flex-[2] py-3 bg-cinnabar text-white font-bold tracking-[0.3em] rounded-sm shadow-xl hover:bg-indigo hover:-translate-y-0.5 transition-all duration-300"
          >
            遵循法典并开始
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close', 'agree'])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(27, 52, 92, 0.2); border-radius: 2px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(188, 47, 46, 0.4); }

/* 放射性背景光晕，增加高级感 */
.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%);
}
</style>