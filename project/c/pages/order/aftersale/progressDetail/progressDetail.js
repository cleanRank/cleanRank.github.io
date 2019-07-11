const app = getApp()
Page({
  data: {
    progressLogList: []
  },
  onLoad: function (options) {
    // 接收售后订单详情传过来的数组
    var progressLogList = options.progressLogList
    this.setData({
      progressLogList: JSON.parse(progressLogList)
    })
  },
  onShow: function () {}
})