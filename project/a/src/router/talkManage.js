const privateLetter = r => require.ensure([], () => r(require('view/talkManage/privateLetter')), 'privateLetter') // 入驻申请
const userList = r => require.ensure([], () => r(require('view/talkManage/userList')), 'userList')
export default [

  { // 用户列表
    meta: {
      title: '用户列表',
      unCommon: true, // 使用头部以及左侧菜单
      requiresAuth: true // 页面是否需要登录
    },
    path: '/userList',
    name: 'userList',
    component: userList
  },
  { // 私信管理
    meta: {
      title: '私信管理',
      requiresAuth: true,
      unCommon: true // 使用头部以及左侧菜单
    },
    path: '/privateLetter',
    name: 'privateLetter',
    component: privateLetter
  }
]
