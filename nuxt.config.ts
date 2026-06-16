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

  runtimeConfig: {
    public: {
      // Firebase web config — populated from NUXT_PUBLIC_FIREBASE_* env vars.
      // These keys are safe to expose to the client; access is controlled by
      // Firebase Security Rules and the authorized-domains list, not secrecy.
      firebase: {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
      },
    },
  },

  vite: {
    server: {
      allowedHosts: ["7e00-206-85-11-81.ngrok-free.app"],
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      },
    },
  },

  // Firebase's signInWithPopup polls `popup.closed`, which the browser blocks
  // under the default Cross-Origin-Opener-Policy. `same-origin-allow-popups`
  // keeps the opener's reference to popups it opens so Google sign-in works.
  routeRules: {
    "/**": {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      },
    },
  },

  css: ["~/assets/css/global.css", "~/assets/css/fonts.css"],
  modules: ["@nuxt/image"],
});
