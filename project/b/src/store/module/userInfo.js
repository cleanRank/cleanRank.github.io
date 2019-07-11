// 用户信息state
import { getQueryString, is_android } from 'lib/until'
import { UPDATEUSREINFO } from 'store/mutation-types'
import _ from "lodash"
const token = getQueryString('token') || window.sessionStorage.getItem('token') || ''
const userId = getQueryString('token') ? '' : (getQueryString('userId') || window.sessionStorage.getItem('userId'))
const state = {
  token,
  userId,
  mobile: window.sessionStorage.getItem('mobile') || getQueryString('mobile') || '',
  uid: window.sessionStorage.getItem('uid') || getQueryString('uid') || '',
  // isLoadHttpRequest: false,  // 联合登陆接口是否调用成功
  // 设备指纹信息
  fingerprint: {
    latitude: '',
    longitude: '',
    mobile: '',
    netType: '',
    udid: '',
    wifiMac: '',
    deviceType: is_android()?'android':'ios'
  },
  isLoginedTokenWanKa: false,
  loginTokenWanKaState: 0 // 替换调isLoginedTokenWanKa，联合登录状态：0：未登录，1：未联合登录，2：已登录
}
const mutations = {
  [UPDATEUSREINFO] (state, userInfo) {
    _.merge(state, userInfo)
  }
}
export default {
  state,
  mutations
}
