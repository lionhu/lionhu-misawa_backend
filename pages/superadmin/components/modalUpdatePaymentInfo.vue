<template>
  <div>
    <b-modal
      id="modal-update-supplier-payment"
      size="lg"
      centered
      no-close-on-backdrop
      :title="title"
      :hide-footer="true"
      :hide-header-close="true"
      v-if="showModal">
      <div class="card">
        <div class="card-body">
          <div class="row form">
            <div class="col-6">
              <div class="form-group mb-3">
                <label class="col-form-label">{{ payment_to }}</label> <br>
                <switches v-model="info.paid" type-bold="false" color="success"
                          class="ml-1 mb-0"></switches>
              </div>
              <div class="form-group mb-3">
                <label>Payment Date:</label>
                <br/>
                <date-picker v-model="info.paid_at" lang="jp"></date-picker>
              </div>
              <div class="form-group mb-3">
                <h5>Order ID:{{ order.id }}</h5>
              </div>
            </div>
            <div class="col-6 border-left">
              <div class="form-group mb-3">
                <label class="col-md-6 col-form-label">Payment Method:</label>
                <div class="col-md-12">
                  <b-form-input for="text" v-model="info.paid_info.method"></b-form-input>
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="col-md-6 col-form-label">MEMO</label>
                <div class="col-md-12">
                  <b-form-input for="text" v-model="info.paid_info.memo"></b-form-input>
                </div>
              </div>
            </div>
            <!-- end col -->
          </div>
          <div class="row">
            <div class="col-12">
              <div class="text-center mt-md-3">
                <div class="d-flex justify-content-between mb-3">
                  <b-button variant="danger" class="btn-rounded ml-1" @click="update_order">
                    <b-spinner class="m-2" variant="danger" small role="status" v-if="updating"></b-spinner>
                    Update
                  </b-button>
                  <b-button variant="primary" class="btn-rounded ml-1" @click="closeModal">
                    Close
                  </b-button>
                </div>
              </div>
            </div>
            <!-- end col -->
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import {orderService} from "~/helpers/order.service"

export default {
  name: "modal_update_order_payment",
  props: ['showModal', "order", "payment_to"],
  data() {
    return {
      title: ` Payment`,
      info: {
        paid_at: new Date(),
        paid: false,
        paid_info: {
          method: "Bank Transfer",
          memo: "memo"
        }
      },
      result: false,
      updating: false,
      status: "COMPLETED",
    }
  },
  watch: {
    showModal: function (newvalue, oldvalue) {
      if (newvalue && this.order !== null) {
        if (this.payment_to === "supplier") {
          this.info.paid = this.order.supplier_paid;
          this.info.paid_at = this.order.supplier_payment_info.paid_at !== null ? new Date(this.order.supplier_payment_info.paid_at) : new Date();
          this.info.paid_info.method = this.order.supplier_payment_info.method;
          this.info.paid_info.memo = this.order.supplier_payment_info.memo;
        }
        if (this.payment_to === "user") {
          this.info.paid = this.order.is_paid;
          this.info.paid_at = this.order.payment_info.paid_at !== null ? new Date(this.order.payment_info.paid_at) : new Date();
          this.info.paid_info.method = this.order.payment_info.method;
          this.info.paid_info.memo = this.order.payment_info.memo;
        }
      }
    }
  },
  components: {
    Switches: () => import('vue-switches'),
    DatePicker: () => import('vue2-datepicker'),
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
    },
    update_order() {
      let vm = this;
      vm.updating = true;
      let update_order_info = {};
      let payment_info = {
        paid_at: vm.info.paid_at !== "" ? vm.info.paid_at.toISOString() : new Date(),
        method: vm.info.paid_info.method,
        memo: vm.info.paid_info.memo
      }

      if (this.payment_to === "supplier") {
        update_order_info = {
          supplier_paid: vm.info.paid,
          supplier_payment_info: payment_info
        }
      }
      if (this.payment_to === "user") {
        update_order_info = {
          is_paid: vm.info.paid,
          payment_info: payment_info
        }
      }

      let update_info = {
        order_id: vm.order.id,
        update_fields: ["payment_info"],
        update_info: update_order_info
      };
      console.log(update_info)

      orderService.updateOrder(update_info)
        .then(response => {
          console.log(response)
          vm.updating = false;
          vm.$emit("updateResult", {
            order_update_info:update_info,
            order_id: vm.order.id,
            payment_to:vm.payment_to
          })
          vm.$bvModal.hide("modal-update-supplier-payment")
        });
    }
  },
}
</script>
