<template>
  <div class="chat-container">
    <iframe
      :src="chatbotSrc"
      frameborder="0"
      class="chat-iframe"
      title="智能体对话窗口"
      allow="microphone; camera; clipboard-write;"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
// 将聊天机器人的分享链接放在这里，方便未来修改
const chatbotSrc = 'https://gacbai.gxmzu.edu.cn/chat/share?shareId=yft3kv5dvrdzdzlemelzbl34';
</script>

<style scoped>
.chat-container {
  /* 关键修改 */
  height: 90vh; /* 1. 高度改为 85vh */
  margin-top: -2rem; /* 2. 向上移动，减小与顶栏的间隔 */
  margin-left: -1.5rem; /* 3. 向左扩展，减小左侧间隔 */
  margin-right: -1.5rem; /* 4. 向右扩展，减小右侧间隔 */
  
  display: flex;
  flex-direction: column;
}

.chat-iframe {
  width: 100%;
  height: 100%;
  border-radius: 0.75rem; /* 圆角，与您的网站风格匹配 */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); /* 添加一些阴影 */
}
</style>