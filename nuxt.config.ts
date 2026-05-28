// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  app: {
    baseURL: "/",
    head: {
      htmlAttrs: { lang: "es" },
      titleTemplate: "%s",
      meta: [
        { name: "theme-color", content: "#294187" },
        { name: "color-scheme", content: "light" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon/favicon.svg" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon/favicon-96x96.png" },
        { rel: "shortcut icon", href: "/favicon/favicon.ico" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" },
        { rel: "manifest", href: "/favicon/site.webmanifest" },
      ],
    },
  },

  vite: {
    server: {
      allowedHosts: ["7e00-206-85-11-81.ngrok-free.app"],
    },
  },

  css: ["~/assets/css/global.css", "~/assets/css/fonts.css"],
  modules: ["@nuxt/image"],
});
