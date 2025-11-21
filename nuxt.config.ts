// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-11-14',
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  // 【核心修改】路由规则：强制动态渲染，禁止缓存
  routeRules: {
    // 主页：服务器端渲染(SSR)，不预渲染，不缓存
    '/': { ssr: true, prerender: false, cache: false },
    
    // 详情页：同上，确保点击进入时获取最新数据
    '/artwork/**': { ssr: true, prerender: false, cache: false },
    
    // 内部 API 接口：绝对不缓存，告诉浏览器和 Vercel 每次都去拿新的
    '/api/**': { cache: false, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    fastGptApiKey: process.env.FASTGPT_API_KEY,
    fastGptApiBase: 'https://gacbai.gxmzu.edu.cn/api',
    public: {}
  }
})