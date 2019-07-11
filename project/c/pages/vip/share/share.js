const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    miniProgramUserinfo: {},
    current: 0,
    sharePics: [], // 大图
    sharePics4send: [], // 分享出去的图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.setData({
      miniProgramUserinfo: wx.getStorageSync('miniProgramUserinfo')
    })
    this.getShareImg()
  },
  onShareAppMessage(option) {
    return {
      title: "",
      path: `pages/start/start?inviteCode=${this.data.miniProgramUserinfo.inviteCode}`,
      imageUrl: this.data.sharePics4send[this.data.current] ? this.data.sharePics4send[this.data.current] : this.data.sharePics[this.data.current]
    }
  },
  onSlideChangeEnd: function (e) {
    var that = this;
    that.setData({
      current: e.detail.current
    })
  },
  // 获取分享图片
  getShareImg: function (e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var {
      uid,
      token
    } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('getSharePics', {
      uid,
      token
    }).then(({
      data: res
    }) => {
      if (res.status == '1') {
        this.setData({
          sharePics: res.data.sharePics,
          sharePics4send: res.data.sharePics4send
        })
      }
      wx.hideLoading()
    })
  }
})