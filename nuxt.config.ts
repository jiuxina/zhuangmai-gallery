// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          "Playfair Display": {
            wght: [400, 700],
            ital: [400],
          },
          Inter: {
            wght: [400, 500, 700],
          },
        },
        display: "swap", // 使用 swap 策略以获得最佳性能
        prefetch: true,
        preconnect: true,
      },
    ],
  ],

  // 为整个应用添加页面过渡效果
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  compatibilityDate: "2025-10-30",
});