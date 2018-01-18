import Vue from 'vue'
import Vuex from 'vuex'

import $Storage from '../api/storage'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    userName: '', // 用户id
    appId: '', // 选择的应用id
    appName: '', // 选中的应用 名称
    intentId: '', // 选中的场景 id
    entityId: '', // 选中的词库 id
    userAuthId: '', // 选中用户权限id
    teamAuthId: '' // 组权限  id
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
    }
  }
})

export default store
