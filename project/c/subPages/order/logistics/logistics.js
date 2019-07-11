const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    express: '',
    dataSource: [],
    logisticCode: '',
    orderId: "",
    followerUid: '' // 粉丝id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    if (options.followerUid) {
      this.setData({
        followerUid: options.followerUid
      })
    }
  },
  onShow: function (options) {
    this.checkLogistics()
  },
  /**
   * 查看物流
   */
  checkLogistics: function (event) {
    let that = this
    let { token, uid } = wx.getStorageSync('miniProgramUserinfo')
    let data = {}
    let api = 'OrderTrack'
    if (that.data.followerUid) {
      data = {
        uid,
        token,
        'orderId': this.data.orderId,
        'fansId': that.data.followerUid
      }
      api = 'OrderTrack4fans'
    } else {
      data = {
        'orderId': this.data.orderId,
        uid,
        token
      }
    }
    app.ajax.postApi(api, {
      ...data
    }).then(res => {
      var res = res.data
      if (res.status == 1) {
        // 成功
        // 处理数据 
        that.setData({
          express: res['express'],
          logisticCode: res['logisticCode'],
          expressPhone: res['expressPhone'],
          dataSource: res['data'],
        })
      } else if (res.status != 10) {
        // 失败提示
        wx.showToast({
          title: res.statusDetail,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  tell: function() {
    let expressPhone = this.data.expressPhone
    wx.makePhoneCall({
      phoneNumber: expressPhone
    })
  }


})
