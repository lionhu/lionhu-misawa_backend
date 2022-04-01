<script>
import { APIServices } from '@/helpers/APIs'
import { swalService } from '@/helpers/swal.service'
import Swal from 'sweetalert2'

export default {
  name: 'SystemCache',
  data () {
    return {}
  },
  methods: {
    clear_cache () {
      Swal.fire({
        title: 'Important',
        html: 'サーバーのキャッシュを全てクリアしますか',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK!',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          return APIServices.post('backend/system/reset_redis/')
            .then(APIServices.handleResponse)
            .then((response) => {
              console.log('backend/system/reset_redis/', response)
              if (!response.result) {
                throw new Error(response.statusText)
              }
              swalService.showToast('success', 'Redis Cache Reset!')
            })
            .catch((error) => {
              Swal.showValidationMessage(`Request failed: ${error}`)
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
    }
  }
}
</script>
<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5>サーバーキャッシュ　リセット:</h5>
            <div class="row mb-2">
              <div class="col-sm-6 col-xs-12">
                <a
                  href="javascript:void(0);"
                  class="btn btn-danger mb-2"
                  @click="clear_cache"
                ><i class="mdi mdi-plus-circle mr-1" /> リセット
                </a>
                <p class="text-muted">
                  商品情報変更、注文情報の変更など、うまく反映しない場合、一旦キャッシュをクリアしたら、ほとんど反映できるようになります。
                </p>
                <p class="text-muted">
                  リセット対象：Redis, ElasticSearch Module.
                </p>
              </div>
              <div class="col-sm-6 col-xs-12">
                <div class="float-sm-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
