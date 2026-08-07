export default defineNuxtConfig({
  srcDir: '.',
  devtools: { enabled: true },
  css: ['~/assets/css/tokens.css', '~/assets/css/main.css'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Employee Database Lab',
      meta: [
        {
          name: 'description',
          content: 'A secure MySQL testing interface for querying and adding employee records.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/brand/Mark32.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap'
        }
      ]
    }
  },
  runtimeConfig: {
    mysqlHost: process.env.MYSQL_HOST || '127.0.0.1',
    mysqlPort: process.env.MYSQL_PORT || '3306',
    mysqlDatabase: process.env.MYSQL_DATABASE || 'testing_employee_db',
    mysqlQueryUser: process.env.MYSQL_QUERY_USER || 'testing_reader',
    mysqlQueryPassword: process.env.MYSQL_QUERY_PASSWORD || 'testing_reader_password',
    mysqlWriteUser: process.env.MYSQL_WRITE_USER || 'testing_writer',
    mysqlWritePassword: process.env.MYSQL_WRITE_PASSWORD || 'testing_writer_password',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://127.0.0.1:5175',
      assetBaseUrl: process.env.NUXT_PUBLIC_ASSET_BASE_URL || ''
    }
  },
  nitro: {
    preset: 'node-server'
  },
  typescript: {
    strict: true,
    typeCheck: false
  },
  compatibilityDate: '2026-08-07'
})
