// pages/vip/cashingMoney/cashingRecord/cashingRecord.js
const app = getApp()
Page({
  data: {
    cashingRecordList: [],
    cashingList: ['待审核', '审核通过', '审核拒绝']
  },
  onShow () {
    this.getCashingRecord()
  },
  getCashingRecord () {
    // 页面加载
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('queryDetail', {
      uid,
      token
    }).then(res => {
      wx.hideLoading()
      var res = res.data
      if (res.status == 1) {
        this.setData({
          cashingRecordList: res.data
        })
      } else {
        // 失败提示
        // wx.showToast({
        //   title: res.statusMessage,
        //   duration: 2000
        // })
      }
    })
  }
})