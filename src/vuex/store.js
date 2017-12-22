import Vue from 'vue'
import Vuex from 'vuex'

import $Storage from '../api/storage'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    appId: '', // 选择的应用id
    appName: '', // 选中的应用 名称
    hasIntents: false // 是否有场景
  },
  getters: {
    getAppId: () => {
      return $Storage.sessionStorage.getItem('appId')
    },
    getAppName: () => {
      return $Storage.sessionStorage.getItem('appName')
    }
  },
  mutations: {
    SET_APPID (state, id) {
      state.appId = id
    },
    SET_APPNAME (state, name) {
      state.appName = name
    },
    HAS_INTENTS (state) {
      state.hasIntents = true
      // $Storage.sessionStorage.setItem('hasIntents', true)
    }
  },
  actions: {
    setAppId ({ commit, dispatch }, id) {
      dispatch('clearAppId')
      commit('SET_APPID', id)
      $Storage.sessionStorage.setItem('appId', id)
    },
    setAppName ({ commit }, name) {
      commit('SET_APPNAME', name)
      $Storage.sessionStorage.setItem('appName', name)
    },
    clearAppId () {
      $Storage.sessionStorage.removeItem('appId')
    },
    hasIntents ({ commit }) {
      commit('HAS_INTENTS')
    }
  }
})

export default store
