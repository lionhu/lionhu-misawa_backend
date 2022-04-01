<script>
import {mapGetters} from 'vuex'
import {APIServices} from "@/helpers/APIs";
import {orderService} from "@/helpers/order.service";

export default {
  name: "backend_index",
  components: {
    PageHeader: () => import(/* webpackChunkName: "about" */ '~/components/Page-header'),
    ProfileCard: () => import(/* webpackChunkName: "about" */ '~/components/widgets/ProfileCard'),
    OrderStatusBoard:()=>import("./widgets/OrderStatusBoard")
  },
  middleware: 'router-auth',
  data() {
    return {
      title: "",
      items: [
        {text: "ベンダー"},
        {text: "ダッシュボード", active: true}
      ],
    }
  },
  computed: {
    ...mapGetters({
      ME: "authfack/ME",
      isSupplier: "authfack/isSupplier"
    })
  },
  mounted() {
    let self = this;
    if (this.isSupplier) {
      APIServices.post("store/public/suppliers/retrieve_by_email/", {
        email: this.ME.email
      }).then(APIServices.handleResponse)
        .then(response => {
          self.$store.commit("suppliers/set_supplier", response.supplier)
        })
      orderService.get_status_count({
        query_type: "by_supplier",
        info: {
          supplier_id: this.ME.supplier.id,
        }
      }).then(APIServices.handleResponse)
        .then(response => {
          console.log(response)
        })
    }

  }
}
</script>

<template>

  <div>
    <PageHeader :title="title" :items="items"/>
    <div class="row mt-3">
      <div class="col-md-6 col-xs-12">
        <ProfileCard/>
      </div>
      <div class="col-md-6 col-xs-12">
        <OrderStatusBoard/>
      </div>
    </div>
  </div>
</template>
