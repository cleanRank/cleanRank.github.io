const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    payStatus: 1,
    totalMoney: '',
    orderId: '',
    isShow: false,
    showLay: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var status = options.status
    var orderId = options.orderid || ''
    // 查询用户信息
    this.setData({
      payStatus: status,
      orderId: orderId
    })
  },
  onShow () {
    if (this.data.orderId && this.data.payStatus == '1') {
      this.getOrder()
    }
  },
  // 查询订单总金额
  getOrder () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.getUserToken.getToken().then(res => {
      wx.hideLoading()
      var res = res
      if (res.status == 1) {
        var userInfo = wx.getStorageSync('miniProgramUserinfo')
        app.ajax.postApi('QueryOrderTotal', {
          uid: userInfo.uid,
          token: userInfo.token,
          orderId: this.data.orderId
        }).then(data => {
          var res = data.data
          console.log("1")
          if (res.status == "1") {  
            setTimeout( () => {
              this.setData({
                isShow: true
              })
            }, 0)
            this.setData({
              totalMoney: res.data.totalMoney,
              coupons: res.data.coupons,
              activityImg: res.data.activityImg
            })
          }
        })
      }
    })
  },
  goIndex: function () {
    // 去到首页
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goOrderPage: function () {
    // 去订单
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },
  //关闭弹窗
  close_result:function(){
    this.setData({
      showLay:false
    })
  }
})