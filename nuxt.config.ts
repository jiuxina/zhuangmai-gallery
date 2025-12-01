// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  devtools: { enabled: true },
  compatibilityDate: '2025-11-14',
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  app: {
    head: {
      title: '壮脉智承 - 云端艺术馆',
      meta: [
        { name: 'description', content: '非遗壮锦与AI的共创空间' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@300;400;700&display=swap' }
      ]
    },
    // 全局过渡配置：out-in 模式配合 lazy 加载，解决白屏
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  routeRules: {
    '/**/*.php': { redirect: { to: '/', statusCode: 301 } },
    '/wp-admin/**': { redirect: { to: '/', statusCode: 301 } },
    '/wordpress/**': { redirect: { to: '/', statusCode: 301 } }
  },
  
  runtimeConfig: {
    public: {}
  }
})