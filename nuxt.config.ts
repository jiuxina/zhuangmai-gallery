// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 【核心修改】全局关闭服务器端渲染 (SPA模式)
  // 解决 Vercel Serverless Function 报错的根源
  ssr: false,

  devtools: { enabled: true },
  compatibilityDate: '2025-11-14',
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  routeRules: {
    // 拦截恶意爬虫请求
    '/**/*.php': { redirect: { to: '/', statusCode: 301 } },
    '/wp-admin/**': { redirect: { to: '/', statusCode: 301 } },
    '/wordpress/**': { redirect: { to: '/', statusCode: 301 } }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  
  runtimeConfig: {
    public: {}
  }
})