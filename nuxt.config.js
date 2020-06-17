require('dotenv').config()

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#6040dd' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vue-resize',
    {
      src: '~/plugins/vuex-persist',
      ssr: false
    }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          databaseURL: process.env.FIREBASE_DATABASE_URL,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          appId: process.env.APP_ID
        },
        services: {
          auth: true,
          firestore: true
        }
      }
    ]
  ],
  axios: {
    proxy: true
  },
  proxy: {
    '/wikidataAPI': {
      target: 'https://wikidata.org/w/api.php',
      pathRewrite: {
        '^/wikidataAPI': ''
      },
      changeOrigin: true
    },
    '/wikimediaCommons': {
      target: 'https://commons.wikimedia.org/w/thumb.php',
      pathRewrite: {
        '^/wikimediaCommons': ''
      }
    },
    '/musicBrainzAPI': {
      target: 'https://musicbrainz.org/ws/2',
      pathRewrite: {
        '^/musicBrainzAPI': ''
      }
    },
    '/archive': {
      target: 'https://archive.org/',
      pathRewrite: {
        '^/archive': ''
      },
      followRedirects: true
    }
  },
  styleResources: {
    scss: ['~/assets/scss/palette.scss']
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    publicPath: '/public/',
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
