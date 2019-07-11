// activityPages/pages/newYearRedEnvelop.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showMammon: false,
    mammonEnter: false,
    subjectNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _this = this
    // 获取红包优惠券名称
    app.ajax.postApi('internalCoupon').then(res => {
      try {
        _this.setData({ subjectNo: res.data.subjectNo })
      } catch (err) {
        console.log(err)
      }
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 展示财神弹窗
   * */
  getMammon () {
    let _this = this
    let { mobile, token } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('getSubjectAppInternal', {
      mobile,
      token,
      subjectNo: _this.data.subjectNo
    }).then(res => {
      let resData = res.data
      if (resData.status == 1) {
        this.setData({ showMammon: true })
        this.setData({ mammonEnter: true })
      } else {
        wx.showToast({
          title: resData.statusDetail,
          mask: true,
          icon: "none"
        })
      }
    })
  }
})