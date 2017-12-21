import Vue from 'vue'
import Vuex from 'vuex'

import $Storage from '../api/storage'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    appId: '', // 选择的应用id
    hasIntents: false // 是否有场景
  },
  getters: {
    getAppId: () => {
      return $Storage.sessionStorage.getItem('appId')
    }
  },
  mutations: {
    SET_APPID (state, id) {
      state.appId = id
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
    clearAppId () {
      $Storage.sessionStorage.removeItem('appId')
    },
    hasIntents ({ commit }) {
      commit('HAS_INTENTS')
    }
  }
})

export default store
