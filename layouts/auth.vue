<script>
/**
 * Auth-2 layout
 */
export default {
  name:"layout_auth",
    mounted() {
        document.body.classList.add('auth-fluid-pages')
    }
}
</script>

<template>
<div class="auth-fluid">
    <!-- Auth fluid right content -->
    <div class="auth-fluid-right">
        <div class="auth-user-testimonial">
            <h3 class="mb-3 text-white">ミサワ薬局</h3>
            <p class="lead font-weight-normal">
              <i class="mdi mdi-format-quote-open"></i>
              ミサワ薬局は東京都において、創業昭和38年、薬と健康のプロフェッショナルとして、皆様のために日夜ご奉仕し続けております。
              <i class="mdi mdi-format-quote-close"></i>
            </p>
        </div> <!-- end auth-user-testimonial-->
    </div>
    <!-- end Auth fluid right content -->

    <!--Auth fluid left content -->
    <div class="auth-fluid-form-box">
        <div class="align-items-center d-flex h-100">
            <div class="card-body">
                <Nuxt />
            </div>
        </div>
    </div>
</div>
</template>
