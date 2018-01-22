import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

import $Storage from '../api/storage'

Vue.use(Vuex)

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
const store = new Vuex.Store({
  // 定义状态
  state: {
    userName: '', // 用户id
    appId: '', // 选择的应用id
    appName: '', // 选中的应用 名称
    intentId: '', // 选中的场景 id
    entityId: '', // 选中的词库 id
    userAuthId: '', // 选中用户权限id
    teamAuthId: '', // 组权限  id
    roleAuthId: '', // 角色权限id
    waitList: [], // 角色权限 待选用户列表
    sideBarMenu: [],
    sideBarMenuMap,
    keySideBarMenuMap: {}
  },
  getters: {
    getAppId: () => {
      return $Storage.sessionStorage.getItem('appId')
    },
    getIntentId: () => {
      return $Storage.sessionStorage.getItem('intentId')
    },
    getEntityId: () => {
      return $Storage.sessionStorage.getItem('entityId')
    },
    getAppName: () => {
      return $Storage.sessionStorage.getItem('appName')
    },
    getUserName: () => {
      return $Storage.localStorage.getItem('userName')
    },
    getUserAuthId: () => {
      return $Storage.sessionStorage.getItem('userAuthId')
    },
    getRoleAuthId: () => {
      return $Storage.sessionStorage.getItem('roleAuthId')
    },
    getSideBarMenu: () => {
      return $Storage.localStorage.getItem('sideBarMenu')
    }
  },
  mutations: {
    SET_APPID (state, id) {
      state.appId = id
    },
    SET_APPNAME (state, name) {
      state.appName = name
    },
    SET_INTENTID (state, id) {
      state.intentId = id
    },
    SET_ENTITYID (state, id) {
      state.entityId = id
    },
    SET_USERNAME (state, name) {
      state.userName = name
    },
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
    },
    SET_AUTH (state, auth) {
      state.sideBarMenu = auth
      $Storage.localStorage.setItem('sideBarMenu', auth)
    },
    SET_SIDEBAR (state, menu) {
      state.keySideBarMenuMap = menu
    }
  },
  actions: {
    setAppId ({ commit, dispatch }, id) {
      dispatch('clearAppId')
      commit('SET_APPID', id)
      $Storage.sessionStorage.setItem('appId', id)
    },
    setAppName ({ commit, dispatch }, name) {
      dispatch('clearAppName')
      commit('SET_APPNAME', name)
      $Storage.sessionStorage.setItem('appName', name)
    },
    setIntentId ({ commit, dispatch }, id) {
      commit('SET_INTENTID', id)
      $Storage.sessionStorage.setItem('intentId', id)
    },
    setEntityId ({ commit }, id) {
      commit('SET_ENTITYID', id)
      $Storage.sessionStorage.setItem('entityId', id)
    },
    clearAppId () {
      $Storage.sessionStorage.removeItem('appId')
    },
    clearAppName () {
      $Storage.sessionStorage.removeItem('appName')
    },
    setUserName ({ dispatch, commit }, name) {
      dispatch('clearUserName')
      commit('SET_USERNAME', name)
      $Storage.localStorage.setItem('userName', name)
    },
    clearUserName () {
      $Storage.localStorage.removeItem('userName')
    },
    setUserAuthId ({ commit }, id) {
      commit('SET_USERAUTHID', id)
      $Storage.sessionStorage.setItem('userAuthId', id)
    },
    clearUserAuthId () {
      $Storage.sessionStorage.removeItem('userAuthId')
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
})

export default store
