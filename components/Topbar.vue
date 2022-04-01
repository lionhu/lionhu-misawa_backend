<script>
import {mapGetters, mapState} from 'vuex'

export default {
  data() {
    return {
      languages: [
        {
          flag: require('~/assets/images/flags/japan.png'),
          language: 'jp',
          title: 'Japanese',
        },
        {
          flag: require('~/assets/images/flags/us.jpg'),
          language: 'en',
          title: 'English',
        },
        {
          flag: require('~/assets/images/flags/china.png'),
          language: 'zh',
          title: 'Chinese'
        }
      ],
      current_language: this.$i18n.locale,
      text: null,
      flag: null,
      value: null,
    }
  },
  computed: {
    ...mapState({
      ME: state => state.auth.user
    }),
  },
  mounted() {
    this.value = this.languages.find((x) => x.language === this.$i18n.locale)
    this.text = this.value.title
    this.flag = this.value.flag
  },
  methods: {
    toggleMenu() {
      this.$parent.toggleMenu()
    },
    initFullScreen() {
      document.body.classList.toggle('fullscreen-enable')
      if (
        !document.fullscreenElement &&
        /* alternative standard method */
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen()
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen()
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          )
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        }
      }
    },

    toggleRightSidebar() {
      this.$parent.toggleRightSidebar()
    },
    setLanguage(locale, country, flag) {
      this.$i18n.locale = locale
      this.current_language = locale
      this.text = country
      this.flag = flag
    },
    horizonalmenu() {
      const element = document.getElementById('topnav-menu-content')
      element.classList.toggle('show')
    },
    logoutUser() {
      let self = this;
      this.$auth.logout().then((response) => {
        self.$router.push({path: '/account/login'})
      })
    },
  },
}
</script>

<template>
  <!-- Topbar Start -->
  <div class="navbar-custom">
    <div class="container-fluid">
      <ul class="list-unstyled topnav-menu float-right mb-0">
        <b-nav-item-dropdown variant="white" class="d-none d-lg-inline-block" right toggle-class="header-item">
          <template v-slot:button-content>
            <img class :src="flag" alt="Header Language" height="16"/>
            {{ text }}
          </template>
          <b-dropdown-item class="notify-item" v-for="(entry, i) in languages" :key="`Lang${i}`" :value="entry"
                           @click="setLanguage(entry.language, entry.title, entry.flag)"
                           :link-class="{'active': entry.language === current_language}">
            <img :src="`${entry.flag}`" alt="user-image" class="mr-1" height="12"/>
            <span class="align-middle">{{ entry.title }}</span>
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right class="notification-list topbar-dropdown" menu-class="profile-dropdown"
                             toggle-class="p-0">
          <template slot="button-content" class="nav-link dropdown-toggle">
            <div class="nav-user mr-0">
              <img :src="ME.avatar_thumb_url" alt="user-image" class="rounded-circle"/>
              <span class="pro-user-name ml-1">
                            {{ ME ? ME.username : '' }}
                            <i class="mdi mdi-chevron-down"></i>
                        </span>
            </div>
          </template>
          <b-dropdown-header>
            <h6 class="text-overflow m-0 py-2">{{ $t('navbar.dropdown.name.list.greet') }}</h6>
          </b-dropdown-header>
          <b-dropdown-divider></b-dropdown-divider>
          <a class="dropdown-item" @click="logoutUser" href="javascript: void(0);">
            <i class="fe-log-out mr-1"></i>
            <span>{{ $t('navbar.dropdown.name.list.logout') }}</span>
          </a>
        </b-nav-item-dropdown>
        <li class="dropdown notification-list" v-if="ME.roles.includes('superadmin')">
          <a href="javascript:void(0);" @click="toggleRightSidebar" class="nav-link right-bar-toggle toggle-right">
            <i class="fe-settings noti-icon toggle-right"></i>
          </a>
        </li>
      </ul>

      <!-- LOGO -->
      <div class="logo-box">
        <nuxt-link to="/" class="logo logo-dark text-center">
          <span class="logo-sm">
            <img src="~/assets/images/logo-sm-dark.png" style="height:60px;"/>
          </span>
          <span class="logo-lg">
            <img src="~/assets/images/logo-dark.png" style="height:60px;"/>
          </span>
        </nuxt-link>

        <nuxt-link to="/" class="logo logo-light text-center">
          <span class="logo-sm"><img src="~/assets/images/logo-sm.png" style="height:60px;"/></span>
          <span class="logo-lg"><img src="~/assets/images/logo-light.png" style="height:60px;"/></span>
        </nuxt-link>
      </div>

      <ul class="list-unstyled topnav-menu topnav-menu-left m-0">
        <li>
          <button class="button-menu-mobile waves-effect waves-light" @click="toggleMenu">
            <i class="fe-menu"></i>
          </button>
        </li>

        <li>
          <a class="navbar-toggle nav-link" data-toggle="collapse" @click="horizonalmenu()"
             data-target="#topnav-menu-content"
          >
            <div class="lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </a>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
  </div>
  <!-- end Topbar -->
</template>
