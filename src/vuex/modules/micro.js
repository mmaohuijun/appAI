import $Storage from '../../api/storage.js'
const micro = {
  state: {
    microId: ''
  },
  mutations: {
    SET_MICRO_ID (state, id) {
      state.microId = id
      $Storage.sessionStorage.setItem('microId', id)
    }
  },
  actions: {
    setMicroId ({ commit }) {
      return new Promise((resolve, reject) => {
        let microId = $Storage.sessionStorage.getItem('microId')
        if (microId) {
          commit('SET_MICRO_ID', microId)
        }
        resolve()
      })
    }
  }
}
export default micro
