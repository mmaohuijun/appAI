import storage from '../../api/storage'

const flow = {
  state: {
    flowId: ''
  },
  mutations: {
    SET_FLOW_ID (state, id) {
      state.flowId = id
      storage.sessionStorage.setItem('flowId', id)
    }
  },
  actions: {
    setFlowId ({ commit }) {
      return new Promise((resolve, reject) => {
        const flowId = storage.sessionStorage.getItem('flowId')
        if (flowId) {
          commit('SET_FLOW_ID', flowId)
        }
        resolve()
      })
    }
  }
}
export default flow
