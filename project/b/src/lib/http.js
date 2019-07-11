/*
 * ajax 方法简单封装，底层调用的是 vue 官方推荐库 axios
 */
import sessionStorage from 'lib/session_storage'
import axios from 'axios'
import qs from 'qs'
import store from 'store/'
import config from 'module/config'
import _ from 'lodash'
import { jointLand } from './until'

// toast框
let toast = (status, message) => {
  store.commit('SHOWLOADINGFLAG', false)
  let msg = status && store.state.errorMsg[status]
  store.commit('UPDATETOAST', { msg: msg || message}) // 弹出toast框
  setTimeout(function (status) {
    store.commit('UPDATETOAST', {msg: ''}) // 此处需要手动添加一个定时器2s以后隐藏toast
  }, 3000)
}
// 初始化axios
let instance = axios.create({
  timeout: 60000
})
let params = {
  ver: config.state.ver,
  Plat: config.state.Plat
}
let $post = function ({url, data, method}) {
  return instance({
    method: 'post',
    url: url,
    data: qs.stringify(_.merge({}, params, data))
  }).then(data => {
    // 当账号在其他处登录的时候需要删除token/uid等基本信息
    if (data.data.status == "10") {
      store.commit('UPDATEUSREINFO', {'token': '', userId: '', mobile: '', uid: '', loginTokenWanKaState: 0})
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('mobile')
      window.sessionStorage.removeItem('uid')
      window.sessionStorage.removeItem('userId')
      jointLand()
    }
    return data
  }, (error) => {
    toast(null, '网络不给力，请重新尝试')
  })
}
//
export const $get = function ({url, data}) {
  return instance({
    url,
    method: 'get',
    params: _.merge({}, params, data),
  }).then(data => {
    return data
  }, (error) => {
    // toast(null, '网络不给力，请重新尝试')
  })
}

export default $post
