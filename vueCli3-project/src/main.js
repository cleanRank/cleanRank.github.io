import Vue from 'vue'
import App from '@/App'
import VueRouter from 'vue-router'
import routes, {
  beforeEach,
  afterEach
} from './router/' // 引入路由表
import store from './store/index' // vuex 单向数据里 core
import 'lib/lrz.all.bundle'
import {
  sync
} from 'vuex-router-sync'
import loadPlugin from 'lib/loadPlugin' // loding
import dialogPlugin from 'lib/dialogPlugin'
import {
  formatTimeAmt
} from 'lib/until'
import * as filter from 'lib/filter' // 全局过滤器
import http from 'config/index'
// 初始化插件
Vue.use(VueRouter)
Vue.use(loadPlugin)
Vue.use(dialogPlugin)
Vue.prototype.$http = http
Vue.prototype.$formatTimeAmt = formatTimeAmt
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
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 只有在本地开发环境才加载vconsole 便于调试
if (process.env.NODE_ENV !== 'production') {
  require('eruda').init()
  require('../mock/mock')
}
