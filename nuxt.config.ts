// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  app: {
    baseURL: "/",
  },

  css: ["~/assets/css/global.css", "~/assets/css/fonts.css"],
  modules: ["@nuxt/image"],
});