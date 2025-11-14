// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-11-14',
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  routeRules: {
    '/': { prerender: true }
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