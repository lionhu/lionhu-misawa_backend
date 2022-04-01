<script>
import {marginService} from "~/helpers/margin.service"
import Swal from "sweetalert2";

export default {
  name: "order_point_board",
  props: ["order_id"],
  data() {
    return {
      marginlist: [],
      marginlist_meta: {
        page: 1,
        page_size: 10,
        total: 0
      },
    };
  },
  mounted() {
    console.log("point_board", this.order_id)
    let self = this;
    let options = `?filter{from_orderID}=${this.order_id}&expand=user`
    marginService.load_list(options).then((response) => {
      self.marginlist = response.results;
      self.marginlist_meta = response.meta;
    }).catch((error) => {
      console.log(error)
    })
  },
  methods: {
    async updateMarginValid(margin_id) {
      let self = this;
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: 'set valid?',
        html: "提成已经支付了吗",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        console.log(result)
        if (result.dismiss !== "backdrop") {
          let info = {
            "update_fields": ["is_valid"],
            "is_valid": result.isConfirmed
          }
          console.log(info)
          marginService.update({
            margin_id: margin_id,
            info: info
          }).then(margin => {
            self.replace_margin(margin)
          });
        }

      })
    },
    replace_margin(new_margin) {
      console.log(new_margin)
      let self = this;
      let index = self.marginlist.findIndex(margin => margin.id === new_margin.id);
      if (index > -1) {
        self.marginlist.splice(index, 1, new_margin)
        Swal.fire({
          title: "Success",
          text: "margins has been updated!",
          icon: "success"
        })
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="table-responsive">
      <table class="table table-centered border mb-0">
        <thead class="bg-light">
        <tr>
          <th colspan="3">提成分配信息</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="margin in marginlist">
          <th scope="row">{{ margin.type }}:</th>
          <td>
            {{ margin.user.username }}
          </td>
          <td class="text-right">
            <a href="javascript:void(0);" @click="updateMarginValid(margin.id)">
              <b-badge variant="danger" class="text-white" pill v-if="!margin.is_valid">
                <i class="ri-money-cny-circle-fill"></i>
              </b-badge>
              <b-badge variant="success" class="text-white" pill v-else>
                <i class="ri-money-cny-circle-fill"></i>
              </b-badge>
            </a>
          </td>
          <td class="text-right">
            <strong><span class="text-danger">{{ margin.amount | currency("¥") }}</span></strong>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
