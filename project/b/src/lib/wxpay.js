// 微信支付
export const weChatPay = {
  weixinPay (data) {
    var vm = this
    if (typeof WeixinJSBridge == "undefined") {
      console.log('1 ' + WeixinJSBridge)
      // 微信浏览器内置对象
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(data), false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(data))
        document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(data))
      }
    } else {
      console.log('微信支付')
      vm.onBridgeReady(data)
    }
  },
  onBridgeReady: function (data) {
    console.log('data ' +data)
    var vm = this
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        "appId": data.appId,     // 公众号名称，由商户传入
        "timeStamp": data.timeStamp, // 时间戳，自1970年以来的秒数
        "nonceStr": data.nonceStr, // 随机串
        "package": data.package || data.packAge,
        "signType": data.signType, // 微信签名方式
        "paySign": data.paySign // 微信签名
      },
      function (res) {
        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          // 支付成功
          window.location.href = process.env.SXYPNAME + '/index.html#/paysucces?gift=2'
        } else {
          console.log('取消支付')
          window.location.href = process.env.SXYPNAME + '/index.html#/payerror'
        }
      }
    )
  }
}
