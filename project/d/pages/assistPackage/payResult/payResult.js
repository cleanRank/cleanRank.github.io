//pay.js
//支付订单js
import {
  formatTimeAmt
} from '../../../utils/util.js'
const app = getApp()
Page({
  data: {
    payType: 1, // 1:微信支付 2：余额支付
    status: 0, // 支付状态 1:成功 2 失败
    // vipShow: 0 // 展示优惠券弹层
    ticketInfoNoUse: [], //首页首次进入页面弹框
    close: true
  },
  onShow: function () {
    app.globalData.actionInfo['activityIdList'] = []
    app.globalData.actionInfo['takeActivityFlag'] = 1
    app.globalData.actionInfo['usedCrmPopDefVOListFirst'] = []
    app.globalData.actionInfo['selectActionDetail'] = {}
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId ? options.orderId : '0',
      status: options.status ? options.status : 0,
      // vipShow: app.globalData.isNewMember
    })
    app.globalData.isNewMember = false
    this.getTicketList() //支付完成后弹出优惠券列表
  },
  onUnload() {
    wx.switchTab({
      url: `/pages/main/main`
    })
  },
  onHide: function () {},
  // 提示方法上海职场默认2秒
  toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  confirm(e) {
    wx.switchTab({
      url: '/pages/main/main'
    })
  },
  goCouponCenter() {
    wx.navigateTo({
      url: '/pages/assistPackage/discountPage/discountPage'
    })
  },
  // 关闭优惠券遮罩层
  closeLayer() {
    // this.setData({
    //   vipShow: !this.data.vipShow
    // })
  },
  goDetail() {
    wx.navigateTo({
      url: `/pages/assistPackage/orderDetail/orderDetail?orderId=${this.data.orderId}&source=1`
    })
  },
  //首页每天首次进入页面时优惠券展示
  getTicketList() {
    app.$http.getMyTicketInfo({
      page: 1,
      param: {
        usedFlag: 0,
        inorderId: this.data.orderId
      },
      size: 20
    }).then(res => {
      res.result.datas.forEach(v => {
        v.beginDate = formatTimeAmt(v.beginDate, 'yyyy.MM.dd')
        v.endDate = formatTimeAmt(v.endDate, 'yyyy.MM.dd')
      })
      this.setData({
        ticketInfoNoUse: res.result.datas
      })
    }).catch(res => {})
  },
  //进入我的优惠券
  goMyTicket() {
    wx.navigateTo({
      url: '/pages/assistPackage/discountPage/discountPage'
    })
    this.setData({
      close: false
    })
  },
  //关闭优惠券列表弹层
  closeModel() {
    this.setData({
      close: false
    })
  }
})