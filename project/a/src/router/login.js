const login = r => require.ensure([], () => r(require('view/login/login')), 'login') // 登录
export default [{
  meta: {
    title: '登录',
    MainFooter: false,
    unCommon: false // 不使用头部以及左侧菜单
  },
  path: '/login',
  name: 'login',
  component: login
}]
