import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import Components from '@/components'

import * as directives from '@/directives'

import '@/icons' // icon
import '@/permission' // permission control
import * as filters from '@/filters'
import CheckPermission from '@/mixin/checkPermission'

import i18n from '@/lang'

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// the second param is locale, now dynamically change locale value can get different language
// i18n will find different language based on current locale attribute
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

Vue.use(Components)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.mixin(CheckPermission)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
