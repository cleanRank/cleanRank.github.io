
// pages/vip/incomeDetails/incomeDetails.js
//获取应用实例
const app = getApp()
Page({
  data: {
    timeList: [
      {
        title: '本日',
        type: 1
      },
      {
        title: '本月',
        type: 3
      },
      {
        title: '累计',
        type: 4
      }
    ],
    tabIndex: 0,
    incomeList: {},
    typeList: ['拉新收入', '销售收入', '团队奖励', '返现奖励'],
    // settleStatusList: ['未结算', '已结算', '退款'],
    settleStatusList: ['不可提现', '可提现', '退款'],
    incomeConditionList: {},
    isShowsxk: false, // 是否显示筛选框
    beginTime: '', // 起始时间
    endTime: '', // 截止时间
    type: '', // 1, 拉新收入; 2, 销售收入; 3, 团队奖励
    settleStatus: '' // 0,未结算;1,已结算;2,退款
  },
  onLoad: function (options) {
    this.setData({
      tabIndex: options.tabIndex || 0
    })
  },
  onShow: function () {
    this.getIncome()
  },
  getTabindex: function (e) {
    console.log(e)
    // 切换状态
    let item = e.currentTarget.dataset.model
    var indexs = e.currentTarget.dataset.indexs
    this.setData({
      [item]: indexs
    })
    if (item == 'tabIndex') {
      // 更新数据
      this.clearScreen()
      this.getIncome()
    }
  },
  clearScreen: function () {
    // 清空筛选条件
    this.setData({
      beginTime: '', // 起始时间
      endTime: '', // 截止时间
      type: '', // 1, 拉新收入; 2, 销售收入; 3, 团队奖励
      settleStatus: '' // 0,未结算;1,已结算;2,退款
    })
  },
  goExplainTxt: function () {
    // 返利说明
    wx.navigateTo({
      url: '/pages/vip/explainTxt/explainTxt'
    })
  },
  getIncome: function () {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 隐藏筛选框
    this.closeScreen_wrap()
    // if (that.data.isShowsxk) {
    //   that.setData({
    //     isShowsxk: !that.data.isShowsxk
    //   })
    // }
    var { tabIndex, beginTime, endTime, type, settleStatus } = that.data
    app.getUserToken.getToken().then(res => {
      var res = res
      if (res.status == 1) {
        var { token, uid } = wx.getStorageSync('miniProgramUserinfo')
        app.ajax.postApi('income', {
          'token': token,
          'uid': uid,
          'flag': that.data.timeList[tabIndex].type, // 1,表示本日;2,表示本周;3,表示本月;4,表示累计
          beginTime, // 查询开始时间
          endTime, // 结束时间
          type, // 1, 拉新收入; 2, 销售收入; 3, 团队奖励
          settleStatus // 0,未结算;1,已结算;2,退款
        }).then(res => {
          wx.hideLoading()
          var res = res.data
          if (res.status == 1) {
            that.setData({
              incomeList: res
            })
          } else {
            // 失败提示
            wx.showToast({
              title: res.statusDetail,
              duration: 2000
            })
          }
        })
      }
    })
  },
  bindDateChange: function (e) {
    // 选择时间
    let item = e.currentTarget.dataset.model
    this.setData({
      [item]: e.detail.value
    })
  },
  incomeCondition: function () {
    // 筛选条件
    var that = this
    // 显示筛选框
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.setData({
      isShowsxk: true
    })
    app.ajax.postApi('incomeCondition', {}).then(res => {
      wx.hideLoading()
      var res = res.data
      if (res.status == 1) {
        that.setData({
          incomeConditionList: res
        })
      } else {
        // 失败提示
        wx.showToast({
          title: res.statusDetail,
          duration: 2000
        })
      }
    })
  },
  // 关闭筛选弹窗
  closeScreen_wrap: function () {
    this.setData({
      isShowsxk: false
    })
  }
})