// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { router } from './router'
import lodash from 'lodash'
import jquery from 'jquery'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView, lodash, jquery)
Object.defineProperty(Vue.prototype, 'iView', {value: 'iView'})
Object.defineProperty(Vue.prototype, 'lodash', {value: 'lodash'})
Object.defineProperty(Vue.prototype, 'jquery', {value: 'jquery'})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
