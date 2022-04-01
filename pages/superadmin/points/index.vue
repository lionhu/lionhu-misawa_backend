<script>
const inputValidOptions = {
  '1': 'Valid',
  '0': 'Invalid'
}
export default {
  name: "marginlist",
  head() {
    return {
      title: `${this.title} | WAVUS, PINGO`,
      script: [
        {src: 'https://unpkg.com/element-ui/lib/index.js'}
      ],
      link: [
        {rel: 'stylesheet', href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'}
      ]
    };
  },
  components: {
    "el-table": () => import('element-ui/lib/table'),
    "el-table-column": () => import('element-ui/lib/table-column'),
    "el-date-picker": () => import('element-ui/lib/date-picker'),
    "el-input": () => import('element-ui/lib/input'),
    "ToApprovedList": () => import('./ToApprovedList'),
    "AllList": () => import('./AllList'),
  },
  data() {
    return {
      title: "ポイント履歴詳細",
      items: [
        {　text: "PINGO"　},
        {　text: "eCommerce"　},
        {　text: "ポイント履歴詳細",　active: true　}
      ],
    };
  },
  middleware: ['router-auth', 'router-superadmin'],
};
</script>

<template>
  <div>
    <PageHeader :title="title" :items="items"/>

    <b-tabs justified pills class="navtab-bg" content-class="mt-3" @activate-tab="">
      <AllList/>
    </b-tabs>
  </div>
</template>
