const cashManage = r => require.ensure([], () => r(require('view/accountManage/cashManage')), 'cashManage') // 提现管理
const balanceDetail = r => require.ensure([], () => r(require('view/accountManage/balanceDetail')), 'balanceDetail') // 余额明细
export default [
  // 提现管理
  {
    path: '/cashManage',
    name: 'cashManage',
    meta: {
      title: '提现管理',
      isOpen: 1,
      requiresAuth: true,
      unCommon: true // 使用头部以及左侧菜单
    },
    component: cashManage
  },
  // 余额明细
  {
    path: '/balanceDetail',
    name: 'balanceDetail',
    component: balanceDetail,
    meta: {
      title: '余额明细',
      requiresAuth: true,
      unCommon: true // 使用头部以及左侧菜单
    }
  }
]
