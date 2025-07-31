// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
  ssr: false,
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      "postcss-import": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: "Taskify.com",
      meta: [
        {
          name: "description",
          content: "",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@primevue/nuxt-module",
    "@nuxtjs/color-mode",
  ],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode'
  },
  runtimeConfig: {
    public: {
      apiBaseUrlLocal: process.env.API_BASE_URL_LOCAL,
      apiBaseUrlProd: process.env.API_BASE_URL_PROD,
      FB_API_KEY: process.env.FB_API_KEY,
      FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
      FB_PROJECT_ID: process.env.FB_PROJECT_ID,
      FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
      FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
      FB_APP_ID: process.env.FB_APP_ID,
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  piniaPluginPersistedstate: {
    storage: "localStorage",
  },
  primevue: {
    options: {
      theme: "none",
    },
  },
});