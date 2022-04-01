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
    DeliveryInfoCard: () => import("../widgets/DeliveryInfoCard"),
    DeliveryModal: () => import("../components/modalDelivery"),
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
  middleware: ['router-auth', 'router-supplier'],
  computed: {},
  methods: {
    invoice_link(slug){
      return `${this.$config.lionhu_domainURL}/daphne/api/store/misawa_pdf/${slug}/`
    },
    showDeliveryModal(order_id) {
      this.showmodel_delivery = true
    },
    closeDeliveryModal() {
      this.showmodel_delivery = false;
    },
    UpdateOrderDelivery(info) {
      this.order.delivered = info.delivered_info.delivered;
      this.order.delivered_at = info.delivered_info.delivered_at;
      this.order.delivery_info = info.delivered_info.delivery_info;
      this.order.logistic_id = info.delivered_info.logistic_id;
      this.order.status = info.delivered_info.status;
      this.closeDeliveryModal();
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
              <span class="ml-md-3">
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
            </span>
              <a href="javascript:void(0);" v-b-modal:modal-delivery
                 @click="showDeliveryModal(order,'supplier')" class="pull-right">
                <b-badge variant="danger" class="text-white" pill v-if="!order.delivered"><i
                  class="ri-plane-line"></i></b-badge>
                <b-badge variant="success" class="text-white" pill v-else><i class="ri-flight-takeoff-line"></i>
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
          </div>
          <div class="col-6">
            <DeliveryInfoCard :order="order" class="mb-3"/>
            <RegularOrderSummary :order="order"/>
          </div>
        </div>
      </div>
    </div>
    <DeliveryModal :openDeliveryModal="showmodel_delivery"
                   :order="order"
                   @closeModal="closeDeliveryModal"
                   @updateResult="UpdateOrderDelivery"/>

  </div>
</template>
