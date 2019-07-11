// pages/vip/storeShare/storeShare.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      pic: '',
      name: ''
    },
    editStoreName: '',
    inputStoreName: '',
    bgImg: '',
    downloadImgUrl: '',
    qrCodeImg: '',
    sharePics: '',
    shareSmallPics: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化页面
    this.init()
  },

  /**
   * 初始化页面
  */
  init() {
    this.getPageEleAndSharePic()
  },

  /**
   * 调用获取页面元素与分享图的公用方法
   * */
  getPageEleAndSharePic() {
    // 获取页面元素和分享图片
    // 个人觉得这两个接口应该是同一个
    wx.showLoading({
      title: '加载中',
      icon: "loading",
      mask: true
    })
    var miniProgramUserinfo = wx.getStorageSync('miniProgramUserinfo')
    Promise.all([
      this.getPageElements(miniProgramUserinfo),
      this.getSharePic(miniProgramUserinfo)
    ]).then(res => {
      wx.hideLoading()
      let resData = {}
      // 便利两个接口的返回值
      res.forEach(ele => {
        if (ele.data.status != '1') {
          wx.showToast({
            title: ele.data.statusMessage,
            icon: 'none',
            duration: 2000
          })
          return false
        }
        resData = Object.assign({}, resData, { ...ele.data.data })
      })
      this.setData({
        'userInfo.pic': resData.img,
        'bgImg': resData.pic,
        'editStoreName': resData.name.length > 11 ? resData.name.substr(0, 11) : resData.name,
        'qrCodeImg': resData.qrcode,
        'sharePics': 'https://' + resData.storeSharePics.split("://")[1],
        'shareSmallPics': resData.storeShareSmallPics
      })
    })
  },

  /**
   * 进入页面时获取页面元素
  */
  getPageElements({ token, uid }) {
    return app.ajax.postApi('getStoreSharePics', {
      token,
      uid
    })
  },

  /**
   * 进入页面调取分享展示图接口
  */
  getSharePic({ token, uid }) {
    return app.ajax.postApi('sendStoreSharePics', {
      token,
      uid
    })
  },
  /*
  * 清空店铺名称
  */
  clearStoreName () {
    this.setData({
      inputStoreName: ''
    })
  },
  /**
   * 点击保存店铺名
  */
  saveStoreName() {
    let that = this
    if (!this.data.inputStoreName) {
      that.selectComponent('#modal').hideModal()  // 什么都不输点击保存隐藏模态框
      return
    }
    wx.showLoading({
      title: '加载中',
      icon: "loading",
      mask: true
    })
    let { token, uid } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('saveStoreShareName', {
      token,
      uid,
      storeShareName: that.data.inputStoreName
    }).then(res => {
      if (res.data.status == '1') {
        this.clearStoreName()
        that.selectComponent('#modal').hideModal()  // 保存完店名之后将模态框隐藏
      } else {
        wx.showToast({
          title: res.data.statusMessage,
          icon: 'none',
          duration: 2000
        })
      }

      // 调用获取页面元素和分享图
      that.getPageEleAndSharePic({ token, uid })
      // that.getSharePic({token, uid}).then(res => {
      //   wx.hideLoading()
      //   if (res.data.status != '1') {
      //     wx.showToast({
      //       title: res.data.statusMessage,
      //       icon: 'none',
      //       duration: 2000
      //     })
      //     return
      //   }
      //   let resData = res.data.data
      //   this.setData({
      //     'sharePics': resData.storeSharePics,
      //     'shareSmallPics': resData.storeShareSmallPics
      //   })
      // })
    })
  },

  /**
   * 点击编辑按钮，修改店铺名
  */
  tapEditStoreName() {
    this.selectComponent('#modal').showModal()
  },

  /**
   * 在输入框输入新店铺名
  */
  inputStoreName(e) {
    this.setData({ 'inputStoreName': e.detail.value })
  },

  /**
   * 图片下载成功的回调函数
  */
  downloadImgFinish() {
    wx.showToast({
      title: '分享图已保存到手机',
      icon: "none",
      duration: 2000
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (option) {
    let that = this
    return {
      title: "",
      path: `pages/start/start?inviteCode=${wx.getStorageSync('miniProgramUserinfo').inviteCode}`,
      imageUrl: that.data.shareSmallPics
    }
  }
})
