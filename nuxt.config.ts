export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  devtools: { enabled: false },
  srcDir: 'app/',
  css: [
    '@fontsource-variable/geist',
    '~/assets/css/tokens.css',
    '~/assets/css/main.css'
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Asset Compliance',
      meta: [
        {
          name: 'description',
          content: 'Device and software-license inventory populated by scheduled NEO Cron jobs.'
        }
      ]
    }
  },
  nitro: {
    preset: 'node-server'
  },
  typescript: {
    strict: true
  }
})
