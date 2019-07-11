// import store from 'store/'
import home from './home'
import loginManage from './loginManage'
import talkManage from './talkManage'
import accountManage from './accountManage'
import login from './login'
import NProgress from 'nprogress'
// import { is_android, is_iphone, delSessionStorage } from 'lib/until'
// import { delSessionStorage } from 'lib/until'
import { tracker } from 'lib/analytics'
import error_404 from '@/view/error_404/error_404'
let AllRoutes = [
  ...home,
  ...loginManage,
  ...talkManage,
  ...accountManage,
  ...login
]
let routes = [
  ...AllRoutes,
  {
    path: "/",
    redirect: '/login'
  },
  {
    path: '/404',
    name: 'error_404',
    component: error_404,
    meta: {
      unCommon: true // 使用头部以及左侧菜单
    }
  }
]
// 建立合法路由索引
let AllRouteObj = {}
AllRoutes.forEach((item) => {
  if (!AllRouteObj[item.path]) {
    AllRouteObj[item.path] = item.path
  }
})
export const beforeEach = (to, from, next) => {
  NProgress.start()
  // 校验404
  let path = to.path
  if (path === '/404') {
    next()
  } else {
    // 校验路由是否合法
    if (AllRouteObj[path]) {
      next()
    } else {
      NProgress.done()
      next({ path: '/404', replace: true })
    }
  }
  // 添加标签页title
  if (to.meta.title) {
    document.title = '陌玩陪聊系统-' + to.meta.title
  }
  // 路由权限校验
  if ((to.path === '/' || to.path === '/login')) {
    // 删除cookie和本地存储
    // delSessionStorage()
    localStorage.clear()
    next()
  } else {
    if (to.matched.some(record => record.meta.requiresAuth) && !tracker.getToken()) {
      // 无token
      console.log(tracker.getToken())
      NProgress.done()
      // next('/login')
    } else {
      next()
    }
  }
}
export const afterEach = route => {
  NProgress.done()
}
export default routes
