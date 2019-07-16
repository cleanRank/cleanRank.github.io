//app.js
// var http = require('./utils/http.js')
const httpPlugin = require('/utils/apimd.js')
// 重新获取token
// var getUserToken = require('./utils/getToken.js')

App({
  // getUserToken: getUserToken,
  globalData: {
    shopInfo: '',
    couponInfo: {},
    actionInfo: {},
    goodsList: []
  },
  // ajax: http, // ajax封装方法,
  $http: httpPlugin,
  onTabIndex: 0,
  onLaunch: function () {
    wx.removeStorageSync('city');
    wx.removeStorageSync('cityCode');
  },
  onHide() {
    // this.tmpPreToShopCart()
  },
  onShow: function () {
    this.updataApp() //退出小程序，点击返回键时再次进入页面都会强制更新

  },
  // 小程序强制更新
  updataApp: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})