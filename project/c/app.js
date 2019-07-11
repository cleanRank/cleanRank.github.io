var sensors = require('./utils/sensorsdata.min.js')
sensors.registerApp({
  platform_type:'小程序',
});
sensors.init();

//app.js
var http = require('./utils/http.js')
var { parseParams } = require('./utils/util.js')
// 重新获取token
var getUserToken = require('./utils/getToken.js')
var sdk = require('./utils/IM/sdk.js')  //IM
App({
  getUserToken: getUserToken,
  ajax: http, // ajax封装方法,
  sdk:sdk,  //IM
  onTabIndex: 0,
  globalData: { // 微信登录返回的信息
    code: '',
    userInfo: null,
    bLoginWay:0,
    icd:'',
    number:'',
    contentNum:'',
    weid:'',
    myInfo:'',
    imInstalment:0,
    warn_num:''
  },
  isShowfrom: false,
  bStart: true,
  miniProgramUserinfo: null,
  mainSwitch: null,
  appOption: null,
  partnerOrNot:false,
  partnershipLevel:'',
  onLaunch: function (option) {
    console.log('app-option')
    console.log(JSON.stringify(option))
    if (option.path != 'pages/start/start') {
      this.getSwitch()
    }
    if (option.path == 'pages/detail/detail' || option.path == 'pages/vip/announceList/announceDetail/announceDetail' || option.path == 'pages/activity/activity' || option.path == 'pages/index/activityPage/activityPage' || option.path == 'pages/finding/detail/detail') {
      this.appOption = option
    }
    // 授权
    this.updataApp()
    // 删除缓存
    wx.removeStorageSync('selectedAddress')
    wx.removeStorageSync('selectedRads')
    wx.removeStorageSync('curCardList')

    
    //获取用户信息
    // let taken = wx.getStorageSync('imToken')
    // if(!taken) {
    //   wx.navigateTo({
    //     url:'/pages/start/start'
    //   })
    // }else {
    //   sdk.getUserIdByToken().then(res => {
    //     if(res.appCode  == 'S0000'){
    //       thi
    //     }
    //   })
    // }
  },
  // 水象通开关
  getSwitch() {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      var { uid, token } = wx.getStorageSync('miniProgramUserinfo')
      this.ajax.postApi('FinanceSwitch', {
        'token': token || '',
        'uid': uid || ''
      }).then(({ data: res }) => {
        wx.hideLoading()
        if (res.status == '1') {
          this.mainSwitch = res
          let {imInstalment} = res
          this.globalData.imInstalment = imInstalment
          resolve(res)
        }
      })
    })

  },
  // 微信登录获取登录凭证code
  wxLogin() {
    var that = this
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            // 保存到全局
            console.log('微信登录获取登录凭证code-app')
            that.globalData.code = res.code
            resolve(res)
          } else {
            wx.showToast({
              title: '登录失败！' + res.errMsg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    })
  },
  wxGetSetting() {
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("有信息app.js")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // 获取用户信息
          wx.getUserInfo({
            success: res => {
              if (res) {
                that.globalData.userInfo = res
                // 本地存数据
                wx.setStorageSync('globalData', that.globalData)
                that.checksession().then(res => {
                  if (res) {
                    that.sendOutuser()
                  }
                })
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            }
          })
        } else {
          console.log('To authorize')
          console.log("无信息app.js")
          console.log(JSON.stringify(that.appOption))
          if (that.appOption && that.appOption.query.back && that.appOption.query.back == 1 && that.appOption.path == 'pages/finding/detail/detail') {
            console.log('fromUrl-finding:' + parseParams(that.appOption.query))
            let fromUrl = `/pages/start/start?fromType=finding&${parseParams(that.appOption.query)}`
            wx.reLaunch({
              url: fromUrl
            })
            return false
          }
          if(that.appOption && that.appOption.query.back && that.appOption.query.back == 1) {
            console.log('fromUrl-detail:' + parseParams(that.appOption.query))
            let fromUrl = `/pages/start/start?fromType=detail&${parseParams(that.appOption.query)}`
            wx.reLaunch({
              url: fromUrl
            })
          }
        }
      }
    })
  },
  // 验证登录是否过期
  checksession() {
    var that = this
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: function (res) {
          console.log('登录未过期')
          console.log(res)
          resolve(res)
        },
        fail: function (res) {
          console.log('登录过期')
          console.log(res)
          reject(res)
        }
      })
    })

  },
  // 发送用户信息查询用户
  sendOutuser() {
    console.log('get-GetUserInfoByMiniprogram api')
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 把用户信息传给
    this.ajax.postApi('GetUserInfoByMiniprogram', {
      "code": that.globalData.code,
      "encryptedData": that.globalData.userInfo.encryptedData,
      "iv": that.globalData.userInfo.iv,
      "ip":""
    }).then(res => {
      var res = res.data
      console.log(res)
      wx.hideLoading()
      if (res.status == 1 || res.status == 67) {
        that.miniProgramUserinfo = res.data

        var { uid, token } = res.data

        if (uid && token) {
          // 已绑定用户 缓存记录登录信息
          wx.setStorageSync('miniProgramUserinfo', res.data)
          console.log('Is binding')
        } else {
          console.log('unbounded')
          console.log(that.appOption)
          if (that.appOption.query.back && (that.appOption.path == 'pages/detail/detail') && that.appOption.query.back == 1) {
            let fromUrl = `/pages/start/start?fromType=detail&${parseParams(that.appOption.query)}`
            console.log('路径:'+fromUrl)
            wx.reLaunch({
              url: fromUrl
            })
          } else if (that.appOption.query.back && (that.appOption.query.fromType == 'announcedetail') && that.appOption.query.back == 1){
              let fromUrl = `/pages/start/start?fromType=announcedetail&${parseParams(that.appOption.query)}`
              console.log(fromUrl)
              wx.reLaunch({
                url: fromUrl
              })
          } else if (that.appOption.query.back && (that.appOption.query.fromType == 'activity') && that.appOption.query.back == 1) {
            let fromUrl = `/pages/start/start?fromType=activity&${parseParams(that.appOption.query)}`
            console.log(fromUrl)
            wx.reLaunch({
              url: fromUrl
            })
          } else if (that.appOption.query.back && (that.appOption.query.fromType == 'activityPage') && that.appOption.query.back == 1) {
            let fromUrl = `/pages/start/start?fromType=activityPage&${parseParams(that.appOption.query)}`
            console.log(fromUrl)
            wx.reLaunch({
              url: fromUrl
            })
          } else if (that.appOption.query.back && (that.appOption.query.fromType == 'finding') && that.appOption.query.back == 1) {
            let fromUrl = `/pages/start/start?fromType=finding&${parseParams(that.appOption.query)}`
            wx.reLaunch({
              url: fromUrl
            })
          }
        }
      }
    })
  },
  // 获取手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      app.globalData.encryptedData = e.detail.encryptedData
      app.globalData.iv = e.detail.iv
    } else {
      // 用户拒绝授权
      return
    }
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
  },
  //用户级别埋点
  getMemberLevel: function() {
    var that = this
    var {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    this.ajax.postApi('getMemberLevel',{
      uid,
      token
    }).then(res => {
      var res = res.data
      wx.hideLoading()
      if(res.status == 1) {
        let level = res.data
        let miniProgramUserinfo = wx.getStorageSync('miniProgramUserinfo')
        miniProgramUserinfo.memberLevel = level  //重新设置用户等级
        wx.setStorageSync('miniProgramUserinfo', miniProgramUserinfo)
      }
    })
    
  },
  // IM socket链接
  connectSocket () {
    let {imToken} = wx.getStorageSync("miniProgramUserinfo")
    imToken && this.sdk.connect({
      token: imToken,
      receiveMessage: (incomming) => {
        sdk.DataObserver.getInstance().Emit(sdk.DataConst.NOTIFY_RECEIVE_CHAT_MESSAGE, incomming)
      },
      receiveServiceMessage: (incomming) => {
        sdk.DataObserver.getInstance().Emit(sdk.DataConst.NOTIFY_RECEIVE_SERVICE_MESSAGE, incomming)
      }
    }).then((res)=>{
      this.sdk.token = imToken
      this.sdk.stompClient.connected = true
      sdk.DataObserver.getInstance().Emit(sdk.DataConst.NOTIFY_ONOPEN)
      clearInterval(this.timer)
      this.timer = setInterval(()=>{
        console.log(this.sdk.stompClient.connected,'isconnected')
        if(!this.sdk.stompClient.connected){
          this.connectSocket()
        }
      },3000)
    },res=>{
      console.log(res,'errorConnect')
    })
  }

})