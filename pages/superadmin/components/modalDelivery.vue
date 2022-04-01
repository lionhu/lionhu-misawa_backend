<template>
  <div>
    <b-modal
      id="modal-delivery"
      size="lg"
      centered
      no-close-on-backdrop
      :title="$t('menuitems.ecommerce.orders.delivery.text')"
      :hide-footer="true"
      :hide-header-close="true"
      v-if="openDeliveryModal">

      <div class="card">
        <div class="card-body">
          <div class="row form">
            <div class="col-6">
              <div class="form-group mb-3">
                <label class="col-form-label">{{ $t('menuitems.ecommerce.orders.delivery.is_delivered') }}</label> <br>
                <switches v-model="info.delivered" type-bold="false" color="success"
                          class="ml-1 mb-0"></switches>
              </div>
              <div class="form-group mb-3">
                <label>{{ $t('menuitems.ecommerce.orders.delivery.delivered_at') }}</label>
                <br/>
                <date-picker v-model="info.delivered_at" lang="jp"></date-picker>
              </div>
              <div class="form-group mb-3">
                <h5>订单单号 ID:{{ order.id }}</h5>
              </div>
            </div>
            <div class="col-6 border-left">
              <div class="form-group mb-3">
                <label class="col-md-6 col-form-label">{{ $t('menuitems.ecommerce.orders.delivery.logistic') }}</label>
                <div class="col-md-12">
                  <b-form-select v-model="info.logistic_id" @change="deliverinfo_changed">
                    <b-form-select-option :value="logistic.id" v-for="logistic in logistic_options" :key="logistic.id">
                      {{ logistic.company }}
                    </b-form-select-option>
                  </b-form-select>

                </div>
              </div>
              <div class="form-group mb-3">
                <label class="col-md-6 col-form-label">{{ $t('menuitems.ecommerce.orders.delivery.track_no') }}</label>
                <div class="col-md-12">
                  <b-form-input for="text" v-model="info.delivery_info.track_no"
                                @keyup="deliverinfo_changed"></b-form-input>
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="col-md-6 col-form-label">{{
                    $t('menuitems.ecommerce.orders.delivery.track_link')
                  }}</label>
                <div class="col-md-12">
                  <a :href="info.delivery_info.track_link">{{ info.delivery_info.track_link }}</a>
                  <b-form-input for="text" v-model="info.delivery_info.track_link" hidden></b-form-input>
                </div>
              </div>
            </div>
            <!-- end col -->
          </div>
          <div class="row">
            <div class="col-12">
              <div class="text-center" v-if="result">
                <h2 class="mt-0">
                  <i class="mdi mdi-check-all"></i>
                </h2>
                <h3 class="mt-0">Thank you !</h3>

                <p class="w-75 mb-2 mx-auto">
                  Successfully updated!
                </p>
              </div>
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
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {orderService} from "~/helpers/order.service"

export default {
  name: "delivery_modal_component",
  props: ['openDeliveryModal', "order"],
  data() {
    return {
      info: {
        update_fields: ["delivery"],
        delivered_at: new Date(),
        delivered: false,
        logistic_id: "",
        delivery_info: {
          track_no: "",
          track_link: "",
        }
      },
      result: false,
      updating: false
    }
  },
  watch: {
    openDeliveryModal: function (newvalue, oldvalue) {
      if (newvalue && this.order !== null) {
        this.info.delivered = this.order.delivered;
        let _day = new Date(this.order.delivered_at);
        this.info.delivered_at = this.order.delivered_at !== null ? _day : new Date();
        this.info.delivery_info.track_link = this.order.delivery_info.track_link;
        this.info.delivery_info.track_no = this.order.delivery_info.track_no;
        this.info.logistic_id = this.order.logistic !== null ? this.order.logistic : 0;
      }
    }
  },
  computed: {
    ...mapGetters({
      logistic_options: "logistics/getterLogistics"
    }),
  },
  components: {
    Switches: () => import('vue-switches'),
    DatePicker: () => import('vue2-datepicker'),
  },
  methods: {
    deliverinfo_changed() {
      let logistic = this.logistic_options.find(logistic => logistic.id === this.info.logistic_id)
      this.info.delivery_info.track_link = logistic.track_link !== null ? logistic.track_link.replace("{}", this.info.delivery_info.track_no) : this.info.delivery_info.track_no;
    },

    closeModal() {
      this.$emit("closeModal")
    },
    update_order() {
      let vm = this;
      let order_update_info = {
        order_id: vm.order.id,
        update_fields: ["delivery"],
        update_info: {
          status:vm.info.delivered?"DELIVERING":"PROCESSING",
          delivered_at: vm.info.delivered_at !== "" ? vm.info.delivered_at.toISOString() : new Date(),
          delivered: vm.info.delivered,
          logistic_id: vm.info.logistic_id,
          delivery_info: {
            track_no: vm.info.delivery_info.track_no,
            track_link: vm.info.delivery_info.track_link,
          }
        }
      };
      vm.updating = true;
      orderService.updateOrder(order_update_info)
        .then(response => {
          console.log(response)
          vm.updating = false;
          vm.$emit("updateResult", {
            order_id: vm.order.id,
            delivered_info: order_update_info.update_info
          })
          vm.$bvModal.hide("modal-delivery")
        });
    },
  },
}
</script>
