<script>
import {mapGetters} from "vuex"
import Swal from 'sweetalert2'

export default {
  name: "ModalCategory",
  components: {
    Switches: () => import('vue-switches'),
    "el-tree": () => import('element-ui/lib/tree'),
    "el-button": () => import('element-ui/lib/button')
  },
  data() {

    return {
      defaultProps: {
        label: 'title',
        children: 'children'
      },
    };
  },
  computed: {
    ...mapGetters({
      menuitems_store: "categories/getProductCategories"
    }),
  },
  mounted() {
  },
  methods: {
    NodeSelected(data, node, etc) {
      if (node.isLeaf) {
        console.log(data, node)
        this.$emit("clickNode", {data: data, node: node})
      }
    },
  }
};
</script>
<template>
  <div>
    <div class="card">
      <div class="card-body">
        <el-tree
          :data="menuitems_store"
          :accordion="true"
          highlight-current
          :props="defaultProps"
          node-key="id"
          @node-click="NodeSelected"
          :expand-on-click-node="true">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>
