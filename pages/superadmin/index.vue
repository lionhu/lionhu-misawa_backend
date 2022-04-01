<script>
import {mapState} from 'vuex'
import {APIServices} from "~/helpers/APIs.js"

export default {
  name: "backend_SuperAdmin_index",
  components: {
    PageHeader: () => import(/* webpackChunkName: "about" */ '~/components/Page-header'),
    // OrderStatusBoard: () => import("./widgets/OrderStatusBoard"),
    // MonthlyRegisterUsers: () => import("./widgets/MonthlyRegisterUsers"),
    // SupplierPaymentStatus: () => import("./widgets/SupplierPaymentStatus"),
  },
  middleware: ['router-auth', 'router-superadmin'],
  head() {
    return {
      title: 'Client Admin Dashboard | PINGO Backend',
      script: [
        {src: 'https://unpkg.com/element-ui/lib/index.js'}
      ],
      link: [
        {rel: 'stylesheet', href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'}
      ]
    };
  },
  data() {
    return {
      items: [
        {text: 'PINGO'},
        {text: 'Dashboards'},
        {text: 'Sales', active: true}
      ],
    }
  },
  // async asyncData() {
  //   let monthly_users_url = "/backend/dashboard/get_monthly_users/";
  //   let supplier_payment_url = "/backend/dashboard/supplier_payment_status_summary/";
  //   const monthly_users_data = await APIServices.get(monthly_users_url)
  //     .then(APIServices.handleResponse)
  //     .then(response => {
  //       console.log("monthly_users_data",response)
  //       return response.monthly_users;
  //     })
  //   const supplier_payment_status_summary_data = await APIServices.get(supplier_payment_url)
  //     .then(APIServices.handleResponse)
  //     .then(response => {
  //       console.log("supplier_payment_status_summary_data",response)
  //       return response.chart_data;
  //     })
  //   let show_supplier_payment_status=supplier_payment_status_summary_data.labels.length?true:false
  //   return {
  //     monthly_users_categories: monthly_users_data.labels,
  //     monthly_users_data: monthly_users_data.datasets[0].data,
  //     show_supplier_payment_status: show_supplier_payment_status,
  //     supplier_payment_status_categories: show_supplier_payment_status?supplier_payment_status_summary_data.labels:[],
  //     supplier_payment_status_data: show_supplier_payment_status?supplier_payment_status_summary_data.datasets[0].data:[],
  //   }
  // },
  mounted() {
    this.$store.dispatch("categories/load_superadmin_categorylist")
  },
  methods: {},
  computed: {
    ...mapState({
      ME: state => state.auth.user
    }),
    page_title() {
      return "Welcome! " + this.ME.username;
    },
  },
}
</script>

<template>
  <div>
    <PageHeader :title="page_title" :items="items"/>
<!--    <div class="row">-->
<!--      <div class="col-md-6 col-xs-12">-->
<!--        <OrderStatusBoard/>-->
<!--      </div>-->
<!--      <div class="col-md-6 col-xs-12">-->
<!--        <MonthlyRegisterUsers :data="monthly_users_data" :labels="monthly_users_categories"/>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="row">-->
<!--      <div class="col-md-6" v-if="show_supplier_payment_status">-->
<!--        <SupplierPaymentStatus :data="supplier_payment_status_data" :labels="supplier_payment_status_categories" />-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>
