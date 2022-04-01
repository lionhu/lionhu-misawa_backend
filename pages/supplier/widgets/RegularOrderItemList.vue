<script>
import Swal from 'sweetalert2'
import {swalService} from "~/helpers/swal.service";

export default {
  name: "orderitems_list",
  props: ["order"],
  components: {
    "el-table": () => import('element-ui/lib/table'),
    "el-table-column": () => import('element-ui/lib/table-column'),
  },
  data() {
    return {
      multipleSelection: []
    };
  },
  computed: {
    isClient() {
      return this.order.user.roles.includes("client")
    }
  },
  methods: {
    handleSelectionChange(val) {
      let kl = val.map(function (order) {
        return order.id
      });
      this.multipleSelection = kl;
    },
  }

};
</script>

<template>
  <div class="mt-2">
    <h4 class="header-title mb-3">注文商品一覧 #{{ order.id }}</h4>
    <div class="row">
      <div class="col-12">
        <div>
          <div class="table-responsive">
            <el-table
              class="table table-centered border table-nowrap mb-lg-0"
              :data="order.orderitems"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column label="商品" width="260">
                <template slot-scope="scope">
                  <div class="media align-items-center">
                    <div class="mr-3">
                      <img :src="scope.row.variation.image_url" alt="product-img" height="120"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="数量">
                <template slot-scope="scope">
                  <div class="media align-items-center">
                    <div class="media-body">
                      <p class="mb-0">{{ scope.row.quantity }}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="単価"
                prop="variation.price">
                <template slot-scope="scope">
                  <span class="d-block ">{{ scope.row.variation.purchase_price|currency("¥") }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="合計"
                width="120">
                <template slot-scope="scope">
                  <span class="d-block ">{{ scope.row.variation.purchase_price * scope.row.quantity|currency("¥") }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
