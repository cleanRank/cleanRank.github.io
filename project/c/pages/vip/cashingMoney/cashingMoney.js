// pages/vip/cashingMoney/cashingMoney.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryList: {}
  },
  onShow: function () {
    this.getUserCashDetail()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getUserCashDetail () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('query', {
      uid,
      token
    }).then(res => {
      wx.hideLoading()
      var res = res.data
      if (res.status == 1) {
        this.setData({
          queryList: res.data
        })
      } else {
        // 失败提示
        // wx.showToast({
        //   title: res.statusMessage,
        //   duration: 2000
        // })
      }
    })
  },
  // 提现按钮
  cashingMoney () {
    var { bindCardStatus, withdrawAmount, canWithdraw, remainWithdrawCount } = this.data.queryList
    if (bindCardStatus != 1 || canWithdraw != 1 || remainWithdrawCount > 3 || remainWithdrawCount <1) return false
    if (withdrawAmount < 1) {
      wx.showToast({
        title: '提现金额最低为1元',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/vip/cashingMoney/cashingConfirm/cashingConfirm'
    })
  }
})