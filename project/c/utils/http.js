import api from './api'
let params = {
  ver: '1.9.0',
  Plat: 'miniprogram'
}

function fetch(url, data, method) {
  var {
    token,
    uid
  } = wx.getStorageSync('miniProgramUserinfo')
  if (uid && token) {
    params.uid = uid
    params.token = token
  }
  //暴露接口才可以引入
  return new Promise((resolve, reject) => {
    wx.request({
      url: api[url], //api地址
      method: method, // 请求方法
      data: Object.assign({}, params, data), // 参数
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        resolve(res)
        let consoleObj = {
          "url": api[url],
          "data": Object.assign({}, params, data),
          "response": res.data
        }
        console.log(consoleObj)
        if (res.data.status == 10) {
          var userInfo = wx.getStorageSync('miniProgramUserinfo')
          postApi('GetNewToken', {
            openId: userInfo.openId
          }).then(data => {
            var res = data.data
            if (res.status == '1') {
              // 重新更新数据
              userInfo.token = res.data.token
              userInfo.inviteCode = res.data.inviteCode
              wx.setStorageSync('miniProgramUserinfo', userInfo)
              // 刷新当前页面
              getCurrentPages()[getCurrentPages().length - 1].onShow()
            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
        // 提示失败信息
        wx.showToast({
          title: '请求失败',
          duration: 1500
        })
      }
    })
  })
}

function getApi(url, data) { // get请求
  return fetch(url, data, 'Get')
}

function postApi(url, data) { // post请求
  return fetch(url, data, 'POST')
}
module.exports = {
  getApi,
  postApi
}