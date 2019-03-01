import store from 'store/index'
import { jointLand } from 'lib/until'
import {
  tracker
} from 'lib/analytics'

const Home = r => require.ensure([], () => r(require('view/Index')), 'Index') // 首页
let routes = [
  {
    path: "/Index",
    name: 'Index',
    component: Home,
    meta: {
      title: "首页",
      keepAlive: false,
      // requiresAuth: true,
      MainFooter: true,
      titleBtn: [{
        // btnName: '\u53d6\u6d88',
        // className: 'cancel'
      }]
    }
  }
]
export const beforeEach = (to, from, next) => {
  if (to.name != from.name && window.navigator.onLine) {
    store.commit('SHOWLOADINGFLAG', true)
  } else if (!window.navigator.onLine) {
    store.commit('UPDATETOAST', {
      msg: '网络请求失败，请检查您的网络设置'
    })
    setTimeout(function () {
      store.commit('UPDATETOAST', {
        msg: ''
      }) // 此处需要手动添加一个定时器2s以后隐藏toast
    }, 2000)
  }
  // 校验判断,需要登录的路由
  if (to.matched.some(record => record.meta.requiresAuth) && !tracker.getToken()) {
    next(false)
    jointLand()
  } else {
    next()
  }
}
export const afterEach = route => {
  store.commit('SHOWLOADINGFLAG', false)
  document.body.scrollTop = document.documentElement.scrollTop = 0
}
export default routes
