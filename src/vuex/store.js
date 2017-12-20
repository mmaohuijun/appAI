import Vue from 'vue'
import Vuex from 'vuex'

// import $storage from 'api/storage'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    APP_ID: '' // 应用id
  },
  getters: {
    getAppId: state => state.APP_ID
  },
  mutations: {
    initAppId (state, id) {
      state.APP_ID = id
    }
  }
})

export default store
