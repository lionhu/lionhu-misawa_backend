<script>
import Swal from 'sweetalert2'
import {swalService} from "~/helpers/swal.service"
import {axios} from "@/plugins/axios";
import {mapGetters} from "vuex"

export default {
  name: "clients",
  head() {
    return {
      title: `${this.title} | Admin Dashboard`,
      script: [
        {src: 'https://unpkg.com/element-ui/lib/index.js'}
      ],
      link: [
        {rel: 'stylesheet', href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'}
      ]
    };
  },
  components: {
    "el-table": () => import('element-ui/lib/table'),
    "el-table-column": () => import('element-ui/lib/table-column'),
    "Client_PointPolicy": () => import("../components/PointPolicyModal")
  },
  data() {
    return {
      title: "users",
      items: [
        {
          text: "PINGO"
        },
        {
          text: "eCommerce"
        },
        {
          text: "代理店",
          active: true
        }
      ],
      multipleSelection: [],
      mode: "edit",
      client: {
        "name": "",
        "description": "",
      },
      showEditClientPointPolicyModal: false,
      edit_client: {},
      page: 1,
      page_size: 10,
      total: 0,
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      clients: "clients/getterClientList",
      clients_meta: "clients/getterClientListMeta",
    }),
    list_filter_options() {
      return `?page_size=${this.page_size}&page=${this.page}&expand=admin,client_superadmin`
    }
  },
  watch: {
    clients_meta(newVal, oldVal) {
      this.page = newVal.page;
      this.page_size = newVal.page_size;
      this.total = newVal.total;
    }
  },
  mounted() {
    this.load_data();
  },
  methods: {
    async load_data() {
      this.isLoading = true;
      await this.$store.dispatch("clients/load_superadmin_clients", this.list_filter_options)
      this.isLoading = false;
    },
    tablePageChange(page) {
      this.page = page;
      this.load_data();
    },
    remove_client(client_id) {
      let vm = this;
      if (client_id) {
        Swal.fire({
          title: '删除代理商？',
          html: `代理商ID： ${client_id}`,
          showCancelButton: true,
          confirmButtonText: '削除!',
          showLoaderOnConfirm: true,
          preConfirm: (login) => {
            return vm.$store.dispatch("clients/remove_client", client_id).then((response) => {
                return response
              }).catch((error) => {
                if (error.status === 404) {
                  Swal.showValidationMessage(
                    `Request failed: ${error.data.message}`
                  )
                }
              })
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
             swalService.showToast("success", "Remove Client successfully!")
          }
        })

      }
    },
    async show_edit_client(client) {
      let vm = this;
      const {value: formValues} = await Swal.fire({
        title: 'Create',
        html:
          `<span>Client Name:</span><input id="swal-input1" placeholder="name" class="swal2-input" value="${client.name}">` +
          `<span>Description:</span><input id="swal-input2" placeholder="description" class="swal2-input"  value="${client.description}">`+
          `<span>RATE :</span><input id="swal-input3" placeholder="client_rate" class="swal2-input"  value="${client.client_rate}">`,
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: `Save`,
        preConfirm: (result) => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').value,
          ]
        }
      })

      if (formValues !== undefined && formValues[0] !== "" && formValues[1] !== "") {
        let client_id = client.id;
        vm.client.name = formValues[0];
        vm.client.description = formValues[1];
        vm.client.client_rate = formValues[2];
        delete vm.client.id;
        Swal.fire({
          title: '修改代理商信息？',
          html: `代理商ID： ${client_id}`,
          showCancelButton: true,
          confirmButtonText: '修改!',
          showLoaderOnConfirm: true,
          preConfirm: (login) => {
            return vm.$store.dispatch("clients/update_client", {client_id: client_id, info: vm.client})
              .then((response) => {
                return response
              }).catch((error) => {
                if (error.status === 404) {
                  Swal.showValidationMessage(
                    `Request failed: ${error.data.message}`
                  )
                }
              })
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
             Swal.fire("Success", "client information has been update!", "success")
          }
        })

      }
    },
    show_pointpolicy_client(client) {
      if (client) {
        this.edit_client = client;
        this.showEditClientPointPolicyModal = true;
      }
    },
    async show_add_client() {
      let vm = this;
      const {value: formValues} = await Swal.fire({
        title: '代理店登録',
        html:
          '<span>代理店名:</span><input id="swal-input1" placeholder="name" class="swal2-input">' +
          '<span>説明:</span><input id="swal-input2" placeholder="description" class="swal2-input">' +
          '<span>Client_Superadmin ID:</span><input id="swal-input3" value="2" placeholder="client_superadmin_id" class="swal2-input">' +
          '<span>Client_Admin ID:</span><input id="swal-input4" placeholder="admin_id" class="swal2-input">' +
          '<span>Client RATE:</span><input id="swal-input5" placeholder="rate" class="swal2-input">',
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: `Save`,
        preConfirm: (result) => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').value,
            document.getElementById('swal-input4').value,
            document.getElementById('swal-input5').value,
          ]
        }
      })

      if (formValues !== undefined && formValues[0] !== "" && formValues[1] !== "") {
        vm.client.name = formValues[0];
        vm.client.description = formValues[1];
        vm.client.client_superadmin = parseInt(formValues[2]);
        vm.client.admin = parseInt(formValues[3]);
        vm.client.client_rate = parseInt(formValues[4]);
        Swal.fire({
          title: '增加新代理商',
          html: JSON.stringify(vm.client),
          showCancelButton: true,
          confirmButtonText: '确认',
          showLoaderOnConfirm: true,
          preConfirm: (login) => {
            return vm.$store.dispatch("clients/register_client", vm.client)
              .then((response) => {
                return response
              }).catch((error) => {
                if (error.status === 404) {
                  Swal.showValidationMessage(
                    `Request failed: ${error.data.message}`
                  )
                }
              })
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            swalService.showToast("success", "代理店は追加されました!")
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    ProcessClientPointPolicy(result) {
      if (result) {
        swalService.showToast("success", "client information has been update!")
      } else {
        swalService.showToast("error", "Failed to updated client information")
      }
      this.showEditClientPointPolicyModal = false;
    }
  },
  middleware: ['router-auth', 'router-superadmin'],
};
</script>

<template>
  <div>
    <PageHeader title="代理店管理" :items="items"/>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-6">
                <a href="javascript:void(0)" @click="show_add_client" class="btn btn-danger mb-2"><i
                  class="mdi mdi-plus-circle mr-1"></i>代理店追加
                </a>
              </div>
              <div class="col-sm-6 text-right">
                <b-spinner variant="danger" v-if="isLoading"></b-spinner>&nbsp;
              </div>
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">

              <div class="row my-2" v-if="total">
                <div class="col">
                  <div class="dataTables_paginate paging_simple_numbers float-right">
                    <ul class="pagination pagination-rounded">
                      <b-pagination v-model="page"
                                    pills
                                    aria-controls="pingoproduct_table"
                                    :total-rows="total"
                                    :per-page="page_size"
                                    @change="tablePageChange"
                      >
                      </b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
              <el-table
                ref="multipleTable"
                :data="clients"
                tooltip-effect="dark"
                :default-sort="{prop: 'followers', order: 'descending'}"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="名前"
                  width="160">
                </el-table-column>
                <el-table-column
                  width="200"
                  label="営業代行/代理店">
                  <template slot-scope="scope">
                    <span v-if="scope.row.admin">{{ scope.row.admin.username }}(#{{ scope.row.admin.pk }})</span> <br>
                    <span v-if="scope.row.client_superadmin">{{
                        scope.row.client_superadmin.username
                      }}(#{{ scope.row.client_superadmin.pk }})</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="client_rate"
                  sortable
                  width="100"
                  label="RATE">
                  <template slot-scope="scope">
                    <span>{{ scope.row.client_rate }}%</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="followers"
                  sortable
                  label="フロアー">
                  <template slot-scope="scope">
                    <span>{{ scope.row.followers }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <ul class="list-inline table-action m-0">
                      <li class="list-inline-item" v-if="scope.row.id!==1">
                        <a href="javascript:void(0);" class="action-icon" @click="show_edit_client(scope.row)">
                          <i class="fe-edit-1"></i></a>
                      </li>
<!--                      <li class="list-inline-item">-->
<!--                        <a href="javascript:void(0);" v-b-modal:modal_client_pointpolicy class="action-icon"-->
<!--                           @click="show_pointpolicy_client(scope.row)">-->
<!--                          <i class="ri-coin-fill text-warning"></i></a>-->
<!--                      </li>-->
                      <li class="list-inline-item" v-if="scope.row.id!==1">
                        <a href="javascript:void(0);" class="action-icon" @click="remove_client(scope.row.id)">
                          <i class="fe-trash-2 text-danger"></i></a>
                      </li>
                    </ul>
                  </template>
                </el-table-column>
              </el-table>
              <div class="row my-2" v-if="total">
                <div class="col">
                  <div class="dataTables_paginate paging_simple_numbers float-right">
                    <ul class="pagination pagination-rounded">
                      <b-pagination v-model="page"
                                    pills
                                    aria-controls="pingoproduct_table"
                                    :total-rows="total"
                                    :per-page="page_size"
                                    @change="tablePageChange"
                      >
                      </b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Client_PointPolicy @result="ProcessClientPointPolicy" :client="edit_client"
                        :showEditClientPointPolicyModal="showEditClientPointPolicyModal"/>
  </div>
</template>
