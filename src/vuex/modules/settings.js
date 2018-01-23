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
    name: 'Fragment'
  },
  micro_services: {
    title: '微服务管理',
    name: 'micro'
  },
  flow: {
    title: '流程管理',
    name: 'flow'
  },
  information: {
    title: '数据安全管理',
    name: 'information'
  }
}

const settings = {
  state: {
    userName: '', // 用户id
    sideBarMenu: [],
    sideBarMenuMap,
    keySideBarMenuMap: {},
    firstRoute: '',
    toggleLogin: false // 是否已登录
  },
  mutations: {
    SET_USERNAME (state, name) {
      state.userName = name
    },
    SET_AUTH (state, auth) {
      state.sideBarMenu = auth
      $Storage.localStorage.setItem('sideBarMenu', auth)
    },
    SET_SIDEBAR (state, menu) {
      state.keySideBarMenuMap = menu
    },
    SET_FIRSTROUTE (state, router) {
      state.firstRoute = router
    },
    TOGGLE_LOGIN (state) {
      state.toggleLogin = !state.toggleLogin
    }
  },
  actions: {
    setUserName ({ dispatch, commit }, name) {
      dispatch('clearUserName')
      commit('SET_USERNAME', name)
      $Storage.localStorage.setItem('userName', name)
    },
    clearUserName () {
      $Storage.localStorage.removeItem('userName')
    },
    setSideBar ({ commit, getters, state }) {
      let menu = []
      let sideBarMenu = state.sideBarMenu
      _.each(sideBarMenu, key => {
        menu.push(sideBarMenuMap[key])
      })
      commit('SET_SIDEBAR', menu)
    },
    clearSideBar () {
      $Storage.localStorage.removeItem('sideBarMenu')
    }
  }
}
export default settings
