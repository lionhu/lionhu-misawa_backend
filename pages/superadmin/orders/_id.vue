<script>
import Swal from 'sweetalert2'
import {swalService} from "~/helpers/swal.service";
import {orderService} from "~/helpers/order.service"
import {mapState, mapGetters} from "vuex"

export default {
  name: "order_detail",
  head() {
    return {
      title: `${this.title} | Pingo - Order`,
      script: [
        {src: 'https://unpkg.com/element-ui/lib/index.js'}
      ],
      link: [
        {rel: 'stylesheet', href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'},
      ]
    };
  },
  components: {
    RegularOrderSummary: () => import("../widgets/RegularOrderSummary"),
    RegularOrderSummaryHeader: () => import("../widgets/RegularOrderSummaryHeader"),
    RegularOrderItemList: () => import("../widgets/RegularOrderItemList"),
    ShippingAddress: () => import("../widgets/ShippingAddress"),
    PointBoard: () => import("../widgets/PointBoard"),
    DeliveryInfoCard: () => import("../widgets/DeliveryInfoCard"),
    "el-table": () => import('element-ui/lib/table'),
    "el-table-column": () => import('element-ui/lib/table-column'),
  },
  async asyncData({params}) {
    let order_id = parseInt(params.id);

    if (order_id) {
      let options = `${order_id}/?expand=orderitems,user`
      let orderDetail = await orderService.get_list(options).then((response) => {
        return response
      }).catch((error) => {
        console.log(error)
      })
      return {order: orderDetail}
    }
    window.location.href = "/superadmin/ecommerce/orders"
  },
  data() {
    return {
      title: "Order Detail",
      items: [
        {text: "WAVUS"},
        {text: "eCommerce"},
        {text: "Order Detail", active: true}
      ],
      showmodel_delivery: false,
      showmodel_paysupplier: false,
      edit_orderitem: {},
      multipleSelection: []
    };
  },
  middleware: ['router-auth', 'router-superadmin'],
  computed: {},
  methods: {
    invoice_link(slug){
      return `${this.$config.lionhu_domainURL}/daphne/api/store/misawa_pdf/${slug}/`
    },
    async updateOrderStatus(order_id) {
      let self = this;
      console.log("updateOrderStatus", order_id)
      const {value: _status} = await Swal.fire({
        title: 'Order Status',
        html: `ID：${JSON.stringify(order_id)}`,
        input: 'select',
        inputOptions: {
          'NEW': 'NEW',
          "PROCESSING": "PROCESSING",
          'COMPLETED': 'COMPLETED'
        },
        inputPlaceholder: 'Select a status',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: (_status) => {
          console.log(_status)
          let order_update_info = {
            order_id: order_id,
            update_fields: ["status"],
            update_info: {
              status: _status,
            }
          };
          return orderService.updateOrder(order_update_info)
            .then(response => {
              console.log(response)
              self.order.status = _status;
              Swal.fire({
                title: `Success`,
                icon: "success"
              })
            }).catch(error => {
              Swal.showValidationMessage(`Request failed: ${error.data.message}`)
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
    },
  }

};
</script>

<style>
.font-16 {
  font-size: 1.5rem;
}
</style>
<template>
  <div>
    <PageHeader :title="title" :items="items"/>

    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header border-bottom bg-transparent">
            <h5 class="header-title mb-0">Order #{{ order.id }}
              <a href="javascript:void(0);" @click="updateOrderStatus(order.id)">
                <b-badge variant="danger" pill v-if="order.status==='NEW'">{{ order.status }}</b-badge>
                <b-badge variant="primary" pill v-if="order.status==='DELIVERING'">{{
                    order.status
                  }}
                </b-badge>
                <b-badge variant="warning" pill v-if="order.status==='PROCESSING'">{{
                    order.status
                  }}
                </b-badge>
                <b-badge variant="success" pill v-if="order.status==='COMPLETED'">{{
                    order.status
                  }}
                </b-badge>
              </a>

              <a target="_blank" class="btn btn-outline"
                 :href="invoice_link(order.slug)">
                <b-badge variant="success" pill>
                <i class="ri-file-ppt-2-line"></i>PDF
                </b-badge>
              </a>
            </h5>
          </div>
          <div class="card-body">
            <div>
              <h5 v-if="order.message!==''">Message from Customer: </h5>
              <b-alert show dismissible class="bg-danger text-white border-0 mb-2" v-if="order.message!==''">
                {{ order.message }}
              </b-alert>
              <RegularOrderSummaryHeader :order="order"/>
            </div>
            <RegularOrderItemList :order="order"/>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-6">
            <ShippingAddress :shippingaddress="order.json_shippingaddress"/>
            <DeliveryInfoCard :order="order"/>
          </div>
          <div class="col-6">
            <RegularOrderSummary :order="order"/>
            <PointBoard :order_id="order.id"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
