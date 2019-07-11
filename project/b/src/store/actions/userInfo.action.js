import $post from 'lib/http'
import userInfo from 'module/userInfo'
import config from 'module/config'
import api from 'module/api'
import { jointLand } from 'lib/until'
// 更新用户信息
export const updateUserInfo = ({ commit }, ...args) => {
  commit('UPDATEUSREINFO', ...args)
}
// 获取用户信息
export const loginTokenWanKa = ({ commit }) => {
  return $post({
    url: api.state.unitedLogin,
    data: {
      phone: userInfo.state.mobile,
      token: userInfo.state.token,
      userIdVerify: userInfo.state.userId || '',
      channel: config.state.channel || ''
    }
  }).then(res => {
    let data = res.data
    if (data.status == 1) {
      window.sessionStorage.setItem('token', data.token)
      window.sessionStorage.setItem('mobile', data.mobile)
      window.sessionStorage.setItem('uid', data.uid)
      window.sessionStorage.setItem('userId', data.openId)
      commit('UPDATEUSREINFO', {...data, userId: data.openId, loginTokenWanKaState: 2, isLoginedTokenWanKa: true})
    } else if (data.status == 10) {
      let dialogInfo = {
        title: '提示', // alert标题
        msg: data.statusDetail, // alert内容
        rBtnText: '确定',
        confCallBack () {
          jointLand()
        }
      }
      commit('UPDATELOADALERT', dialogInfo)
    } else {
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('mobile')
      window.sessionStorage.removeItem('uid')
      window.sessionStorage.removeItem('userId')
      commit('UPDATEUSREINFO', {'token': '', userId: '', mobile: '', uid: '', userStatus: data.status, loginTokenWanKaState: 0, isLoginedTokenWanKa: true})
      setTimeout(() => {
        jointLand()
      }, 300)
    }
  })
}
