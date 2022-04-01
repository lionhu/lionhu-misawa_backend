<script>

export default {
  name: "order_detail_shippingaddress",
  props: ["shippingaddress"],
};
</script>

<template>
  <div>
    <div class="table-responsive">
      <table class="table table-centered border mb-0">
        <thead class="bg-light">
        <tr>
          <th colspan="3">收件人信息</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th colspan="2">
            <h5 class="font-15 m-0">{{ shippingaddress.name }}</h5>
          </th>
        </tr>
        <tr>
          <th scope="row">Address:</th>
          <td>〒{{ shippingaddress.postcode }} <br>
            {{ shippingaddress.address_1 }} <br>
            {{ shippingaddress.address_2 }}
          </td>
        </tr>
        <tr>
          <th scope="row">Phone :</th>
          <td>{{ shippingaddress.phone }}</td>
        </tr>
        <tr>
          <th scope="row">Email :</th>
          <td>{{ shippingaddress.email }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
