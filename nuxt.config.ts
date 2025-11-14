// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // 我们不再需要 nuxt-security 来处理这个 iframe，但保留它对未来有好处
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-security' 
  ],

  routeRules: {
    '/': { prerender: true }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  // security 模块依然有用，但可以移除之前为 gacbai.gxmzu.edu.cn 添加的特定规则
  security: {
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none' // 或者 'require-corp'
      // 其他安全头可以根据需要保留
    }
  }
})