<script>
import {mapState} from "vuex";
import {axios} from "@/plugins/axios";

export default {
  name: "edit_product_variation",
  props: ["showVariationModal", "modeAdd", "edit_variation", "product_id"],
  components: {
    Switches: () => import('vue-switches'),
  },
  data() {
    return {
      submitted: false
    };
  },
  computed: {
    ...mapState({
      categories: state => state.system.categories,
    }),
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
      return parseInt(this.edit_variation.price) - parseInt(this.edit_variation.purchase_price) - this.introduction_point_total - special_promotion_bonus;
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
      this.edit_variation.product = this.product_id;
      this.edit_variation.price = parseInt(this.edit_variation.price);
      this.edit_variation.purchase_price = parseInt(this.edit_variation.purchase_price);
      this.edit_variation.sort_by = parseInt(this.edit_variation.sort_by);
      this.edit_variation.point_rule.policies.client_admin = parseInt(this.edit_variation.point_rule.policies.client_admin);
      this.edit_variation.point_rule.policies.client_superadmin = parseInt(this.edit_variation.point_rule.policies.client_superadmin);
      this.edit_variation.point_rule.policies.level_1 = parseInt(this.edit_variation.point_rule.policies.level_1);
      this.edit_variation.point_rule.policies.level_2 = parseInt(this.edit_variation.point_rule.policies.level_2);
      this.edit_variation.point_rule.policies.user_self = parseInt(this.edit_variation.point_rule.policies.user_self);
      this.edit_variation.point_rule.special_promotion.bonus = parseInt(this.edit_variation.point_rule.special_promotion.bonus);

      if (!this.modeAdd) {
        let variation_id=this.edit_variation.id;
        delete this.edit_variation.image;
        this.$store.dispatch("products/update_variation",
          {variation_id:variation_id,info:this.edit_variation})
          .then((response) => {
              var variation_server = response.variation;
              vm.$emit("operateresult", {"modeAdd": false, "_variation": variation_server, variation_id:variation_id})
          })
      } else {
        this.$store.dispatch("products/create_variation", this.edit_variation)
          .then((response) => {
              var variation_server = response.variation;
              vm.$emit("operateresult", {"modeAdd": true, "_variation": variation_server})
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
      <!--      <div class="row mt-md-2">-->

      <!--        <div class="col-md-4">-->
      <!--          <label class="mb-2">Type<span class="text-danger">*</span></label>-->
      <!--        </div>-->
      <!--        <div class="col-md-4">-->
      <!--          <div class="form-group">-->
      <!--            <div class="radio form-check-inline ml-md-2">-->
      <!--              <input type="radio" v-model="edit_variation.variation_type" id="variation_type_Radio1" value="REGULAR"-->
      <!--                     name="radioInline" checked/>-->
      <!--              <label for="variation_type_Radio1">REGULAR</label>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="col-md-4">-->
      <!--          <div class="form-group">-->
      <!--            <div class="radio form-check-inline">-->
      <!--              <input type="radio" v-model="edit_variation.variation_type" id="variation_type_Radio2" value="PINGO"-->
      <!--                     name="radioInline"/>-->
      <!--              <label for="variation_type_Radio2">PINGO</label>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="row mt-md-2">
        <div class="col-md-6">
          <div class="form-group">
            <label for="field-is_valid" class="control-label">Active
              <span class="text-danger">*</span>
            </label> <br>

            <switches v-model="edit_variation.point_rule.is_valid" id="field-is_valid" type-bold="false"
                      color="warning"
                      class="ml-1 my-auto"></switches>
          </div>
        </div>
      </div>
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
              Sort ID:
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
            <label for="field-item_name" class="control-label">Name
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
            <label for="field-description" class="control-label">Description<span class="text-danger">*</span></label>
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
        <div class="col-md-6">
          <div class="form-group">
            <label for="field-inventory" class="control-label">Inventory
              <span class="text-danger">*</span>
            </label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <input type="number" id="field-inventory" v-model="edit_variation.inventory" class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.price.$error }"
                   :placeholder="edit_variation.inventory"/>

            <div v-if="submitted && !$v.edit_variation.inventory.required" class="invalid-feedback">This value is
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
            <label for="field-price" class="control-label">仕入価格
              <span class="text-danger">*</span>
            </label>
            <input type="number" id="field-purchase_price" v-model="edit_variation.purchase_price"
                   class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.purchase_price.$error }"
                   :placeholder="edit_variation.purchase_price"/>

            <div v-if="submitted && !$v.edit_variation.purchase_price.required" class="invalid-feedback">This value is
              required.
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label for="field-price" class="control-label">粗利
            </label> <br>

            <b-button class="btn-rounded ml-1" variant="danger">{{ profit|currency("¥") }}</b-button>
          </div>
        </div>
      </div>
      <h4>紹介ポイント</h4>
      <div class="row">
        <div class="col-md-4">
          <div class="form-group">
            <label for="field-client_admin"
                   class="control-label">{{ $t("menuitems.organizations.user.client_superadmin") }}
              <span class="text-danger">*</span>
            </label>
            <input type="number" id="field-client_superadmin"
                   v-model="edit_variation.point_rule.policies.client_superadmin"
                   class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.point_rule.policies.client_superadmin.$error }"
                   :placeholder="edit_variation.point_rule.policies.client_superadmin"/>

            <div v-if="submitted && !$v.edit_variation.point_rule.policies.client_superadmin.required"
                 class="invalid-feedback">This value is required.
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label for="field-client_admin"
                   class="control-label">{{ $t("menuitems.organizations.user.client_admin") }}
              <span class="text-danger">*</span>
            </label>
            <input type="number" id="field-client_admin" v-model="edit_variation.point_rule.policies.client_admin"
                   class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.point_rule.policies.client_admin.$error }"
                   :placeholder="edit_variation.point_rule.policies.client_admin"/>

            <div v-if="submitted && !$v.edit_variation.point_rule.policies.client_admin.required"
                 class="invalid-feedback">This value is required.
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label for="field-price" class="control-label">紹介ポイント合計
            </label>
            <b-button class="btn-rounded ml-1" variant="warning">{{ introduction_point_total|currency("¥") }}
            </b-button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="form-group">
            <label for="field-level_2" class="control-label">{{ $t("menuitems.organizations.user.level_2") }}
              <span class="text-danger">*</span>
            </label>
            <input type="number" id="field-level_2" v-model="edit_variation.point_rule.policies.level_2"
                   class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.point_rule.policies.level_2.$error }"
                   :placeholder="edit_variation.point_rule.policies.level_2"/>

            <div v-if="submitted && !$v.edit_variation.point_rule.policies.level_2.required" class="invalid-feedback">
              This value is required.
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label for="field-level_1" class="control-label">{{ $t("menuitems.organizations.user.level_1") }}
              <span class="text-danger">*</span>
            </label>
            <input type="number" id="field-level_1" v-model="edit_variation.point_rule.policies.level_1"
                   class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.point_rule.policies.level_1.$error }"
                   :placeholder="edit_variation.point_rule.policies.level_1"/>

            <div v-if="submitted && !$v.edit_variation.point_rule.policies.level_1.required" class="invalid-feedback">
              This value is required.
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label for="field-user_self" class="control-label">{{ $t("menuitems.organizations.user.user_self") }}
              <span class="text-danger">*</span>
            </label>
            <input type="number" id="field-user_self" v-model="edit_variation.point_rule.policies.user_self"
                   class="form-control"
                   :class="{ 'is-invalid': submitted && $v.edit_variation.point_rule.policies.user_self.$error }"
                   :placeholder="edit_variation.point_rule.policies.user_self"/>

            <div v-if="submitted && !$v.edit_variation.point_rule.policies.user_self.required"
                 class="invalid-feedback">
              This value is required.
            </div>
          </div>
        </div>
      </div>
      <h4>アフリエイト　ポイント</h4>

      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="field-special_promotion_valid"
                   class="control-label">{{ $t("menuitems.organizations.user.client_superadmin") }}
            </label> <br>
            <switches v-model="edit_variation.point_rule.special_promotion.is_valid"
                      id="field-special_promotion_valid" type-bold="false"
                      color="warning"
                      class="ml-1 my-auto"></switches>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="field-special_promotion_bonus"
                   class="control-label">{{ $t("menuitems.organizations.user.affiliator") }}
            </label>
            <input type="number" id="field-special_promotion_bonus"
                   v-model="edit_variation.point_rule.special_promotion.bonus"
                   class="form-control"/>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-8 offset-4">
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </div>
    </form>

  </b-modal>

</template>
