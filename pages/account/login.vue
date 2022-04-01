<script>
import {
  required,
  email
} from "vuelidate/lib/validators";
import {swalService} from "~/helpers/swal.service"
import {APIServices} from "../../../front_app/helpers/APIs";

export default {
  name: "auth_login",
  data() {
    return {
      email: "",
      password: "",
      entry_role: "client",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    notificationAutoCloseDuration() {
      return this.$store && this.$store.state.notification ? 5 : 0;
    },
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    },
    entry_role: {
      required
    },
  },
  mounted() {
    // console.log(this.$config.lionhu_USE_HTTPS)
    // console.log(this.$config.lionhu_baseURL)
  },
  methods: {
    async tryToLogIn() {
      let self = this;
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      let data = {
        "site": "backend",
        "email": this.email,
        "password": this.password,
        "entry_role": this.entry_role,
      }

      if (this.email && this.password) {
        try {
          this.$nuxt.$loading.start();
          await this.$auth.loginWith('local', {data: data})
            .then(res => {
              // console.log(res)
              self.$store.commit("authfack/set_user", {
                "user": self.$auth.user,
                "entry_role": self.entry_role
              })
              if (self.$auth.user.pk > 0) {
                self.$nuxt.$loading.finish();
                self.$router.push(self.$route.query.redirectFrom || {path: `/${self.entry_role}/`});
              }
            })
        } catch (err) {
          console.log("login error", err.response)
          self.$nuxt.$loading.finish();
          swalService.showToast("error", "ログイン情報は間違いました。")
        }
      }
    },
  },
  layout: 'auth'
}
</script>

<template>
  <div>
    <!-- Logo -->
    <div class="auth-brand text-center text-lg-left">
      <div class="auth-logo">
        <nuxt-link to="/" class="logo logo-dark text-center">
                <span class="logo-lg">
                    <img src="/images/logo/misawa_logo_green.png" alt height="60"/>
                </span>
        </nuxt-link>

        <nuxt-link to="/" class="logo logo-light text-center">
                <span class="logo-lg">
                    <img src="/images/logo/misawa_logo_green.png" alt height="60"/>
                </span>
        </nuxt-link>
      </div>
    </div>
    <!-- title-->
    <h4 class="mt-0">Sign In</h4>
    <!-- form -->
    <form>
      <b-alert :variant="notification.type" class="mt-3" v-if="notification.message"
               :show="notificationAutoCloseDuration" dismissible>{{ notification.message }}
      </b-alert>

      <b-alert variant="danger" class="mt-3" v-model="isAuthError" :show="notificationAutoCloseDuration"
               dismissible>{{ authError }}
      </b-alert>
      <div class="form-group mb-3">
        <label for="emailaddress">{{ $t('auth.email') }}</label>
        <input class="form-control" v-model="email" type="email" id="emailaddress"
               placeholder="Enter your email" :class="{ 'is-invalid': submitted && $v.email.$error }">
        <div v-if="submitted && $v.email.$error" class="invalid-feedback">
          <span v-if="!$v.email.required">Email is required.</span>
          <span v-if="!$v.email.email">Please enter valid email.</span>
        </div>
      </div>


      <div class="form-group mb-3">
        <label for="password">{{ $t('auth.password') }}</label>
        <div class="input-group input-group-merge">
          <input v-model="password" type="password" id="password" class="form-control"
                 placeholder="Enter your password" :class="{ 'is-invalid': submitted && $v.password.$error }">
          <div v-if="submitted && !$v.password.required" class="invalid-feedback">Password is required.</div>
        </div>
      </div>

      <div class="form-group mb-3">
<!--        <label for="entry_role">entry_role</label>-->
        <div class="input-group input-group-merge">
          <select id="entry_role" class="custom-select" v-model="entry_role">
            <option selected value="client">営業代理</option>
            <option value="supplier">サプライヤー</option>
            <option value="staff">スタッフ</option>
            <option value="superadmin">管理者</option>
          </select>
        </div>
      </div>
      <div class="form-group mb-0 text-center">
        <a href="javascript:void(0);" class="btn btn-primary btn-block" @click="tryToLogIn"> {{ $t('auth.login') }} </a>
      </div>

    </form>

  </div>

  <!-- end row -->
</template>
