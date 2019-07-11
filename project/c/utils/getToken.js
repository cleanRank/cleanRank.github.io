import api from './api'
import http from './http'
// 重新获取token
function getToken () {
  return new Promise((resolve, reject) => {
    var userInfo = wx.getStorageSync('miniProgramUserinfo')
    http.postApi('GetNewToken', {
      openId: userInfo.openId
    }).then(data => {
      var res = data.data
      if (res.status == '1') {
        // 重新更新数据
        userInfo.token = res.data.token
        userInfo.inviteCode = res.data.inviteCode
        console.log('重置了userInfo')
        wx.setStorageSync('miniProgramUserinfo', userInfo)
        resolve(res)
      } else {
        wx.showToast({
          title: res.statusDetail,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  })
}

module.exports = {
  getToken
}