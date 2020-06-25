import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/css.css'
import axios from 'axios'

import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',ZkTable)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
// axios.
Vue.prototype.$axios = axios

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
