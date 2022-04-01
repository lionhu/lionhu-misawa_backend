<script>
import {mapGetters} from "vuex"

export default {
  name: "superadmin_system",
  head() {
    return {
      title: `${this.title} | Admin Dashboard`,
      script: [
        {src: 'https://unpkg.com/element-ui/lib/index.js'}
      ],
      link: [
        {rel: 'stylesheet', href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'}
      ]
    };
  },
  components: {
    Category: () => import('./components/Category'),
    Cache: () => import('./components/Cache'),
    Messager: () => import('./components/Messager'),
    PointPolicy: () => import('./components/PointPolicy'),
    Logistic: () => import('./components/Logistic'),
    "el-select": () => import('element-ui/lib/select'),
    "el-option": () => import('element-ui/lib/option'),
  },
  data() {
    return {
      title: "サプライヤー",
      items: [
        {text: "PINGO"},
        {text: "eCommerce"},
        {text: "サプライヤー", active: true}
      ],
      grouponservice: true,
    };
  },
  computed: {
    ...mapGetters({
      loggedIn: "authfack/loggedIn"
    }),
  },
  middleware: ['router-auth', 'router-superadmin']
};
</script>
<style>
.line-title-width {
  min-width: 45px !important;
}
</style>
<template>
  <div>
    <PageHeader :title="title" :items="items"/>
    <Category/>
    <Cache/>
    <Messager/>
  </div>
</template>
