<script>
export default {
  name: "regular_order_summary_header",
  props: ["order"],
};
</script>

<template>
  <div>

    <div class="row">
      <div class="col-lg-3 col-sm-6">
        <div class="media mb-2">
          <div class="mr-2 align-self-center">
            <i class="ri-hashtag h2 m-0 text-muted"></i>
          </div>
          <div class="media-body">
            <p class="mb-1">注文番号No.</p>
            <h5 class="mt-0">
              #{{ order.id }}
            </h5>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-sm-6">
        <div class="media mb-2">
          <div class="mr-2 align-self-center">
            <i :class="{'ri-user-star-fill text-danger':order.user.roles.includes('client'),'ri-user-2-line text-muted':!order.user.roles.includes('client')}" class="h2 m-0"></i>
          </div>
          <div class="media-body">
            <p class="mb-1">ユーザー</p>
            <h5 class="mt-0">
              {{ order.user.username }}
            </h5>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-sm-6">
        <div class="media mb-2">
          <div class="mr-2 align-self-center">
            <i class="ri-calendar-event-line h2 m-0 text-muted"></i>
          </div>
          <div class="media-body">
            <p class="mb-1">日付</p>
            <h5 class="mt-0">
              {{ order.ordered_at |short_date }} <small
              class="text-muted">{{ order.ordered_at|short_time }}</small>
            </h5>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-sm-6">
        <div class="media mb-2">
          <div class="mr-2 align-self-center">
            <i class="ri-money-cny-circle-fill h2 m-0 text-warning"></i>
          </div>
          <div class="media-body">
            <p class="mb-1">総額</p>
            <h5 class="mt-0">
              {{ order.total.total_purchase_price|currency("¥") }}
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
