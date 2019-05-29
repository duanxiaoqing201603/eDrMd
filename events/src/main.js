// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'mint-ui/lib/index.js'
import './assets/js/common'
import './assets/css/common.css'
import axios from 'axios'
import layer from 'vue2-layer-mobile'

Vue.config.productionTip = false;
//http://193.168.11.186 测试环境 39.105.11.4  正式环境 59.110.163.242
axios.defaults.baseURL="http://193.168.11.186";
Vue.prototype.$axios=axios;//将vue改为vue的原型链

Vue.use(Mint);
Vue.use(layer);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
