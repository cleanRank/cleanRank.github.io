const app = getApp()
Page({
  data: {
    logisticsOrder: {
      express: "",
      logisticCode: ""
    },
    logisticsDetail:[]
  },
  onLoad: function (options) {
    var orderId = options.orderId
    var type = options.type
    this.setData({
      orderId,
      type
    })
  },
  onShow: function () {
    this.getAftersaleLogistics()
  },
  // 查询售后物流
  getAftersaleLogistics () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.ajax.postApi('OrderTrack', {
      orderId: this.data.orderId,
      type:this.data.type
    }).then(({data: res}) => {
      wx.hideLoading()
      if (res.status =='1') {
        this.setData({
          "logisticsOrder.express": res['express'],
          "logisticsOrder.logisticCode": res['logisticCode'],
          logisticsDetail: res['data']
        })
      } else {
        wx.showToast({
          title: res.statusDetail,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

})