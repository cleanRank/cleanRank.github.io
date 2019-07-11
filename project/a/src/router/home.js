const home = r => require.ensure([], () => r(require('view/home')), 'home') // 首页
export default [
  // 首页
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
      isOpen: 1,
      requiresAuth: true,
      unCommon: true // 使用头部以及左侧菜单
    },
    component: home
  }
]
