import Vue from 'vue'
import Vuex from 'vuex'

import apps from './modules/apps'
import auth from './modules/auth'
import micro from './modules/micro'
import flow from './modules/flow'
import settings from './modules/settings'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    apps,
    auth,
    micro,
    flow,
    settings
  },
  getters
})

export default store
