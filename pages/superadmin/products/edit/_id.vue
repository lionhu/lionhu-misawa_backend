<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {swalService} from "~/helpers/swal.service"
import {mapGetters} from "vuex";
import {APIServices} from "@/helpers/APIs";

export default {
  name: "edit_product",
  head() {
    return {
      title: `${this.title} | Pingo Admin`,
      script: [
        {src: 'https://unpkg.com/element-ui/lib/index.js'}
      ],
      link: [
        {rel: 'stylesheet', href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'}
      ]
    };
  },
  components: {
    "el-select": () => import("element-ui/lib/select"),
    "el-rate": () => import("element-ui/lib/rate"),
    "el-dialog": () => import("element-ui/lib/dialog"),
    "el-upload": () => import("element-ui/lib/upload"),
    "el-option": () => import("element-ui/lib/option"),
    "el-cascader": () => import("element-ui/lib/cascader"),
    "el-date-picker": () => import('element-ui/lib/date-picker'),
    Switches: () => import('vue-switches'),
    VariationTable: () => import('../components/VariationTable'),
    ProductImageEditor: () => import('../components/ProductImageEditor'),
    BasicProductInfo: () => import('../components/BasicProductInfo'),
    ckeditor: CKEditor.component,
  },
  data() {
    return {
      title: "商品情報",
      items: [
        {text: "PINGO",},
        {text: "eCommerce",},
        {text: "商品情報", active: true,}
      ],
      editor: ClassicEditor,
      // editorData: "<p>Contelengthnt of the editor.</p>",
      labels: [
        {value: 'NONE', label: 'None'},
        {value: 'NW', label: 'New'},
        {value: 'BS', label: 'Best Seller'}
      ],
      image: "",
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      imageUrl: "",
      submitted: false,
      product: {},
      isLoading: false
    };
  },
  mounted() {
    if (this._product_id > 0) {
      this.load_product(this._product_id)
    } else {
      window.location.href = "/backend/superadmin/products"
    }
  },
  computed: {
    ...mapGetters({
      back_server: "system/getterBackServer",
      suppliers: "suppliers/getterSupplierList",
      categories: "categories/getProductCategories",
      _product_id: "products/getterProductID",
    }),
    supplierSelectionList() {
      return this.suppliers.map(supplier => {
        return {value: supplier.id, label: supplier.name}
      })
    },
    supplier_id() {
      if (typeof (this.product.supplier) === "object" && Object.keys(this.product.supplier).includes("id")) {
        return this.product.supplier.id
      }
      return this.product.supplier
    }
  },
  methods: {
    load_product(product_id) {
      let self = this;
      this.$store.dispatch("products/load_product", product_id)
        .then(response => {
          console.log("load_product editor mount", response)
          console.log("response.item", response.item.category.id)
          self.product = response.item;
          self.product.supplier = response.item.supplier.id;
          self.product.category = response.item.category.id;
        })
    },
    item_name_changed(){
      console.log("item_name_changed")
    },
    handleCategoryChange(_val) {
      console.log("handleCategoryChange", _val)
      if (_val!==undefined && _val.length>0) {

        let index = _val.length - 1;
      console.log("index", index)
        this.product.category = _val[index]
      }
      console.log("handleCategoryChange", this.product.category)
    },
    async update_product() {
      console.log("update_product for", this.product)
      let product_id = this.product.id;
      // let category_id = this.product.category.id;
      this.product.supplier = this.supplier_id;
      delete this.product.id;
      delete this.product.image;
      delete this.product.item_sliderimages;
      delete this.product.item_variations;
      delete this.product.created_at;
      // delete this.product.category;
      // this.product.category = category_id;

      let self = this;

      self.isLoading = true;
      console.log("edit product for", this.product)
      await this.$store.dispatch("products/update_product", {
        product_id: product_id,
        info: this.product
      }).then(item => {
        self.load_product(product_id)
        swalService.showModal("Success", "Product was updated!", "success")
      })
      self.isLoading = false;
    },
    operateVariationTable(result,) {
      switch (result.command) {
        case "addVariation":
          this.AddVariation(result.variation);
          break;
        case "editVariation":
          this.ReplaceVariation(result.variation);
          break;
        case "replaceVariation":
          this.ReplaceVariation(result.variation);
          break;
        case "deleteVariation":
          this.deleteVariation(result.variation);
          break;

      }
    },
    AddVariation(_variation) {
      this.product.item_variations.unshift(_variation)
      swalService.showModal("Success", "Variation has been successfully added!", "success")
    },
    ReplaceVariation(_variation) {
      console.log(" ReplaceVariation(_variation)", _variation)
      let self = this;
      if (self.product.item_variations.length === 0) {
        self.product.item_variations.push(_variation)
      } else {
        var index = self.product.item_variations.findIndex(variation => variation.id === _variation.id)
        if (index > -1) {
          self.product.item_variations.splice(index, 1, _variation);
          swalService.showModal("Success", "Variation has been successfully updated!", "success")
        }
      }
    },
    deleteVariation(variation_id) {
      let url = `store/public/variations/${variation_id}/`
      var self = this;
      APIServices.destroy(url)
        .then(APIServices.handleResponse)
        .then((response) => {
          if (response.result) {
            var index = self.product.item_variations.findIndex(variation => variation.id === variation_id)
            if (index > -1) {
              self.product.item_variations.splice(index, 1);
            }
            swalService.showModal("Success", "Variation has been deleted successfully updated!", "success")
            self.$bvModal.hide("modal_variation")
          }
        })
    },
    CreateProductResult(info) {
      if (info.result) {
        this.product = info.product;
      }
    }
  },
  middleware: ['router-auth', 'router-superadmin'],
};
</script>

<template>
  <div>
    <PageHeader :title="title" :items="items"/>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-6">
                <h4 class="header-title">基本情報(商品ID #{{ product.id }})</h4>
                <p class="sub-header">下記の基本情報を入力してください。</p>
              </div>
            </div>
            <div>
              <div class="row">

                <div class="col-md-4">
                  <div class="form-group mb-3">
                    <label for="product-active">有効<span class="text-danger">*</span></label> <br>
                    <switches v-model="product.is_valid" id="product-active" type-bold="false"
                              color="warning"
                              class="ml-1 my-auto"></switches>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group mb-3">
                    <label for="product-sort">
                      並び順番:
                      <span class="text-danger">*</span>
                    </label>
                    <input type="number" v-model="product.sort_by" id="product-sort" class="form-control"
                           :placeholder="product.sort_by"/>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group mb-3">
                    <label for="product-rate">
                      評価
                      <span class="text-danger">*</span>
                    </label>
                    <el-rate id="product-rate" v-model="product.rate"></el-rate>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group mb-3">
                    <label for="product-category">
                      カテゴリー({{ product.category }})
                      <span class="text-danger">*</span>
                    </label>
                    <el-cascader
                      id="product-category"
                      v-model="product.category"
                      :options="categories"
                      size="medium"
                      :props="{ expandTrigger: 'hover',multiple:false,label:'title',value:'id'}"
                      @change="handleCategoryChange"></el-cascader>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group mb-3">
                    <label for="product-label">ラベル<span class="text-danger">*</span></label> <br>
                    <el-select v-model="product.labels" multiple placeholder="请选择" id="product-label">
                      <el-option
                        v-for="item in labels"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="control-label">サプライヤー<span class="text-danger">*</span></label>
                    <el-select v-model="product.supplier" placeholder="请选择">
                      <el-option
                        v-for="supplier in supplierSelectionList"
                        :key="supplier.value"
                        :label="supplier.label"
                        :value="supplier.value">
                      </el-option>
                    </el-select>


                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="product-brand" class="control-label">メーカー<span class="text-danger">*</span></label>
                    <input type="text" v-model="product.brand" id="product-brand" class="form-control"
                           :placeholder="product.brand"/>
                  </div>
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="product-name">
                  商品名
                  <span class="text-danger">*</span>
                </label>
                <input type="text" v-model="product.item_name" id="product-name" class="form-control"
                       @change="item_name_changed"/>
              </div>
              <div class="form-group mb-3">
                <label for="product-name">
                  商品名(ZH)
                  <span class="text-danger">*</span>
                  <a href="javascript:void(0);" @click="product.item_name_zh=product.item_name">Copy</a>
                </label>

                <input type="text" v-model="product.item_name_zh" id="product-name_zh" class="form-control"
                       placeholder="e.g : Apple iMac"/>
              </div>
              <div class="form-group mb-3">
                <label for="product-description">
                  商品紹介
                  <span class="text-danger">*</span>
                </label>
                <ckeditor id="product-description" v-model="product.description" :editor="editor"></ckeditor>
              </div>
              <div class="form-group mb-3">
                <label>服用方法</label>
                <ckeditor id="product-package" v-model="product.package" :editor="editor"></ckeditor>
              </div>
              <div class="form-group mt-3 float-right">
                <b-button variant="danger" v-bind:disabled="isLoading" class="btn-rounded ml-1"
                          @click="update_product">
                  <b-spinner small v-if="isLoading"></b-spinner>&nbsp;&nbsp;更新
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <ProductImageEditor :product="product"/>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <VariationTable :variations="product.item_variations" :product="product"
                        @operateTable="operateVariationTable"></VariationTable>
      </div>
    </div>
  </div>
</template>
