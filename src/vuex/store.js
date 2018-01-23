import Vue from 'vue'
import Vuex from 'vuex'

import apps from './modules/apps'
import auth from './modules/auth'
import settings from './modules/settings'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    apps,
    auth,
    settings
  },
  getters
})

export default store
