<script src="../../../store/modules/categories.js"></script>
<script>
import {mapGetters} from "vuex"
import Swal from "sweetalert2";
import {orderService} from "~/helpers/order.service"

export default {
  name: "order_detail",
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
    "el-select": () => import('element-ui/lib/select'),
    "el-option": () => import('element-ui/lib/option'),
    "user_selector": () => import('~/components/widgets/RemoteUserSelect'),
    SendOrderMailSelector: () => import("../components/SendOrderMailSelector"),
    modalUpdatePaymentInfo: () => import("../components/modalUpdatePaymentInfo"),
    DeliveryModal: () => import("../components/modalDelivery"),
  },
  data() {
    return {
      title: this.$t("menuitems.supplier.list.orders"),
      items: [
        {text: "PINGO"},
        {text: "eCommerce"},
        {text: this.$t("menuitems.supplier.list.orders"), active: true}
      ],
      status_options: [
        {label: "NEW", value: "NEW"},
        {label: "PROCESSING", value: "PROCESSING"},
        {label: "DELIVERING", value: "DELIVERING"},
        {label: "COMPLETED", value: "COMPLETED"}
      ],
      order_filters: {
        ordered_at__gte: this.week_before(),
        ordered_at__lte: new Date().toISOString(),
        status: "NEW",
        user_id: 0
      },
      isLoading: false,
      multipleSelection: [],
      showmodel_payment: false,
      showmodal_payment_status: false,
      showmodal_vendor_payment: false,
      showOrderModalSelector: false,
      showmodel_delivery: false,
      order_type: "",
      orders: [],
      edit_order: 0,
      payment_to: "supplier",
      userlist: [],
      loading: false,
      selectUser: {},
      orders_meta: {
        links: {},
        page: 1,
        page_size: 100,
        total: 0
      },
      page: 1,
      per_page: 10,
      current_order: {}
    };
  },
  computed: {
    ...mapGetters({
      // "orders": "orders/gettersSuperadminOrderList"
    }),
    download_link() {
      let _options = `${this.$config.lionhu_baseURL}/store/0/download_csv/`
      if (this.order_filters.ordered_at__gte !== "") {
        let ordered_at__gte = new Date(this.order_filters.ordered_at__gte)
        _options += `${ordered_at__gte.toISOString()}/`
      }

      if (this.order_filters.ordered_at__lte !== "") {
        let ordered_at__lte = new Date(this.order_filters.ordered_at__lte)
        _options += `${ordered_at__lte.toISOString()}/`
      }
      return _options
    },
    options() {
      let _options = `?page_size=${this.orders_meta.page_size}&page=${this.orders_meta.page}&expand=user,supplier`

      if (this.order_filters.ordered_at__gte !== "") {
        let ordered_at__gte = new Date(this.order_filters.ordered_at__gte)
        _options += `&filter{ordered_at__gte}=${ordered_at__gte.toISOString()}`
      }

      if (this.order_filters.ordered_at__lte !== "") {
        let ordered_at__lte = new Date(this.order_filters.ordered_at__lte)
        _options += `&filter{ordered_at__lte}=${ordered_at__lte.toISOString()}`
      }

      if (this.order_filters.user_id > 0) {
        _options += `&filter{user_id}=${parseInt(this.order_filters.user_id)}`
      }
      if (this.order_filters.status !== "ALL") {
        _options += `&filter{status}=${this.order_filters.status}`
      }

      return _options;
    }
  },
  methods: {
    reset_filters() {
      this.selectUser = null
      this.order_filters.user_id = 0;
      this.orders_meta = {
        links: {},
        page: 1,
        page_size: 100,
        total: 0
      }
      this.orders = []
    },
    handleSelectUser(selectedUser) {
      if (selectedUser !== null) {
        this.selectUser = selectedUser
        this.order_filters.user_id = selectedUser.id;
      } else {
        this.selectUser = null
        this.order_filters.user_id = 0;
      }
    },
    tablePageChange(page) {
      this.orders_meta.page = page;
      this.load_orders()
    },
    week_before() {
      let dt = new Date();
      return new Date(dt.setDate(dt.getDate() - 7)).toISOString();
    },
    change_status(status) {
      this.order_filters.status = status;
      this.load_orders()
    },
    async load_orders() {
      let self = this;
      self.isLoading = true;
      console.log(this.options)
      await orderService.get_list(this.options)
        .then(response => {
          console.log(response)
          self.orders = response.results;
          self.orders_meta = response.meta;
        })
      self.isLoading = false;
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
              let index = self.orders.findIndex(order => order.id === order_id)
              if (index > -1) {
                self.orders[index].status = _status;
              }
              Swal.fire({
                title: `Success`,
                icon: "success"
              })
              return {order_id: response.order_id}
            }).catch(error => {
                Swal.showValidationMessage(`Request failed: ${error.data.message}`)
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
    },
    UpdateOrderPayment({order_update_info, order_id, payment_to}) {
      let index = this.orders.findIndex(order => order.id === order_id)
      if (index > -1) {
        if (payment_to === "supplier") {
          this.orders[index].supplier_paid = order_update_info.update_info.supplier_paid;
          this.orders[index].supplier_payment_info = order_update_info.update_info.supplier_payment_info;
        }
        if (payment_to === "user") {
          this.orders[index].is_paid = order_update_info.update_info.is_paid;
          this.orders[index].payment_info = order_update_info.update_info.payment_info;
        }
        this.closePaymentModal()
      }
    },
    UpdateOrderDelivery({order_id, delivered_info}) {
      let index = this.orders.findIndex(order => order.id === order_id)
      if (index > -1) {
        this.orders[index].delivered_at = delivered_info.delivered_at;
        this.orders[index].delivered = delivered_info.delivered;
        this.orders[index].logistic_id = delivered_info.logistic_id;
        this.orders[index].delivery_info = delivered_info.delivery_info;
        this.closeDeliveryModal();
      }
    },
    async deleteOrder(order_id) {
      let self = this;
      Swal.fire({
        title: '取消订单?',
        html: "确认取消订单吗?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '确认',
        showLoaderOnConfirm: true,
        preConfirm: (confirm) => {
          if (confirm) {
            return orderService.removeOrder_superadmin(order_id)
              .then((res) => {
                Swal.fire(
                  '成功!',
                  '订单取消成功！',
                  'success')
                let orderIndex = self.orders.findIndex(order => order.id === order_id)
                if (orderIndex > -1) {
                  self.orders.splice(orderIndex, 1)
                }
                return {result: true, order_id: res.id};
              }).catch(error => {
                Swal.showValidationMessage(`Request failed: ${error.data.message}`)
              })
          }
        },
        allowOutsideClick: () => false
      })
    },
    handleSelectionChange(val) {
      let kl = val.map(function (order) {
        return order.id
      });
      this.multipleSelection = kl;
    },
    replaceOrderStatus(ids, status) {
      ids.forEach(id => {
        let index = this.orders.findIndex(order => order.id === id)
        if (index > -1) {
          this.orders[index].status = status;
          this.orders[index].payment_status = status;
        }
      })
    },
    replaceOrderPaymentStatus(ids, payment_status) {
      ids.forEach(id => {
        let index = this.orders.findIndex(order => order.id === id)
        if (index > -1) {
          this.orders[index].payment_status = payment_status;
        }
      })
    },
    showPaymentModal(order_id, payment_to) {
      this.edit_order = order_id;
      this.payment_to = payment_to;
      this.showmodel_payment = true
    },
    closePaymentModal() {
      this.edit_order = 0;
      this.payment_to = "";
      this.showmodel_payment = false;
    },
    showDeliveryModal(order_id) {
      this.edit_order = order_id;
      this.showmodel_delivery = true
    },
    closeDeliveryModal() {
      this.edit_order = 0;
      this.showmodel_delivery = false;
    },
    showSendOrderMail(order) {
      this.current_order = order;
      this.showOrderModalSelector = true;
    },
    closeOrderModalSelector() {
      console.log("index closeOrderModal")
      this.current_order = {};
      this.showOrderModalSelector = false;
    }
  },
  middleware: ['router-auth', 'router-superadmin'],
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
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-4">
              <div class="col-6 offset-6 text-right">
                <a :href="download_link" target="_blank">
                  <span class="badge badge-pill badge-success"> <i class="fe-download-cloud"></i>Download ALL!</span>
                </a>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-sm-4">
                <b-dropdown variant="primary" v-model="order_filters.status">
                  <template v-slot:button-content>
                    Status: {{ order_filters.status }}
                    <i class="mdi mdi-chevron-down"></i>
                  </template>
                  <b-dropdown-item v-for="item in status_options" :key="item.value" @click="change_status(item.value)">
                    {{ item.label }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label id="fromDate_picker_label">
                    From:<span class="text-danger">*</span>
                  </label>
                  <el-date-picker
                    id="fromDate_picker"
                    v-model="order_filters.ordered_at__gte"
                    align="right"
                    type="date"
                    placeholder="開始日選択">
                  </el-date-picker>
                </div>
              </div>
              <div class="col-md-4 text-right">
                <div class="form-group">
                  <label id="toDate_picker_label">
                    TO:<span class="text-danger">*</span>
                  </label>
                  <el-date-picker
                    id="toDate_picker"
                    v-model="order_filters.ordered_at__lte"
                    align="right"
                    type="date"
                    placeholder="開始日選択">
                  </el-date-picker>
                </div>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6 text-left">
                <user_selector @SelectUser="handleSelectUser"/>
              </div>
              <div class="col-6 text-right">
                <b-button variant="primary" v-bind:disabled="isLoading" class="btn-rounded ml-1"
                          @click="load_orders">
                  <b-spinner small v-if="isLoading"></b-spinner>&nbsp;&nbsp;Load Data
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="orders.length">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="table-responsive mb-0">
              <div class="row my-2" v-if="orders_meta.total">
                <div class="col">
                  <div class="dataTables_paginate paging_simple_numbers float-right">
                    <ul class="pagination pagination-rounded">
                      <b-pagination v-model="orders_meta.page"
                                    pills
                                    aria-controls="pingoproduct_table"
                                    :total-rows="orders_meta.total"
                                    :per-page="orders_meta.page_size"
                                    @change="tablePageChange"
                      >
                      </b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
              <el-table
                :data="orders"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
<!--                <el-table-column-->
<!--                  type="selection"-->
<!--                  width="30">-->
<!--                </el-table-column>-->

                <el-table-column type="expand">
                  <template slot-scope="props">
                    <div v-if="props.row.message!==''">
                      <h4>Message</h4>
                      <blockquote class="blockquote">
                        <p class="mb-0">{{ props.row.message }}</p>
                        <footer class="blockquote-footer">
                          From <cite title="Source Title">{{ props.row.user }}</cite>
                        </footer>
                      </blockquote>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('menuitems.ecommerce.orders.id')" sortable prop="id">
                  <template slot-scope="scope">
                    {{ '#' + scope.row.id }}<i class=" ri-message-2-fill text-danger" v-if="scope.row.message!==''"></i>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('menuitems.ecommerce.orders.status')">
                  <template slot-scope="scope">

                    <a href="javascript:void(0);" @click="updateOrderStatus(scope.row.id)">
                      <b-badge variant="danger" pill v-if="scope.row.status==='NEW'">{{ scope.row.status }}</b-badge>
                      <b-badge variant="primary" pill v-if="scope.row.status==='DELIVERING'">{{
                          scope.row.status
                        }}
                      </b-badge>
                      <b-badge variant="warning" pill v-if="scope.row.status==='PROCESSING'">{{
                          scope.row.status
                        }}
                      </b-badge>
                      <b-badge variant="success" pill v-if="scope.row.status==='COMPLETED'">{{
                          scope.row.status
                        }}
                      </b-badge>
                    </a>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('menuitems.ecommerce.orders.user')"
                  sortable
                  width="100"
                  prop="user.username">
                </el-table-column>
                <el-table-column
                  :label="$t('menuitems.ecommerce.orders.supplier')"
                  sortable
                  width="100"
                  prop="supplier.name">
                </el-table-column>
                <el-table-column
                  :label="$t('menuitems.ecommerce.orders.total')" sortable prop="Total">
                  <template slot-scope="scope">
                    {{ scope.row.point_usage.isClient?scope.row.chargeAmount:scope.row.Total | currency("¥") }}
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('menuitems.ecommerce.orders.payment')">
                  <template slot-scope="scope">
                    <a href="javascript:void(0);" v-b-modal:modal-update-supplier-payment
                       @click="showPaymentModal(scope.row,'supplier')">
                      <b-badge variant="danger" class="text-white" pill v-if="!scope.row.supplier_paid"><i
                        class="ri-hospital-line"></i></b-badge>
                      <b-badge variant="success" class="text-white" pill v-else><i class="ri-hospital-line"></i>
                      </b-badge>
                    </a>
                    <a href="javascript:void(0);" v-b-modal:modal-update-supplier-payment
                       @click="showPaymentModal(scope.row,'user')">
                      <b-badge variant="danger" class="text-white" pill v-if="!scope.row.is_paid"><i
                        class="ri-money-cny-circle-fill"></i></b-badge>
                      <b-badge variant="success" class="text-white" pill v-else><i class="ri-money-cny-circle-fill"></i>
                      </b-badge>
                    </a>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('menuitems.ecommerce.orders.delivery.text')">
                  <template slot-scope="scope">
                    <a href="javascript:void(0);" v-b-modal:modal-delivery
                       @click="showDeliveryModal(scope.row,'supplier')">
                      <b-badge variant="danger" class="text-white" pill v-if="!scope.row.delivered"><i
                        class="ri-plane-line"></i></b-badge>
                      <b-badge variant="success" class="text-white" pill v-else><i class="ri-flight-takeoff-line"></i>
                      </b-badge>
                    </a>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('menuitems.ecommerce.orders.ordered_at')"
                  sortable
                  width="100"
                  prop="ordered_at">
                  <template slot-scope="scope">
                    {{ scope.row.ordered_at | short_date }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="Action">
                  <template slot-scope="scope">
                    <ul class="list-inline table-action m-0">
                      <li class="list-inline-item">
                        <nuxt-link :to="'/superadmin/orders/' + scope.row.id" class="action-icon text-success">
                          <i class="fe-edit"></i></nuxt-link>

                      </li>
                      <li class="list-inline-item">
                        <a href="javascript:void(0)" v-b-modal:modal-send-order-mail-selector
                           @click="showSendOrderMail(scope.row)" class="action-icon text-success">
                          <i class="fe-send"></i>
                        </a>
                      </li>
                      <li class="list-inline-item">
                        <a href="javascript:void(0)" @click="deleteOrder(scope.row.id)" class="action-icon text-danger">
                          <i class="fe-trash"></i>
                        </a>
                      </li>
                    </ul>
                  </template>
                </el-table-column>
              </el-table>
              <div class="row my-2" v-if="orders_meta.total">
                <div class="col">
                  <div class="dataTables_paginate paging_simple_numbers float-right">
                    <ul class="pagination pagination-rounded">
                      <b-pagination v-model="orders_meta.page"
                                    pills
                                    aria-controls="pingoproduct_table"
                                    :total-rows="orders_meta.total"
                                    :per-page="orders_meta.page_size"
                                    @change="tablePageChange"
                      >
                      </b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-sm-12">
        <div class="text-center section-t-space section-b-space">
          <img src='/images/empty-search.jpg' class="img-fluid" alt/>
        </div>
      </div>
    </div>
    <SendOrderMailSelector
      :order="current_order"
      :showModal="showOrderModalSelector"
      :closeModal="closeOrderModalSelector"/>

    <DeliveryModal :openDeliveryModal="showmodel_delivery"
                   :order="edit_order"
                   @closeModal="closeDeliveryModal"
                   @updateResult="UpdateOrderDelivery">

    </DeliveryModal>

    <modalUpdatePaymentInfo :showModal="showmodel_payment"
                            :order="edit_order"
                            :payment_to="payment_to"
                            @closeModal="closePaymentModal"
                            @updateResult="UpdateOrderPayment">

    </modalUpdatePaymentInfo>
  </div>
</template>
