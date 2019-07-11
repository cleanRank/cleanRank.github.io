const loginList = r => require.ensure([], () => r(require('view/loginManage/loginList')), 'loginList') // 首页
export default [
  // 账号列表
  {
    path: '/loginList',
    name: 'loginList',
    meta: {
      title: '账号列表',
      isOpen: 1,
      requiresAuth: true,
      unCommon: true // 使用头部以及左侧菜单
    },
    component: loginList
  }
]
