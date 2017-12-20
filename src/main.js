// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { router } from './router'
import vuex from 'vuex'
import store from './vuex/store.js'

import lodash from 'lodash'
import jquery from 'jquery'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import $axios from './api/api.js'

Vue.use(iView, lodash, jquery, vuex)
Object.defineProperty(Vue.prototype, '_', {value: lodash})
Object.defineProperty(Vue.prototype, '$', {value: jquery})
Object.defineProperty(Vue.prototype, '$axios', {value: $axios})
// console.log('axios', $axios.get())

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
