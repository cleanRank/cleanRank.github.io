// pages/vip/cashingMoney/cashingMoney.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    queryList: {},
    cashingMoneyFlag: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    this.getUserCashDetail()
  },
  onHide () {
    this.setData({
      cashingMoneyFlag: true
    })
  },
  getUserCashDetail() {
    // 页面查询
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
  cashingMoney () {
    if (this.data.cashingMoneyFlag) {
      // 确认提现
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      this.setData({
        cashingMoneyFlag: false
      })
      app.getUserToken.getToken().then(res => {
        var res = res
        if (res.status == 1) {
          var { uid, token } = wx.getStorageSync('miniProgramUserinfo')
          app.ajax.postApi('apply', {
            uid,
            token,
            withdrawAmount: this.data.queryList.withdrawAmount
          }).then(res => {
            wx.hideLoading()
            var res = res.data
            if (res.status == 1) {
              wx.showToast({
                title: '提交成功',
                icon: 'none',
                duration: 2000
              })
              setTimeout(() => {
                // 返回提现页面
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else {
              // 失败提示
              wx.showToast({
                title: res.statusMessage,
                duration: 2000,
                icon: 'none'
              })
            }
            
          })
        }
      })
    }
    
    
  }
})