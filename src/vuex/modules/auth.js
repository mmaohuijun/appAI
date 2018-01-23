import $Storage from '../../api/storage.js'
const auth = {
  state: {
    userAuthId: '', // 选中用户权限id
    teamAuthId: '', // 组权限  id
    roleAuthId: '', // 角色权限id
    waitList: [] // 角色权限 待选用户列表
  },
  mutations: {
    SET_USERAUTHID (state, id) {
      state.userAuthId = id
    },
    SET_TEAMAUTHID (state, id) {
      state.teamAuthId = id
      $Storage.sessionStorage.setItem('teamAuthId', id)
    },
    SET_ROLEAUTHID (state, id) {
      state.roleAuthId = id
      $Storage.sessionStorage.setItem('roleAuthId', id)
    },
    SET_WAITLIST (state, arr) {
      state.waitList = arr
    }
  },
  actions: {
    setUserAuthId ({ commit }, id) {
      commit('SET_USERAUTHID', id)
      $Storage.sessionStorage.setItem('userAuthId', id)
    },
    clearUserAuthId () {
      $Storage.sessionStorage.removeItem('userAuthId')
    }
  }
}
export default auth
