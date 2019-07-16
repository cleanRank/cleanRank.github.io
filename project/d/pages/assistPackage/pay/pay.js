//pay.js
//支付订单js
const app = getApp()
Page({
  data: {
    payType: 1, // 1:微信支付 2：余额支付
    flag: 0, // 控制跳转指针
    flag1: 0, // 控制跳转指针
    params: {
      page: 0,
      size: 10,
      origin: 0
    }
  },
  onLoad: function (options) {
    app.globalData.payFlag = 0
    this.setData({
      orderId: options.orderId ? options.orderId : '0',
      totalAmt: options.amt != 0 ? options.amt : 0,
      payType: options.amt != 0 ? 1 : 2,
      openId: wx.getStorageSync('openId'),
      type: options.type,
      flag: 0,
      flag1: 0,
      origin: options.origin || 0
    })
  },
  onShow: function () {
    // console.log(app.globalData.couponInfo.usedActionTicketId, app.globalData.couponInfo.usedCashTicketId, app.globalData.couponInfo.usedDiscountTicketId, "余额支付")
  },
  onUnload: function () {
    if (!app.globalData.payFlag&&this.data.origin) {
      wx.navigateTo({
        url: `/pages/assistPackage/orderDetail/orderDetail?orderId=${this.data.orderId}&source=1`
      })
    }
    // if (!this.data.flag) {
    //   if (this.data.type == 1) {
    //   } else {
    //     wx.redirectTo({
    //       url: `/pages/assistPackage/confirmOrder/confirmOrder?orderId=${this.data.orderId}&source=1`
    //     })
    //   }
    // } else if (this.data.flag && !this.data.flag1) {
    //   wx.redirectTo({
    //     url: `/pages/assistPackage/orderDetail/orderDetail?orderId=${this.data.orderId}&source=1`
    //   })
    // }
  },
  // 提示方法上海职场默认2秒
  toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  selectPayType(e) {
    let type = e.currentTarget.dataset.type
    if (type == this.data.payType) {
      return false
    }
    this.setData({
      payType: type
    })
  },
  // 获取手机系统型号
  getSystem() {
    let flag = 1
    wx.getSystemInfo({
      success(res) {
        flag = res.system.includes('Android') ? 1 : 2
      }
    })
    return flag
  },
  // 立即支付跳转支付页面
  startPay() {
    this.data.payType == 1 ? this.goPay() : this.yePay()
  },
  goPay() { // 微信支付
    let _this = this
    app.$http.startup(Object.assign({}, {
      appType: 3,
      openId: this.data.openId,
      paymentType: 'wechatpay',
      orderId: this.data.orderId,
      terminalType: this.getSystem()
    })).then(res => {
      _this.setData({
        flag: 1
      })
      let p = JSON.parse(res.result.payInfo)
      let orderId = _this.data.orderId
      wx.requestPayment({
        timeStamp: p.timeStamp, // 时间戳0
        nonceStr: p.nonceStr, // 32位随机字符串
        package: p.package, // 统一下单接口返回的prepay_id参数值, 提交格式如prepay_id=***
        signType: p.signType, // 签名算法
        paySign: p.paySign, // 签名
        // key为商户平台设置的密钥key
        success: function (res) {
          app.globalData.couponInfo = {
            usedActionTicketId: '',
            usedCashTicketId: '',
            usedDiscountTicketId: ''
          }
          _this.setData({
            flag1: 1
          })
          app.globalData.payFlag = 1
          wx.navigateTo({
            url: '/pages/assistPackage/payResult/payResult?status=1&orderId=' + orderId
          })
        },
        fail: function (ref) {}
      })
    }).catch(res => {})
  },
  yePay() { // 余额支付方式
    let _this = this
    wx.showModal({
      title: '余额支付',
      content: '是否使用余额支付',
      success(res) {
        if (res.confirm) {
          app.$http.payByEndbonus(Object.assign({}, {
            orderId: _this.data.orderId,
            terminalType: _this.getSystem(),
            openId: _this.data.openId
          })).then(res => {
            app.globalData.couponInfo = {
              usedActionTicketId: '',
              usedCashTicketId: '',
              usedDiscountTicketId: ''
            }
            _this.setData({
              flag: 1,
              flag1: 1
            })
            app.globalData.payFlag = 1
            wx.navigateTo({
              url: '/pages/assistPackage/payResult/payResult?status=1&orderId=' + _this.data.orderId
            })
          }).catch(res => {})
        }
      }
    })
  },
})