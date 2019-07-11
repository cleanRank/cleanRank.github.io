import { is_iphone, userFromChannel, getQueryString } from 'lib/until'
// 基本配置文件
const fromChannel = userFromChannel()
// 把用户来源缓存到session里面
window.sessionStorage.setItem('fromChannel', fromChannel)
const version = +getQueryString('version') || +window.sessionStorage.getItem('version') || 0
if (version) {
  window.sessionStorage.setItem('version', version)
}
// 判断渠道是否支持分期付款0[支持]1[不支持]
const isBystages = getQueryString('isBystages') || window.sessionStorage.getItem('isBystages') || 0
if (isBystages) {
  window.sessionStorage.setItem('isBystages', isBystages)
}
// 判断是否是水象客户端 1【安卓】2【ios】
const terminalType = getQueryString('terminalType') || window.sessionStorage.getItem('terminalType') || 0
if (terminalType) {
  window.sessionStorage.setItem('terminalType', terminalType)
}
// 取客户端版本号
let ver = '0.0.001'
if (fromChannel == 'sxypApp') {
  ver = navigator.userAgent.split('version ')[1] ? navigator.userAgent.split('version ')[1] : ver
}
const state = {
  version,
  APIPORT: process.env.APIPORT,
  Plat: is_iphone()? 'IOS': 'android',
  ver: ver,
  fromChannel,
  channel: fromChannel,
  isBystages,
  terminalType
}

const mutations = {
}
export default {
  state,
  mutations
}
