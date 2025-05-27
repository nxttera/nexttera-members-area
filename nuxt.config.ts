import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/scripts', '@nuxt/test-utils', '@nuxt/eslint'],

  vite: {
    plugins: [tailwindcss()]
  },

  css: ['~/assets/app.css'],
  imports: {
    dirs: ['stores', 'shared', 'shared/utils', 'shared/constants', 'shared/types', 'shared/utils']
  }
})
