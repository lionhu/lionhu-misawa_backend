<script>
export default {
    data() {
        return {

        }
    },
    layout: 'auth'
}
</script>

<template>
<div class="row justify-content-center">
    <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="card">

            <div class="card-body p-4">

                <div class="error-ghost text-center">
                    <img src="~/assets/images/error.svg" width="200" alt="error-image" />
                </div>

                <div class="text-center">
                    <h3 class="mt-4 text-uppercase font-weight-bold">Page not found </h3>
                    <p class="text-muted mb-0 mt-3" style="line-height: 20px;">ページは見つかりませんでした。</p>

                    <nuxt-link to="/" class="btn btn-primary mt-3"><i class="mdi mdi-reply mr-1"></i> ホームへ戻る</nuxt-link>
                </div>

            </div> <!-- end card-body -->
        </div>
        <!-- end card -->

    </div> <!-- end col -->
</div>
<!-- end row -->
</template>
