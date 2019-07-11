import Vue from 'vue'
import App from '@/App'
import VueRouter from 'vue-router'
import routes, { beforeEach, afterEach } from './router/' // 引入路由表
import '@babel/polyfill' // 部分es6语法兼容
import store from './store/index' // vuex 单向数据里 core
import 'lib/lrz.all.bundle'
import 'nprogress/nprogress.css'
import loadPlugin from 'lib/loadPlugin' // loding
import { sync } from 'vuex-router-sync'
import { formatTimeAmt } from 'lib/until'
import * as filter from 'lib/filter' // 全局过滤器
import http from 'config/index'
import './plugins/element.js'
import '@/assets/scss/base.scss'
require('./lib/im/webim.config.js')
let WebIM = require('./lib/im/connection.js')
// 初始化插件
Vue.use(VueRouter)
Vue.use(loadPlugin)
Vue.prototype.$http = http
Vue.prototype.$formatTimeAmt = formatTimeAmt
Vue.prototype.$pageSize = 10
// let imconn = null
// Vue.prototype.$imconn = function () {
//   if (!imconn) {
//     imconn = new WebIM.connection({
//       isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
//       https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
//       url: WebIM.config.xmppURL,
//       heartBeatWait: WebIM.config.heartBeatWait,
//       autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
//       autoReconnectInterval: WebIM.config.autoReconnectInterval,
//       apiUrl: WebIM.config.apiURL,
//       isAutoLogin: true
//     })
//   }
//   return imconn
// }
Vue.prototype.$webIM = WebIM
Vue.prototype.$imconn = new WebIM.connection({
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
  url: WebIM.config.xmppURL,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true
})
Vue.prototype.$imoption = {
  apiUrl: WebIM.config.apiURL,
  user: '',
  pwd: '',
  appKey: WebIM.config.appkey,
  success: function (re) {
    console.log('连接服务器正常')
  },
  error: function (err) {
    console.log('服务器异常')
  }
}
const router = new VueRouter({
  routes
})
sync(store, router)
router.beforeEach(beforeEach)
router.afterEach(afterEach)
// 过滤器注册
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})
/* eslint-disable no-new */
export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
