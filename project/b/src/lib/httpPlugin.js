import axios from 'axios'
import qs from 'qs'
import config from 'module/config'
import _ from 'lodash'
import { jointLand } from './until'

// loading
const $http  = {};
// 初始化axios
const instance = axios.create({
  timeout: 60000
})
// 默认参数
const params = {
  ver: config.state.ver,
  Plat: config.state.Plat
}
import store from 'store/'
$http.install = function(Vue) {
    Object.defineProperties(Vue.prototype, {
      // 显示/隐藏遮罩
      $post: {
         get (){
            return ({url, data, ...oth}) => {
                return instance({
                  method: 'post',
                  url,
                  data: qs.stringify(_.merge({}, params, data)),
                  ...oth
                }).then(data => {
                  // 当账号在其他处登录的时候需要删除token/uid等基本信息
                  if (data.data.status == "10") {
                    store.commit('UPDATEUSREINFO', {'token': '', userId: '', mobile: '', uid: ''})
                    window.sessionStorage.removeItem('token')
                    window.sessionStorage.removeItem('mobile')
                    window.sessionStorage.removeItem('uid')
                    window.sessionStorage.removeItem('userId')
                    jointLand()
                  }
                  return data
                }, (error) => {
                  if (error.message != 'userCancel') {
                    toast(null, '网络不给力，请重新尝试')
                  }
                })
              }
         }
      }
    })
}
// toast框
let toast = (status, message) => {
  store.commit('SHOWLOADINGFLAG', false)
  let msg = status && store.state.errorMsg[status]
  store.commit('UPDATETOAST', { msg: msg || message}) // 弹出toast框
  setTimeout(function (status) {
    store.commit('UPDATETOAST', {msg: ''}) // 此处需要手动添加一个定时器2s以后隐藏toast
  }, 3000)
}
export default $http
