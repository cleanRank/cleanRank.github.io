import Base64 from 'lib/Base64'
import _ from 'lodash'
import store from 'store/'
// 判断当前是否是安卓手机
export const is_android = () => {
  var ua = navigator.userAgent.toLocaleLowerCase()
  if (ua.indexOf('android') > -1 || ua.indexOf('linux') > -1 || ua.indexOf('Android') > -1) {
    return true
  } else {
    return false
  }
}
// 判断当前是否是iphone手机
export const is_iphone = () => {
  var ua = navigator.userAgent.toLocaleLowerCase()
  if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1 || ua.indexOf('macintosh') > -1) {
    return true
  } else {
    return false
  }
}
export const is_weixn = () => {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true
  } else {
      return false
  }
}
// 截取url 里面token的值
export const getQueryString = name => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  let params = window.location.search.substr(1) || window.location.href.split('?')[1]
  let r = params && params.match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

// splic()截取，转对象
// export const getQueryJson = (name, url) => {
//   let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
//   let params = url
//   let r = params && params.match(reg)
//   if (r != null) {
//     return unescape(r[2])
//   }
//   return null
// }
// 格式化金额
export const fixed2NoRound = (money) => {
  let newMoney=Math.ceil((money*100).toFixed(5))/100;
  return newMoney.toFixed(2)
}
// 计算首付金额
/**
 * [caleDownpayment description]
 * @param  {[type]} money [产品金额]
 * @param  {[type]} ratio [首付比例]
 * @return {[type]}       [首付金额]
 */
export const caleDownpayment = (money, ratio) => {
  let downpaymentMonth = (money * ratio / 100 * 10000) / 10000;
  return fixed2NoRound(downpaymentMonth)
}
/**
 * [caleRateMoney description]
 * @param  {[type]} money                [产品金额]
 * @param  {[type]} months               [分期月数]
 * @param  {[type]} rate                 [利率]
 * @param  {Number} [downpaymentMonth=0] [首付金额]
 * @return {[type]}                      [每月还款金额]
 */
// 分期计算公式
export const caleRateMoney = (money, months, rate, downpaymentMonth) => {
  // console.log(downpaymentMonth)
  money = money - downpaymentMonth
  let monthMoney = (money / months + money * rate / 100)
  if (fixed2NoRound(monthMoney) != 0) {
    // monthMoney += 0.01
    return fixed2NoRound(monthMoney)
  } else {
    return 0
  }
}
// 数字显示*
export const getHiddenText = (text, start, end, spaceNum, spaceTxt) => {
  // text : 替换的字符串  start : 替换起点  end:替换终点 spaceNum ： 表示每几个字符一个空格
  var arryText = text.split('')
  var arryTemp = []
  var spaceCount = 0
  for (var i in arryText) {
    spaceCount++
    if (i>= start && i <=end) {
      arryTemp.push('*')
    } else {
      arryTemp.push(arryText[i])
    }
    if (spaceNum && spaceCount % spaceNum == 0) {
      spaceTxt = spaceTxt || " "
      arryTemp.push(spaceTxt)
      spaceCount = 0
    }
  }
  return arryTemp.join('')
}
/**
 * 页面商品标签
 *
 * @param {array} label
 * @param {number} showtype h5展示类型 1商品单列 2商品双列 3商品三列 4商品三列轮播 5商品详情
 * @returns
 */
export const positionPage = (label, showtype) => {
  // showtype 表示商品显示样式，例如商品一列
  if (!label) return []
  var result = []
  label.forEach((item, i) => {
    // item.position 图标位置， 1主图左上 2主图左下 3商品名称前 4副商品名称前 5月付后
    if (item.showtype == showtype || !showtype) {
      result[+item.position-1] = item
    }
  })
  return result
}
// 身份证号码
export const IdentityCodeValid = (code) => {
  code = $.trim(code.toLowerCase())
  var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  var pass = true
  if (!regIdNo.test(code)) {
    pass = false
  }
  return pass
  // var city = {11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 "}
  // var pass = true
  // if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
  //   console.log('身份证号格式错误')
  //   pass = false
  // } else if (!city[code.substr(0, 2)]) {
  //   console.log('地址编码错误')
  //   pass = false
  // } else {
  //   // 18位身份证需要验证最后一位校验位
  //   if (code.length == 18) {
  //     code = code.split('')
  //     // ∑(ai×Wi)(mod 11)
  //     // 加权因子
  //     var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
  //     // 校验位
  //     var parity = [ 1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2 ]
  //     var sum = 0
  //     var ai = 0
  //     var wi = 0
  //     for (var i = 0; i < 17; i++) {
  //       ai = code[i]
  //       wi = factor[i]
  //       sum += ai * wi
  //     }
  //     if (parity[sum % 11] != code[17]) {
  //       console.log('校验位错误')
  //       pass = false
  //     }
  //   }
  // }
  // return pass
}
// 区分用户来源
export const userFromChannel = () => {
  const fc = getQueryString('fromChannel')
  const fromC = window.sessionStorage.getItem('fromChannel')
  let fromChannel = 'sxyph5'
  if (fc && fc!='') {
    fromChannel = fc
  } else if (/waterMall/i.test(navigator.userAgent)) {
    fromChannel = 'sxypApp'
  } else if (fromC) {
    fromChannel = fromC
  }
  return fromChannel
}
// app 方法统一封装
export const app = {
  // {body: 123}ios 参数随便乱写，不添加参数ios方法调用错误
  /**
   * 首页 -【goIndex】
   * 去购物车页 -【goShopCart】
   * 去白条 -【goCredit】
   * 登录 -【welogin】
   * 去我的页面 -【wemine】
   * 隐藏tabbar事件 -【ioshidetabbar】
   * 显示tabbar事件 -【iosshowtabbar】
   * 去店铺 - 【goStore】
   * 去网红 - 【goCelebrity】
   * 去营销活动商品列表 - 【goActivityProduct】
   */
  goIndex () {
    if (is_android()) {
      console.log('调起客户端返回')
      Android.goIndex()
    } else {
      window.webkit.messageHandlers.goIndex.postMessage({body: JSON.stringify('123')})
    }
  },
  goShopCart () {
    if (is_android()) {
      Android.goShopCart()
    } else {
      window.webkit.messageHandlers.goShopCart.postMessage({body: JSON.stringify('123')})
    }
  },
  isShopingCart () {
    if (is_android()) {
      Android.isShopingCart()
    }
  },
  goCredit () {
    if (is_android()) {
      Android.goCredit()
    } else {
      window.webkit.messageHandlers.goCredit.postMessage({body: JSON.stringify('123')})
    }
  },
  welogin () {
    if (is_android()) {
      Android.welogin()
    } else {
      window.webkit.messageHandlers.welogin.postMessage({body: JSON.stringify('123')})
    }
  },
  wemine () {
    if (is_android()) {
      Android.wemine()
    } else {
      window.webkit.messageHandlers.wemine.postMessage({body: JSON.stringify('123')})
    }
  },
  goBindBankCard (obj) {
    console.log(obj)
    if (is_android()) {
      Android.goBindBankCard(JSON.stringify(obj))
    } else {
      window.webkit.messageHandlers.goBindBankCard.postMessage({body: JSON.stringify(obj)})
    }
  },
  shareWeb (obj) {
    console.log(obj)
    if (is_android()) {
      Android.shareWeb(JSON.stringify(obj))
    } else {
      window.webkit.messageHandlers.shareWeb.postMessage({body: JSON.stringify(obj)})
    }
  },
  goStore (obj) {
    if (is_android()) {
      Android.goStore(JSON.stringify(obj))
    } else {
      window.webkit.messageHandlers.goStore.postMessage({body: JSON.stringify(obj)})
    }
  },
  goCelebrity (obj) {
    if (is_android()) {
      Android.goCelebrity(JSON.stringify(obj))
    } else {
      window.webkit.messageHandlers.goCelebrity.postMessage({body: JSON.stringify(obj)})
    }
  },
  // ioshidetabbar () {
  //   if (is_android()) {
  //     Android.ioshidetabbar()
  //   } else {
  //     window.webkit.messageHandlers.ioshidetabbar.postMessage({body: JSON.stringify('123')})
  //   }
  // },
  // iosshowtabbar () {
  //   console.log(navigator.userAgent)
  //   if (is_android()) {
  //     Android.iosshowtabbar()
  //   } else {
  //     window.webkit.messageHandlers.iosshowtabbar.postMessage({body: JSON.stringify('123')})
  //   }
  // },
  showAppTitle () {
    if (is_android()) {
      Android.showAppTitle()
    } else {
      window.webkit.messageHandlers.showAppTitle.postMessage({body: JSON.stringify('123')})
    }
  },
  hideAppTitle () {
    if (is_android()) {
      Android.hideAppTitle()
    } else {
      window.webkit.messageHandlers.hideAppTitle.postMessage({body: JSON.stringify('123')})
    }
  },
  wxPay (obj) {
    if (is_android()) {
      Android.wxPay(JSON.stringify(obj))
    } else {
      window.webkit.messageHandlers.wxPay.postMessage({body: JSON.stringify(obj)})
    }
  },
  appGoodsComments (obj) {
    console.log(obj)
    if (is_android()) {
      Android.appGoodsComments(JSON.stringify(obj))
    } else {
      window.webkit.messageHandlers.appGoodsComments.postMessage({body: JSON.stringify(obj)})
    }
  },
  QYService (obj) {
    console.log(obj)
    if (is_android()) {
      Android.QYService(JSON.stringify(obj))
    } else {
      window.webkit.messageHandlers.QYService.postMessage({body: JSON.stringify(obj)})
    }
  },
  // 安卓网络类型
  sendConnectionType () {
    if (is_android()) {
      Android.sendConnectionType()
    } else {
      // window.webkit.messageHandlers.goShopCart.postMessage({body: JSON.stringify('123')})
    }
  },
  // 通知安卓返回经纬度信息
  getAddressInfo () {
    if (is_android()) {
      Android.getAddressInfo()
    } else {
      window.webkit.messageHandlers.getAddressInfo.postMessage({body: JSON.stringify('123')})
    }
  },
  // 跳转App营销活动商品列表
  goActivityProduct (obj) {
    if (is_android()) {
      Android.goActivityProduct(JSON.stringify(obj))
    } else {
      window.webkit.messageHandlers.goActivityProduct.postMessage({body: JSON.stringify(obj)})
    }
  }
}
export const html_encode = (str) => {
  var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
}
// 登陆包含水象优品h5，水象分期app, 云贷app,云贷h5, 封装的统一的登陆方法
export const jointLand = () => {
  const fromChannel = userFromChannel()
  // 云贷app
  if (fromChannel == 'ydApp') {
    if (is_android()) {
      Android.jsToAppLogin()
    } else {
      jsToAppLogin()
    }
  } else if (fromChannel == 'ydH5') {
    // 云贷h5
    // 云贷h5跳转链接base64加密
    const callBackUrl = Base64.encode(window.location.href)
    let urls = process.env.SXYDURL['LOGIN']
    window.location.href = `${urls}?callBackUrl=${callBackUrl}`
  } else if (fromChannel == 'syApp') {
    // 水象分期
    const callBackUrl = Base64.encode(window.location.href)
    let urls = process.env.SXFQURL['LOGIN']
    window.location.href = `${urls}?callBackUrl=${callBackUrl}`
  }else if (fromChannel == 'sxypApp') {
    console.log('调起客户端登录')
    app.welogin()
  } else {
    window.location.href = '#/login'
  }
}
// 去分期
export const gocredit = () => {
    // 去白条项目
  let userId = store.state.userInfo.userId
  let url = process.env.SXBTURL['CREDIT']
  let callUrl = window.location.href.indexOf('?') > -1 ? window.location.href : window.location.href + '?userId=' + userId
  const callBackUrl = Base64.encode(callUrl)
  let fromChannel = store.state.config.fromChannel
  window.location.href = `${url}?userId=${userId}&fromChannel=${fromChannel}&callBackUrl=${callBackUrl}`
}
