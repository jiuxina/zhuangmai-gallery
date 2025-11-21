// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-11-14',
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  // 【核心修改】路由规则
  routeRules: {
    // 1. 强制核心页面使用 SPA 模式 (ssr: false)
    // 这里的逻辑是：Vercel 服务器只负责发送空壳 HTML，不执行任何 JS 代码
    // 所有数据请求全部由用户浏览器发起，彻底避开 Vercel 服务器报错
    '/': { ssr: false },
    '/artwork/**': { ssr: false },
    
    // 2. API 接口依然不缓存
    '/api/**': { cache: false, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } },

    // 3. 拦截垃圾爬虫 (保持不变)
    '/**/*.php': { redirect: { to: '/', statusCode: 301 } },
    '/wp-admin/**': { redirect: { to: '/', statusCode: 301 } },
    '/wordpress/**': { redirect: { to: '/', statusCode: 301 } }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  // 这里不需要改动
  runtimeConfig: {
    fastGptApiKey: process.env.FASTGPT_API_KEY,
    fastGptApiBase: 'https://gacbai.gxmzu.edu.cn/api',
    public: {}
  }
})