import Vue from 'vue'
import App from './App'
import MpvueRouterPatch from 'mpvue-router-patch'
// 引入store
import store from './store/'
import http from 'config/index'
import { showToast, formatTimeAmt } from '@/utils/index'
import { timeStamp } from '@/utils/timeStamp'
// 把store挂载到全局
Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$Toast = showToast
Vue.prototype.$timeStamp = timeStamp
Vue.prototype.$formatTimeAmt = formatTimeAmt
Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
export default {
}
