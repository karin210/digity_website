// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  app: {
    baseURL: "/",
  },

  vite: {
    server: {
      allowedHosts: ["7e00-206-85-11-81.ngrok-free.app"],
    },
  },

  css: ["~/assets/css/global.css", "~/assets/css/fonts.css"],
  modules: ["@nuxt/image"],
});
