// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  devtools: { enabled: true },
  compatibilityDate: '2025-11-14',
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  app: {
    // 【关键修改】开启 KeepAlive 缓存
    keepalive: true, 
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
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  routeRules: {
    // 安全重定向规则
    '/**/*.php': { redirect: { to: '/', statusCode: 301 } },
    '/wp-admin/**': { redirect: { to: '/', statusCode: 301 } },
    '/wordpress/**': { redirect: { to: '/', statusCode: 301 } },
    
    // API 缓存策略 - 优化性能
    '/api/gallery/list': { 
      cache: { maxAge: 60 } // 画廊列表缓存 60 秒
    },
    '/api/market/pools': { 
      cache: { maxAge: 60 } // 卡池列表缓存 60 秒  
    },
    '/api/market/leaderboard': { 
      cache: { maxAge: 30 } // 排行榜缓存 30 秒
    },
    '/api/bing': { 
      cache: { maxAge: 3600 } // Bing 壁纸缓存 1 小时
    }
  },
  
  runtimeConfig: {
    dashscopeApiKey: '', 
    public: {}
  },

  // 生产环境优化
  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  // 实验性优化功能
  experimental: {
    payloadExtraction: false,
    componentIslands: false
  }
})