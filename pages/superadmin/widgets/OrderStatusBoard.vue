<script>
import {APIServices} from "@/helpers/APIs";
import {orderService} from "@/helpers/order.service";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      status_orders: []
    }
  },
  computed: {
    ...mapGetters({
      ME: "authfack/ME",
    }),
    orders_total() {
      return this.status_orders.reduce((total, item) => {
        return total + item.count
      }, 0)
    }
  },
  mounted() {
    let self = this;
      orderService.get_status_count({
        query_type: "by_superadmin",
      }).then(APIServices.handleResponse)
        .then(response => {
          self.status_orders = response.status_orders
        })
  },
  methods: {
    status_percentage(value) {
      return value/this.orders_total*100
    },
    status_color(status) {
      let color = "bg-danger"
      switch (status) {
        case "NEW":
          break;
        case "PROCESSING":
          color="bg-warning"
          break;
        case "DELIVERING":
          color="bg-info"
          break;
        case "FINISHED":
          color="bg-success"
          break;
      }
      return color;
    }
  }
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <a href="/superadmin/orders" class="p-0 float-right mb-3">{{ $t("menuitems.supplier.list.orders") }} <i class="mdi mdi-download ml-1"></i></a>
      <h4 class="header-title mt-1">Status Orders(total: {{this.orders_total}})</h4>

      <div class="table-responsive mb-0">
        <table class="table table-sm table-centered mb-0 font-14">
          <thead class="thead-light">
          <tr>
            <th>Status</th>
            <th>Orders</th>
            <th style="width: 40%;"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="orders in status_orders">
            <td>{{ orders.status }}</td>
            <td>{{ orders.count }}</td>
            <td>
              <div class="progress" style="height: 3px;">
                <div class="progress-bar" :class="status_color('FINISHED')"
                     role="progressbar" v-bind:style="{width: status_percentage(orders.count)+'%'}" :aria-valuenow="status_percentage(orders.count)" aria-valuemin="0"
                     aria-valuemax="100"></div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!-- end table-responsive-->
    </div>
    <!-- end card-body-->
  </div>
  <!-- end card-->
</template>

