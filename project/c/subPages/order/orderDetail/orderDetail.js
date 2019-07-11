// pages/order/orderDetail/orderDetail.js

const app = getApp()
const pay = require('../../../utils/pay.js')
Page({
  data: {
    path: "../../detail/detail",
    orderId: "",
    dataSource: {},
    subtotal: 0, //小计
    listOrder: [],
    orderStatusString: {
      1: "待支付",
      2: "待发货",
      3: "待收货",
      4: "待评价",
      7: "已支付",
      5: "已取消",
      6: "已取消",
      8: "已取消",
      9: "已取消",
      12: "已取消"
    },
    count: 0,
    pageName:'订单详情'
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    this.getOrderList()
    this.setData({
      sxtInstalment: app.mainSwitch.sxtInstalment || 0
    })
  },
  /**
   * 获取订单详情
   */
  getOrderList: function() {
    let that = this
    var { token, uid } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('QueryOrderDetails', {
      'orderId': this.data.orderId,
      uid,
      token,
    }).then(res => {
      var res = res.data
      if (res.status == 1) {
        // 成功
        // 处理数据 
        var data = res.data
        // 判断是否是合并的订单
        if (data.listOrder && data.listOrder.length > 0) {
          that.setData({
            listOrder: data.listOrder
          })
        } else {
          let obj = []
          obj[0] = data
          that.setData({
            listOrder: obj
          })
        }
        var count = 0
        var subtotal  = 0
        this.data.listOrder.forEach((item, index) => {
          count += +(item.buycount)
          subtotal += +(item.productPrice * item.buycount)
        })
        that.setData({
          dataSource: data,
          count: count,
          subtotal: Math.round(subtotal * 100) / 100
        })
      } else {
        // 失败提示
        // wx.showToast({
        //   title: res.statusDetail,
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
  },
  /**
   * 取消订单
   */
  cancelOrder: function(event) {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.getUserToken.getToken().then(res => {
      var res = res
      wx.hideLoading()
      if (res.status == 1) {
        var { token, uid } = wx.getStorageSync('miniProgramUserinfo')
        app.ajax.postApi('CancelOrdernew', {
          'orderId': this.data.orderId,
          uid,
          token
        }).then(res => {
          var res = res.data
          if (res.status == 1) {
            // 成功
            // 取消成功，刷新页面
            that.getOrderList()
          } else {
            // 失败提示
            wx.showToast({
              title: res.statusMessage,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  cancelOredrClick: function(event) {
    if (this.data.dataSource.orderStatus == 2 && this.data.dataSource.canAfterSale && this.data.dataSource.canAfterSale == '1') {
      // 去售后
      wx.navigateTo({
        url: `/pages/order/aftersale/applyAftersale/applyAftersale?orderId=${this.data.orderId}&orderStatus=2`
      })
    } else {
      // 取消订单
      let that = this
      wx.showModal({
        title: '',
        content: '您确定要取消该订单？',
        success(res) {
          if (res.confirm) {
            that.cancelOrder()
          }
        }
      })
    }
  },
  /**
   * 支付
   */
  wxpay:function(){
    let senObj = this.getSenObj()//埋点
    
    pay.wxPayment(this.data.orderId,senObj)
  },

  /**
  * 申请售后
  */
  afterSales: function () {
    wx.navigateTo({
      url: `/pages/order/aftersale/applyAftersale/applyAftersale?orderId=${this.data.orderId}`
    })
  },

  /**
    * 查看物流
    */
  checkLogistics: function (event) {
    wx.navigateTo({
      url: "/subPages/order/logistics/logistics?orderId=" + this.data.orderId
    })
  },
  /**
   * 订单详情跳转到到商品详情
   */
  orderDetialClick: function (e) {
    var index = e.currentTarget.dataset.index
    var listData = this.data.listOrder[index]
    // 虚拟订单不跳转详情
    if (this.data.dataSource.productType>100) return false
    wx.navigateTo({
      url: "/pages/detail/detail" + "?productNo=" + listData.productNo + "&" + "isActivity=" + listData.isActivity + "&" + "activityNo=" + listData.activityNo
    })
  },
  //获取预置属性
  getSenObj(){
    let memberInfo = wx.getStorageSync('miniProgramUserinfo') || ''
    let partnerOrNot = memberInfo.memberLevel && memberInfo.memberLevel > 0 ? true: false
    var partnershipLevel= ""
    if(partnerOrNot) {
      partnershipLevel =  memberInfo.memberLevel == 1 ? '初级' :'中级'
    }
    var senObj = {
      distinctId:app.sensors.store.getDistinctId(),
      properties:app.sensors.getPresetProperties()
    } //埋点
    senObj.properties.partnerOrNot = partnerOrNot
    senObj.properties.partnershipLevel = partnershipLevel
    senObj.properties.platform_type = "小程序"
    return senObj;
  }
})