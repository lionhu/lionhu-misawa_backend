<script>
export default {
  name: "edit_product_variation",
  props: ["showVariationModal", "modeAdd", "edit_variation", "product"],
  components: {
    Switches: () => import('vue-switches'),
  },
  data() {
    return {
      submitted: false
    };
  },
  computed: {
    introduction_point_total() {
      if (this.edit_variation === undefined) {
        return 0;
      }
      return parseInt(this.edit_variation.point_rule.policies.client_superadmin) + parseInt(this.edit_variation.point_rule.policies.client_admin) +
        parseInt(this.edit_variation.point_rule.policies.level_2) + parseInt(this.edit_variation.point_rule.policies.level_1) +
        parseInt(this.edit_variation.point_rule.policies.user_self)
    },
    profit() {
      let special_promotion_bonus = this.edit_variation.point_rule.special_promotion.is_valid ? this.edit_variation.point_rule.special_promotion.bonus : 0;
      return parseInt(this.edit_variation.price) - parseInt(this.edit_variation.purchase_price) - parseInt(this.edit_variation.extra_cost) - this.introduction_point_total - special_promotion_bonus;
    },
    vendorlist() {
      return this.$store.state.system.vendorlist;
    },
    csrftoken() {
      return this.$store.state.auth.user.token;
    },
  },
  methods: {
    updateProductVariationInformation() {
      var vm = this;
      this.edit_variation.item = this.product.id;
      this.edit_variation.price = parseInt(this.edit_variation.price);
      this.edit_variation.purchase_price = parseInt(this.edit_variation.purchase_price);
      this.edit_variation.extra_cost = parseInt(this.edit_variation.extra_cost);
      this.edit_variation.sort_by = parseInt(this.edit_variation.sort_by);
      this.edit_variation.point_rule.policies.client_admin = parseInt(this.edit_variation.point_rule.policies.client_admin);
      this.edit_variation.point_rule.policies.client_superadmin = parseInt(this.edit_variation.point_rule.policies.client_superadmin);
      this.edit_variation.point_rule.policies.level_1 = parseInt(this.edit_variation.point_rule.policies.level_1);
      this.edit_variation.point_rule.policies.level_2 = parseInt(this.edit_variation.point_rule.policies.level_2);
      this.edit_variation.point_rule.policies.user_self = parseInt(this.edit_variation.point_rule.policies.user_self);
      // this.edit_variation.point_rule.special_promotion.bonus = parseInt(this.edit_variation.point_rule.special_promotion.bonus);

      if (!this.modeAdd) {
        let variation_id=this.edit_variation.id;
        delete this.edit_variation.image;
        this.$store.dispatch("products/update_variation",
          {variation_id:variation_id,info:this.edit_variation})
          .then((response) => {
              vm.$emit("operateresult", {"modeAdd": false, "_variation": response, variation_id:variation_id})
          })
      } else {
        this.$store.dispatch("products/create_variation", this.edit_variation)
          .then((response) => {
            console.log("create_variation",response)
              // var variation_server = response.variation;
              vm.$emit("operateresult", {"modeAdd": true, "_variation": response})
          })
      }
    },
  },
};
</script>

<template>

  <b-modal id="modal_variation_component"
           scrollable
           centered
           title="Edit Variation Information"
           title-class="font-18"
           body-class="p-4"
           hide-footer
           v-if="showVariationModal"
  >
    <form @submit.prevent="updateProductVariationInformation">
      <div class="row mt-md-2">
        <div class="col-md-6">
          <div class="form-group">
            <label for="product-sku" class="control-label">SKU
              <span class="text-danger">*</span>
            </label>
            <input type="text" v-model="edit_variation.sku" id="product-sku" class="form-control"
                   :placeholder="edit_variation.sku"/>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="product-sort">
              並び順番:
              <span class="text-danger">*</span>
            </label>
            <input type="number" v-model="edit_variation.sort_by" id="product-sort" class="form-control"
                   :placeholder="edit_variation.sort_by"/>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label for="field-item_name" class="control-label">商品名
              <span class="text-danger">*</span>
            </label>
            <input type="text" id="field-item_name" v-model="edit_variation.name" class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.name.$error }"
                   :placeholder="edit_variation.name"/>

            <div v-if="submitted && !$v.edit_variation.name.required" class="invalid-feedback">This value is required.
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label for="field-item_name" class="control-label">商品名(ZH)
              <span class="text-danger">*</span>
                  <a href="javascript:void(0);" @click="edit_variation.name_zh=edit_variation.name">Copy</a>
            </label>
            <input type="text" id="field-item_name_zh" v-model="edit_variation.name_zh" class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.name_zh.$error }"
                   :placeholder="edit_variation.name_zh"/>

            <div v-if="submitted && !$v.edit_variation.name_zh.required" class="invalid-feedback">This value is required.
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label for="field-description" class="control-label">概要</label>
            <textarea id="field-description" v-model="edit_variation.description" class="form-control"
                      :placeholder="edit_variation.description"
                      :class="{ 'is-invalid': submitted && $v.edit_variation.description.$error }"/>

            <div v-if="submitted && !$v.edit_variation.description.required" class="invalid-feedback">This value is
              required.
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <div class="form-group">
            <label for="field-price" class="control-label">販売価格
              <span class="text-danger">*</span>
            </label>
            <input type="number" id="field-price" v-model="edit_variation.price" class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.price.$error }"
                   :placeholder="edit_variation.price"/>

            <div v-if="submitted && !$v.edit_variation.price.required" class="invalid-feedback">This value is
              required.
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label for="field-price" class="control-label">代理価格
              <span class="text-danger">*</span>
            </label>
            <input type="number" id="field-extra_cost" v-model="edit_variation.extra_cost"
                   class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.extra_cost.$error }"
                   :placeholder="edit_variation.extra_cost"/>

            <div v-if="submitted && !$v.edit_variation.extra_cost.required" class="invalid-feedback">This value is
              required.
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label for="field-price" class="control-label bg-danger text-white d-block text-center">仕入価格
              <span class="text-danger">*</span>
            </label>
            <input type="number" id="field-purchase_price" v-model="edit_variation.purchase_price"
                   class="form-control red_bg_white_text text-right"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.purchase_price.$error }"
                   :placeholder="edit_variation.purchase_price"/>

            <div v-if="submitted && !$v.edit_variation.purchase_price.required" class="invalid-feedback">This value is
              required.
            </div>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-8 offset-4">
          <button type="submit" class="btn btn-primary">登録</button>
        </div>
      </div>
    </form>

  </b-modal>

</template>
<style scoped>
.red_bg_white_text{
  background-color: #dc3545;
  color:white;
}
</style>
