import TerserPlugin from 'terser-webpack-plugin'

const envSettings = require(`./env.pingo.js`)
require('dotenv').config();

let _user_https=process.env.USE_HTTPS==="true"
let _baseUrl=process.env.BASE_URL
let _public_websocket_url=process.env.PUBLIC_WEBSOCKET_URL
let _private_websocket_url=process.env.PRIVATE_WEBSOCKET_URL

export default {
  publicRuntimeConfig: {
    lionhu_domainURL:process.env.DOMAIN_URL,
    lionhu_baseURL: _baseUrl,
    lionhu_require_register_introcode: false,
    lionhu_USE_HTTPS: _user_https,
    lionhu_PUBLIC_WEBSOCKET: _public_websocket_url,
    lionhu_PRIVATE_WEBSOCKET: _private_websocket_url,
  },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  dev: false,
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  env: envSettings,
  router: {
    base: '/backend/'
    // base: '/'
  },
  target: "static",
  loading: './components/Loading.vue',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Misawa Pharmacy backend',
    htmlAttrs: {lang: 'en'},
    base: {href: 'router.base'},
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''}
    ],
    script: [
      // {src: 'https://unpkg.com/element-ui/lib/index.js'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/backend/favicon.ico'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/app.scss',
    // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
    // './node_modules/element-ui/packages/theme-chalk/src/base.scss',
  ],

  plugins: [
    '~/plugins/localStorage.js',
    '~/plugins/filters.js',
    '~/plugins/vue_lazyload.js',
    '~/plugins/vue-click-outside.js',
    "~/plugins/vuelidate.js",
  ],

  components: true,

  buildModules: [
    // https://go.nuxtjs.dev/typescript
    // '@nuxt/typescript-build',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-i18n',
    'bootstrap-vue/nuxt',
    'nuxt-fontawesome',
    '@nuxt/image',
    '@nuxtjs/dotenv',
  ],
  auth: {
    // redirect: {
    //   login: '/login',   // 未ログイン時に認証ルートへアクセスした際のリダイレクトURL
    //   logout: '/login',  // ログアウト時のリダイレクトURL
    //   callback: false,   // Oauth認証等で必要となる コールバックルート
    //   home: '/',         // ログイン後のリダイレクトURL
    // },
    plugins: [
      "~/plugins/axios.js"
    ],
    strategies: {
      local: {
        scheme: 'refresh',
        endpoints: {
          login: {url: 'auth/token/obtain/', method: 'post', propertyName: 'token'},
          refresh: {url: 'auth/token/refresh/', method: 'post'},
          user: {url: 'auth/users/me/', method: 'get', propertyName: false},
          logout: false
        },
        user: {
          property: 'data.user',
          autoFetch: true
        },
        token: {
          property: 'data.access',
          // data: 'access',
          maxAge: 60 * 60 * 24
          // maxAge: 60
        },
        refreshToken: {
          property: 'data.refresh',
          data: 'refresh', //must set if refreshtoken --- commented by lionhu
          maxAge: 60 * 60 * 24 * 30,
          tokenRequired: true
        },
      }
    }
  },
  fontawesome: {
    component: 'fa',
    imports: [{
      set: '@fortawesome/free-solid-svg-icons',
      icons: ['faAdjust', 'faHeart', "faUser"]
    }
    ]
  },

  bootstrapVue: {
    components: ['BContainer', 'BRow', 'BCol', "BForm", 'BFormGroup', 'BFormInput', 'BFormRadioGroup', 'BFormRadio',
      'BFormCheckbox', 'BFormSelect', 'BFormSelectOption', 'BButton', 'BAlert', 'BBadge', 'BTabs', 'BTab', 'BModal', 'BNavItemDropdown',
      'BDropdown', 'BSpinner', "BOverlay", 'BDropdownItem', 'BBreadcrumb', 'BDropdownHeader', 'BDropdownDivider', "BPagination"],
    directives: ['VBModal', 'VBPopover', 'VBTooltip', 'VBScrollspy'],
    componentPlugins: [
      'ModalPlugin']
  },
  i18n: {
    locales: ['zh', "jp"],
    defaultLocale: 'zh',
    vueI18n: {
      fallbackLocale: 'zh',
      messages: {
        jp: require('./locales/jp.json'),
        zh: require('./locales/zh.json')
      }
    }
  },
  axios: {
    https: _user_https,
    baseURL: _baseUrl,
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // analyze: true,
    extractCSS: true,
    babel: {
      compact: false,
      plugins: [
        ['component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ]
    },
    transpile: [
      "vee-validate/dist/rules",
      "/node_modules\/(dom7|swiper)\/.*/]",
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: false
        })
      ]
    }
  },

  watchers: {
    chokidar: {
      usePolling: true,
      useFsEvents: false
    },
    webpack: {
      aggregateTimeout: 300,
      poll: true
    }
  }
}
