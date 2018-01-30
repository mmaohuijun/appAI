import $Storage from '../../api/storage.js'
import _ from 'lodash'
const sideBarMenuMap = {
  Apps: {
    title: '模型管理',
    name: 'Apps',
    children: [
      { title: '应用', name: 'Application' },
      { title: '场景', name: 'Intents' },
      { title: '词库', name: 'Entities' },
      { title: '模型', name: 'Module' }
    ]
  },
  Auth: {
    title: '权限管理',
    name: 'Auth',
    children: [
      { title: '用户权限', name: 'UserAuth' },
      { title: '主题权限', name: 'ThemeAuth' },
      { title: '密级权限', name: 'SecurityAuth' },
      { title: '角色权限', name: 'RoleAuth' },
      { title: '组权限', name: 'TeamAuth' }
    ]
  },
  fragmentation: {
    title: '碎片化平台',
    name: 'Fragment',
    chldren: [
      { title: '碎片化', name: 'Application' }
    ]
  },
  micro_services: {
    title: '微服务管理',
    name: 'micro',
    chldren: [
      { title: '微服务', name: 'Application' }
    ]
  },
  flow: {
    title: '流程管理',
    name: 'flow',
    chldren: [
      { title: '流程', name: 'Application' }
    ]
  },
  information: {
    title: '数据安全管理',
    name: 'information',
    chldren: [
      { title: '数据安全', name: 'Application' }
    ]
  }
}

const settings = {
  state: {
    hasLogin: false,
    username: '', // 用户id
    firstRoute: '',
    auth: [],
    token: '',
    sideBarMenu: [],
    sideBarMenuMap
  },
  mutations: {
    SET_USER_INFO (state, json) {
      state.auth = json.auth
      state.token = json.token
      state.username = json.username
    },
    TOGGLE_LOGIN_STATUS (state, flag) {
      state.hasLogin = flag
    },
    SET_FIRST_ROUTE (state, route) {
      state.firstRoute = sideBarMenuMap[route].children[0].name
    },
    SET_SIDEBAR_MENU (state, menu) {
      state.sideBarMenu = menu
    }
  },
  actions: {
    setUserInfo ({ commit, dispatch }, json) {
      dispatch('clearUserInfo')
      commit('SET_USER_INFO', json)
      $Storage.sessionStorage.setItem('userInfo', json)
    },
    getUserInfoFromStorage ({ commit }) {
      return new Promise(resolve => {
        const info = $Storage.sessionStorage.getItem('userInfo')
        if (!info) return
        commit('SET_USER_INFO', info)
        resolve()
      })
    },
    clearUserInfo () {
      $Storage.sessionStorage.removeItem('userInfo')
    },
    toggleLoginStatus ({ commit }, flag) {
      commit('TOGGLE_LOGIN_STATUS', flag)
    },
    setFirstRoute ({ commit }, route) {
      commit('SET_FIRST_ROUTE', route)
    },
    setSideBarMenu ({ commit, getters, state }) {
      const menu = []
      _.each(getters.auth, key => {
        menu.push(sideBarMenuMap[key])
      })
      commit('SET_SIDEBAR_MENU', menu)
    }
  }
}
export default settings
