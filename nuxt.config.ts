// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-auth-sanctum'],

  ssr: false,

  imports: {
    dirs: ['types']
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.BASE_URL ?? 'http://localhost:80'
    }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  sanctum: {
    redirect: {
      onLogin: '/',
      onLogout: '/login',
      onAuthOnly: '/login'
    },
    globalMiddleware: {
      enabled: true
    },
    baseUrl:
      process.env.NUXT_PUBLIC_SANCTUM_BASE_URL || 'http://localhost:80'
  }
})
