// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { router } from './router'
import lodash from 'lodash'
import jquery from 'jquery'
import iView from 'iview'
import $axios from './api/api.js'
import 'iview/dist/styles/iview.css'

Vue.use(iView, lodash, jquery, $axios)
Object.defineProperty(Vue.prototype, '_', {value: 'lodash'})
Object.defineProperty(Vue.prototype, '$', {value: 'jquery'})
Object.defineProperty(Vue.prototype, '$axios', {value: '$axios'})
// console.log('axios', $axios.get())

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
