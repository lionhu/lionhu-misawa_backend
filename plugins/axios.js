export let axios;

export default function ({$axios, store, redirect, $auth, app}, inject) {
  $axios.onRequest(request => {
    let last_access_time = store.state.authfack.lastAccessTime;
    let new_access_time = new Date().getTime();

    if (last_access_time === null || new_access_time - last_access_time > 300 * 1000) {
      $auth.logout()
      // redirect("/account/login")
    } else {
      let loggedIn = $auth.loggedIn;
      let token_valid = $auth.strategy.token.status().valid()
      let refreshToken_valid = $auth.strategy.refreshToken.status().valid()

      console.log('[ onRequest ]', request)

      if (loggedIn && !token_valid && !refreshToken_valid) {
        $auth.logout()
        // redirect("/account/login")
      } else {
        return request;
      }
    }
  })
  $axios.onResponse(response => {

    let new_access_time = new Date().getTime();
    store.commit("authfack/setAccessTime", new_access_time)
    console.log('[ RESPONSE ]' + response.request.responseURL, response)
    if (response.status === 204) {
      response.data = {result: true, status: response.status};
    }
    return response
  });

  $axios.onError(error => {
    // console.log("$axios.onError",error.response.status)
    console.log(error.response.data)
    error.response.data.result = false;
    return Promise.reject(error)
  });

  axios = $axios;
  inject("axios", axios)
}
