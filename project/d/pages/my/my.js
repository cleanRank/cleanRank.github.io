// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    userInfo: {},
    telphone: "",
    walletBalance: 0,
    interval: ''

  },
  showTelService() {
    this.setData({
      isShow: true
    })
  },
  // 呼叫电话
  calling() {
    wx.makePhoneCall({
      phoneNumber: '4006789999'
    })
    this.setData({
      isShow: false
    })
  },
  // 取消
  abrogate() {
    this.setData({
      isShow: false
    })
  },
  getWalletBlance() {
    app.$http.getWalletBalanceInfo({}).then(res => {
      this.setData({
        walletBalance: res.result.endBonus
      })
    }).catch(res => {})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let telphone = wx.getStorageSync("mobile") //手机号
    let myphone = telphone.substr(3, 4);
    let lphone = telphone.replace(myphone, "****");
    this.setData({
      telphone: lphone
    })
  },

  onShow: function () {
    //我的钱包余额
    this.setData({
      isShow: false
    })
    this.getWalletBlance()
  }
})