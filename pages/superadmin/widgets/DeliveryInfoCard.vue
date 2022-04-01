<script>
export default {
  name: "delivery_info_card",
  props: ["order"],
}
</script>

<template>
  <div>
    <div class="card p-2 mb-lg-0" v-if="order.delivered">
      <div class="text-center">
        <div class="my-2">
          <i class="mdi mdi-truck-fast h1 text-muted"></i>
        </div>
        <h5><b>{{ order.logistic.company }}</b></h5>
        <div class="mt-2 pt-1">
          <p class="mb-1">
            <span class="font-weight-semibold">{{ $t('menuitems.ecommerce.orders.delivery.track_no') }} :</span>
            <a
              :href="order.delivery_info.track_link">{{ order.delivery_info.track_no }}</a>
          </p>
          <p class="mb-1">
            <span class="font-weight-semibold">{{ $t('menuitems.ecommerce.orders.delivery.delivered_at') }} :</span>
            {{ order.delivered_at |short_date }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
