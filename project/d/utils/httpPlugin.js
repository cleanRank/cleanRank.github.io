
let params = {
  ver: '1.2.1',
  Plat: 'miniprogram',
  token: wx.getStorageSync('sxypToken')
}
function toast(msg="服务器连接失败") {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
}
function fetch(url, data, method, contentType) {
  wx.showLoading({
    title: '加载中'
  })
  //暴露接口才可以引入
  return new Promise((resolve, reject) => {
    wx.request({
      url: url, //api地址
      method: method, // 请求方法
      data: data, // 参数
      header: {
        'content-type': contentType ? 'application/x-www-form-urlencoded' : 'application/json',
        'token': wx.getStorageSync('sxypToken')
      },
      success: function (res) {
        let data = res.data
        if (data.appCode == 'S0000') {
          wx.hideLoading()
          resolve(data)
        } else if (data.appCode === 'S0007') {
          wx.hideLoading()
          toast(data.appMesg)
          reject(data)
        } else if (data.appCode === 'S0001') {
          wx.hideLoading()
          toast(data.appMesg)
          reject(data)
        } else {
          wx.hideLoading()
          toast(data.appMesg)
          reject(data)
        }
      },
      fail: function (res) {
        // 提示失败信息
        toast("请求失败")
      }
    })
  })
}
function fetch1(url, data, method) {
  wx.showLoading({
    title: '加载中'
  })
  //暴露接口才可以引入
  return new Promise((resolve, reject) => {
    wx.request({
      url: url, //api地址
      method: method, // 请求方法
      data: data, // 参数
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('sxypToken')
      },
      success: function (res) {
        let data = res.data
        if (data.appCode == 'S0000') {
          wx.hideLoading()
          resolve(data)
        } else if (data.appCode == 'S70000') {
          wx.hideLoading()
          resolve(data)
        } {
          wx.hideLoading()
          reject(data)
        }
      },
      fail: function (res) {
        // 提示失败信息
        toast("请求失败")
      }
    })
  })
}

function getApi(url, data) { // get请求
  return fetch(url, data, 'GET')
}
function getApi1(url, data) { // get请求
  return fetch1(url, data, 'GET')
}

function postApi(url, data) { // post请求
  return fetch(url, data, 'POST')
}
function postApiString(url, data) { // post请求
  return fetch(url, data, 'POST', 1)
}
function postApi1(url, data) { // post请求
  return fetch1(url, data, 'POST')
}
function putApi(url, data) { // put请求
  return fetch(url, data, 'PUT')
}
function deleteApi(url, data) { // delete请求
  return fetch(url, data, 'DELETE')
}

module.exports = {
  getApi,
  postApi,
  postApiString,
  putApi,
  deleteApi,
  getApi1,
  postApi1
}