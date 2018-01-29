import $Storage from '../../api/storage.js'
const apps = {
  state: {
    appId: '', // 选择的应用id
    appName: '', // 选中的应用 名称
    intentId: '', // 选中的场景 id
    entityId: '' // 选中的词库 id
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
    }
  },
  actions: {
    setAppId ({ commit, dispatch }, id) {
      dispatch('clearAppId')
      commit('SET_APPID', id)
      $Storage.sessionStorage.setItem('appId', id)
      console.log('setAppId', $Storage.sessionStorage.getItem('appId'))
    },
    getAppIdFromStorage ({ commit }) {
      return new Promise((resolve, reject) => {
        const appId = $Storage.sessionStorage.getItem('appId')
        if (appId) {
          commit('SET_APPID', appId)
        }
        resolve()
      })
    },
    setAppName ({ commit, dispatch }, name) {
      dispatch('clearAppName')
      commit('SET_APPNAME', name)
      $Storage.sessionStorage.setItem('appName', name)
    },
    getAppName () {
      return new Promise((resolve, reject) => {
        const appName = $Storage.sessionStorage.appName
        if (appName) {
          resolve(appName)
        }
      })
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
    }
  }
}
export default apps
