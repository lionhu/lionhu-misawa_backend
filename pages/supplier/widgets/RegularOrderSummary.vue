<script>
export default {
  name: "regular_order_summary",
  props: ["order"],
  data() {
    return {
    };
  },
  computed: {
    shop_profit(){
      return this.order.order_bonus.ExtraCostTotalAmount-this.order.order_bonus.SuperadminTotalPoints-this.order.total.total_purchase_price
    },
    client_profit(){
      return this.order.Total-this.order.order_bonus.ExtraCostTotalAmount
    }
  },
  methods: {

  }

};
</script>

<template>
  <div>
    <div class="table-responsive">
      <table class="table table-centered border mb-0">
        <thead class="bg-light">
        <tr>
          <th colspan="3">订单概要</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">进货价</th>
          <td class="text-right">
            <span class="d-block ">{{ order.total.total_purchase_price|currency("¥") }}</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
