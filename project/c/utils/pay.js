import api from './api'
import http from './http'
import getUserToken from './getToken'
var wxPaymentParams = {} // 微信授权信息
var orderid = '' //order id
// 授权微信支付
const wxPayment = (orderId,senObj, call) => {
  let that = this
  getUserToken.getToken().then(res => {
    var res = res
    if (res.status == 1) {
      var userInfo = wx.getStorageSync('miniProgramUserinfo')
      http.postApi('Wxpay', {
        uid: userInfo.uid,
        token: userInfo.token,
        centerUserId: userInfo.centerUserId,
        orderId: orderId,
        isWxBrowser: true,
        isMini: true,
        distinctId: senObj.distinctId,
        properties: JSON.stringify(senObj.properties)
      }).then(data => {
        orderid = orderId
        var res = data.data
        if (res.status == '1') {
          // 保存微信授权信息
          wxPaymentParams = {
            appId: res.data.appId,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            paySign: res.data.paySign,
            signType: res.data.signType,
            timeStamp: res.data.timeStamp
          }
          // 发起微信支付窗口 
          wxRequestPayment()
        } else if(res.status == 76){
          call({
            noGoods:true,
            orderId
          })
        }else {
          wx.showToast({
            title: res.statusDetail,
            duration: 2000,
            icon: 'none'
          })
        }
      })
    }
  })
}
// 发起微信支付窗口
const wxRequestPayment = () => {
  wx.requestPayment({
    timeStamp: wxPaymentParams.timeStamp,
    nonceStr: wxPaymentParams.nonceStr,
    package: wxPaymentParams.package,
    signType: wxPaymentParams.signType,
    paySign: wxPaymentParams.paySign,
    success(res) { // 接口调用成功的回调函数
      //返回上一级关闭当前页面
      setTimeout(() => {
        wx.reLaunch({
          url: "/pages/order/payResult/payResult?status=1&orderid=" + orderid
        })
      }, 200)
    },
    fail(error) { // 接口调用失败的回调函数
      console.log('接口调用失败的回调函数')
      
      setTimeout(() => {
        wx.reLaunch({
          url: "/pages/order/payResult/payResult?status=2&orderid=''"
        })
      },200)
    },
    complete(msg) { // 接口调用结束的回调函数（调用成功、失败都会执行）
      console.log(' 接口调用结束的回调函数（调用成功、失败都会执行')
      console.log(msg)
    }
  })
}
module.exports = {
  wxPayment,
  wxRequestPayment
}
