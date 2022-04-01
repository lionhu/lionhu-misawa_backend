const state = {
  entry_role:"",
  user: {},
  websocket_status: false,
  lastAccessTime:null
}

const actions = {
  setAccessTime({commit},payload){
    commit("setAccessTime",payload)
  },
};

const getters = {
  ME(state, getters, rootState, rootGetters) {
    return rootState.auth.user
  },
  loggedIn(state, getters, rootState, rootGetters) {
    return rootState.auth.loggedIn
  },
  entryRole(state){
    return state.entry_role;
  },
  isStaff(state) {
    if (state.user === null) return false;
    return state.user.roles.includes("staff")
  },
  isSupplier(state, getters, rootState, rootGetters) {
    if (rootState.auth.user === null) return false;
    return rootState.auth.user.roles.includes("supplier")
  },
  getterSupplierInfo(state, getters, rootState, rootGetters) {
    return rootState.auth.user.supplier
  },
  isMember(state) {
    if (state.user === null) return false;
    return state.user.roles.includes("member")
  },
  isSuperadmin(state) {
    if (state.user === null) return false;
    return state.user.roles.includes("superadmin")
  },
  isClientAdmin(state) {
    return state.user != null ? state.user.roles.includes("client_admin") : false
  },
  isClientSuperAdmin(state, getters, rootState, rootGetters) {
    return state.user != null ? state.user.roles.includes("client_superadmin") : false
  },
};
const mutations = {
  set_user(state, {user,entry_role}) {
    state.user = user
    state.entry_role = entry_role
  },
  set_websocket_status(state, payload) {
    state.websocket_status = payload;
  },
  setAccessTime(state,payload){
    state.lastAccessTime=payload
  },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
