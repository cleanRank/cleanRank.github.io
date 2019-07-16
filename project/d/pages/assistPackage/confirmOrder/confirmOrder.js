// // pages/vip/incomeDetails/incomeDetails.js
//获取应用实例
const app = getApp()
Page({
  data: {
    disabledTicketList: [], //不可用优惠券列表
    discountList: ['特价','折扣','满减'],
    usableActionTicketList: [], //活动券列表
    usableCashTicketList: [], //代金券列表
    usableDiscountTicketList: [], //折扣券列表
    usedCrmPopDefVOList: [], //当前使用活动优惠列表
    usableCrmPopDefVOList: [], //可用活动优惠列表
    usedCrmPopDefVOListFirst: {},
    afterPrice: 0,
    beforePrice: 0,
    usedActionTicket: {},
    usedCashTicket: {},
    usedDiscountTicket: {},
    orderInfo: [{
      goodsName: '火腿肠',
      num: 1
    }, {
      goodsName: '饼干',
      num: 2
    }, {
      goodsName: '葡萄干',
      num: 3
    }],
    totalBill: 450,
    bill: 50,
    realPrice: 12,
    ticket: 0,
    needPrice: 0,
    orderList: []
  },
  onShow() {
    if (app.globalData.actionConfirm || app.globalData.ticketConfirm) {
      app.$http.createConfirmOrderPage(Object.assign({}, {
        goodsList: app.globalData.goodList,
        orderActivityBo: {
          takeActivityFlag: app.globalData.actionInfo.takeActivityFlag,
          activityIdList: app.globalData.actionInfo.activityIdList,
        },
        orderTicketBo: {
          usedActionTicketId: app.globalData.couponInfo.usedActionTicketId,
          usedCashTicketId: app.globalData.couponInfo.usedCashTicketId,
          usedDiscountTicketId: app.globalData.couponInfo.usedDiscountTicketId
        },
        shopId: app.globalData.shopInfo.shopId,
        sourceFrom: 3
      })).then(res => {
        this.setData({
          orderList: res.result,
          usableCrmPopDefVOList: res.result.orderActivityVo.usableCrmPopDefVOList, //可用优惠活动列表
          usedCrmPopDefVOList: res.result.orderActivityVo.usedCrmPopDefVOList, //当前使用优惠活动
          usedActionTicket: res.result.orderTicketVo.usedActionTicket,
          usedCashTicket: res.result.orderTicketVo.usedCashTicket,
          usedDiscountTicket: res.result.orderTicketVo.usedDiscountTicket,
        })
        let orderList = this.data.orderList
        this.setData({
          usableActionTicketList: [...orderList.orderTicketVo.usableActionTicketList], //可用活动券列表
          usableCashTicketList: [...orderList.orderTicketVo.usableCashTicketList], //可用代金券列表
          usableDiscountTicketList: [...orderList.orderTicketVo.usableDiscountTicketList], //可用折扣券列表
          disabledTicketList: [...orderList.orderTicketVo.disabledTicketList], //不可用优惠券列表
        })
        //活动优惠
        app.globalData.actionInfo['usedCrmPopDefVOList'] = [...orderList.orderActivityVo.usedCrmPopDefVOList] || []
        app.globalData.actionInfo['usableCrmPopDefVOList'] = [...orderList.orderActivityVo.usableCrmPopDefVOList] || []
        //优惠券
        app.globalData.couponInfo['disabledTicketList'] = [...orderList.orderTicketVo.disabledTicketList] || []
        app.globalData.couponInfo['usableActionTicketList'] = [...orderList.orderTicketVo.usableActionTicketList] || []
        app.globalData.couponInfo['usableCashTicketList'] = [...orderList.orderTicketVo.usableCashTicketList] || []
        app.globalData.couponInfo['usableDiscountTicketList'] = [...orderList.orderTicketVo.usableDiscountTicketList] || []
      }).catch(res => {})
    }
  },
  onLoad: function (options) {
    app.globalData.actionConfirm = false
    app.globalData.ticketConfirm = false
    if (options.orderList) {
      let orderList = options.orderList && JSON.parse(options.orderList)
      app.globalData.showLogo = 1
      this.setData({
        orderList: orderList
      })
      this.setData({
        usableCrmPopDefVOList: orderList.orderActivityVo.usableCrmPopDefVOList || [], //可用优惠活动列表
        usedCrmPopDefVOList: orderList.orderActivityVo.usedCrmPopDefVOList || [], //当前使用优惠活动
        usableActionTicketList: orderList.orderTicketVo.usableActionTicketList || [], //可用活动券列表
        usableCashTicketList: orderList.orderTicketVo.usableCashTicketList || [], //可用代金券列表
        usableDiscountTicketList: orderList.orderTicketVo.usableDiscountTicketList || [], //可用折扣券列表
        disabledTicketList: orderList.orderTicketVo.disabledTicketList || [], //不可用优惠券列表
        usedActionTicket: orderList.orderTicketVo.usedActionTicket,
        usedCashTicket: orderList.orderTicketVo.usedCashTicket,
        usedDiscountTicket: orderList.orderTicketVo.usedDiscountTicket,
      })
      //活动优惠
      app.globalData.actionInfo['usedCrmPopDefVOList'] = orderList.orderActivityVo.usedCrmPopDefVOList || []
      app.globalData.actionInfo['usableCrmPopDefVOList'] = orderList.orderActivityVo.usableCrmPopDefVOList || []
      //优惠券
      app.globalData.couponInfo['disabledTicketList'] = orderList.orderTicketVo.disabledTicketList || []
      app.globalData.couponInfo['usableActionTicketList'] = orderList.orderTicketVo.usableActionTicketList || []
      app.globalData.couponInfo['usableCashTicketList'] = orderList.orderTicketVo.usableCashTicketList || []
      app.globalData.couponInfo['usableDiscountTicketList'] = orderList.orderTicketVo.usableDiscountTicketList || []
    }
  },
  goPay() {
    if (this.data.orderInfo.realAmt == undefined) {
      this.data.orderInfo.realAmt = ''
    }
    app.globalData.showLogo = 0
    app.$http.submitOrder(Object.assign({}, {
      goodsList: app.globalData.goodList,
      orderActivityBo: {
        takeActivityFlag: app.globalData.actionInfo.takeActivityFlag,
        activityIdList: app.globalData.actionInfo.activityIdList,
      },
      orderTicketBo: {
        usedActionTicketId: app.globalData.couponInfo.usedActionTicketId,
        usedCashTicketId: app.globalData.couponInfo.usedCashTicketId,
        usedDiscountTicketId: app.globalData.couponInfo.usedDiscountTicketId
      },
      shopId: app.globalData.shopInfo.shopId,
      sourceFrom: 3
    })).then(res => {
      wx.redirectTo({
        url: `/pages/assistPackage/pay/pay?orderId=${res.result.orderId}&amt=${this.data.orderList.realAmt}&type=2&origin=1`
      })
      app.globalData.couponInfo.usedActionTicketId = null;
      app.globalData.couponInfo.usedDiscountTicketId = null;
      app.globalData.couponInfo.usedCashTicketId = null;
      app.globalData.actionInfo.activityIdList = [];
    }).catch(err => {})
  },
  //选择活动优惠
  selectAction() {
    wx.navigateTo({
      url: `/pages/assistPackage/useAction/useAction?usableCrmPopDefVOList=${JSON.stringify(app.globalData.actionInfo.usableCrmPopDefVOList)}&usedCrmPopDefVOList=${JSON.stringify(app.globalData.actionInfo.usedCrmPopDefVOList)}`
    })
  },
  // 选择优惠券
  selectCoupon() {
    wx.navigateTo({
      url: `/pages/assistPackage/useCoupon/useCoupon?orderId=${this.data.orderId}&action=${this.data.usedActionTicketId}&cash=${this.data.usedCashTicketId}&count=${this.data.usedDiscountTicketId}&disabledTicketList=${JSON.stringify(app.globalData.couponInfo.disabledTicketList)}&usableActionTicketList=${JSON.stringify(app.globalData.couponInfo.usableActionTicketList)}&usableCashTicketList=${JSON.stringify(app.globalData.couponInfo.usableCashTicketList)}&usableDiscountTicketList=${JSON.stringify(app.globalData.couponInfo.usableDiscountTicketList)}`
    })
  },
})