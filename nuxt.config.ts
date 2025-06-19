import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  ssr: true,
  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/eslint",
    "@nuxtjs/supabase",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@formkit/nuxt",
  ],
  supabase: {
    redirectOptions: {
      exclude: [
        "/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/registered",
        "/verify-email",
        "/404",
        "/500",
        "/termos-de-uso",
        "/politica-de-privacidade",
      ],
      saveRedirectToCookie: true,
      login: "/login",
      callback: "/confirm",
    },
    cookiePrefix: "__nxt__",
    types: "./shared/types/database.types",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/app.css"],
  imports: {
    dirs: [
      "stores",
      "shared",
      "shared/utils",
      "shared/constants",
      "shared/types",
      "shared/utils",
    ],
  },
  i18n: {
    baseUrl: "https://app.nexttera.com.br",
    bundle: {
      optimizeTranslationDirective: false,
    },
    defaultLocale: "pt",
    customBlocks: {
      defaultSFCLang: "yaml",
    },
    locales: [
      {
        code: "pt",
        language: "pt-BR",
        isDefault: true,
        isCatchallLocale: true,
      },
      {
        code: "en",
        language: "en-US",
      },
    ],
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  formkit: {
    autoImport: true,
  },
});
