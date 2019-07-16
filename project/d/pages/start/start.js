// pages/start/start.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowpage: false,
    isShowfrom: false,
    isShowAuthorize: false,
    timeDown: 0,
    miniProgramUserinfo: {},
    mobileValidCode: '', // 短信验证码
    mobile: '', // 手机号
    tel: '', // 手机号
    pass: '', // 密码
    inviteCode: '', // 邀请码
    iptDisabledFlag: true,
    fromType: '',
    fromUrl: '' // 绑定成功后跳转指定路径
  },
  onLoad: function (options) {
    var echoInviteCode = options.inviteCode || ''
    var fromType = options.fromType || ''
    app.globalData.shopCode = options.scene || ''
    this.setData({
      mobile: wx.getStorageSync('mobile')
    })
    if (echoInviteCode) {
      this.setData({
        inviteCode: echoInviteCode,
        iptDisabledFlag: false
      })
    }
    // 指定跳转页面
    if (fromType == "detail") {
      var fromUrl = `/pages/detail/detail?productNo=${options.productNo}&isActivity=${options.isActivity}&activityNo=${options.activityNo}`
      this.setData({
        fromUrl,
        fromType: fromType
      })
    }
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.code = res.code
        this.getUserInfo()
      }
    })
  },
  onShow() {
    this.setData({
      isShowfrom: false
    })
  },
  onHide: function () {
    this.setData({
      fromType: '',
      fromUrl: ''
    })
  },
  getUserInfo: function () {
    let _this = this
    let phoneNum = wx.getStorageSync('mobile')
    if (phoneNum) {
      this.wxLogin() // 有手机号直接登录跳转
    } else { // 没有手机号判断是否授权过用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            // 获取用户信息
            wx.getUserInfo({
              success: res => {
                if (res) {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res
                  // 本地存数据
                  // wx.setStorageSync('globalData', this.globalData)
                  _this.wxLogin()
                  // wx.navigateTo({
                  //   url: '/pages/assistPackage/freeBuy/freeBuy'
                  //   // url: '/pages/assistPackage/confirmOrder/confirmOrder',
                  // })
                  // this.sendOutuser(this.globalData)
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  // if (this.userInfoReadyCallback) {
                  //   this.userInfoReadyCallback(res)
                  // }
                }
              }
            })
          } else {
            // 没有授权的用户显示欢迎页
            // this.setData({
            //   isShowAuthorize: true
            // })
          }
        }
      })
    }
  },
  // 用户授权手机号
  getPhoneNumber(e) {
    if (e.detail.encryptedData) {
      this.wxLogin(e.detail)
    } else {
      this.setData({
        isShowfrom: false
      })
    }
  },
  confirm() {
    let _this = this
    let param = {}
    let params = {
      loginType: 1,
      mobile: this.data.tel,
      password: this.data.pass,
      sourceApplication: 3,
      sourceDevice: this.getSystem() || 1,
      sourcePlatform: 2
    }
    app.$http.wxLogin(Object.assign(param, params)).then(res => {
      if (res.appCode == 'S0000') {
        wx.setStorageSync('sxypToken', res.result.token)
        wx.setStorageSync('mobile', res.result.mobile)
        wx.setStorageSync('openId', res.result.openid)
        _this.tmpPreToShopCart()
        app.globalData.isNewMember = res.result.isNewMember
        if (app.globalData.shopCode) {
          this.getStoreInfoByCode()
        } else {
          wx.switchTab({
            url: '/pages/main/main',
          })
        }
      }
    }).catch(res => {})
  },
  // 用户授权登录注册
  wxLogin(data = {}) {
    let _this = this
    let param = {}
    if (data.encryptedData) {
      param = {
        encryptedData: data.encryptedData,
        iv: data.iv
      }
    }
    let params = {
      loginType: 3,
      sourceApplication: 3,
      sourceDevice: this.getSystem() || 1,
      sourcePlatform: 2,
      wxCode: _this.globalData.code
    }
    app.$http.wxLogin(Object.assign(param, params)).then(res => {
      if (res.appCode == 'S0000') {
        wx.setStorageSync('sxypToken', res.result.token)
        wx.setStorageSync('mobile', res.result.mobile)
        wx.setStorageSync('openId', res.result.openid)
        _this.tmpPreToShopCart()
        app.globalData.isNewMember = res.result.isNewMember
        if (app.globalData.shopCode) {
          this.getStoreInfoByCode()
        } else {
          wx.switchTab({
            url: '/pages/main/main',
          })
        }
      } else if (res.appCode == 'S70000') {
        // 登录
        wx.login({
          success: res => {
            _this.globalData.code = res.code
            _this.setData({
              isShowAuthorize: true
            })
          }
        })
      }
    }).catch(res => {})
  },
  // 同步历史购物车
  tmpPreToShopCart() {
    app.$http.tmpPreToShopCart().then(res => {
      this.setData({
        orderInfo: res.result.orderInfo,
        usableActionTicketList: res.result.usableActionTicketList,
        usableCashTicketList: res.result.usableCashTicketList,
        usableDiscountTicketList: res.result.usableDiscountTicketList
      })
    }).catch(res => {})
  },
  // 扫码定位店铺
  getStoreInfoByCode() {
    app.$http.getStoreInfoByCode({
      shopCode: app.globalData.shopCode
    }).then(res => {
      app.globalData.shopInfo = res.result
      wx.switchTab({
        url: '/pages/main/main',
      })
    }).catch(res => {})
  },
  // 获取手机系统型号
  getSystem() {
    let res = wx.getSystemInfoSync()
    return res.system.includes('Android') ? 1 : 2
  },
  sendOutuser: function (data) {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 获取到小程序信息，传给后台
    app.ajax.postApi('GetUserInfoByMiniprogram', {
      "code": data.code,
      "encryptedData": data.userInfo.encryptedData,
      "iv": data.userInfo.iv
    }).then(res => {
      var res = res.data
      wx.hideLoading()
      if (res.status == 1 || res.status == 67) {
        that.setData({
          miniProgramUserinfo: res.data
        })
        var {
          uid,
          token
        } = res.data
        if (uid && token) {
          //已经绑定的用户
          // 更新数据
          wx.setStorageSync('miniProgramUserinfo', res.data)
          // 跳转指定页面
          if (this.data.fromType && this.data.fromType == 'detail' && this.data.fromUrl) {
            wx.navigateTo({
              url: this.data.fromUrl
            })
          } else {
            // 去到首页
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        } else {
          // 显示欢迎页
          this.setData({
            isShowpage: true
          })
          // 未绑定用户，进行手机号码绑定
          that.setData({
            isShowfrom: true
          })
        }
      } else {
        // 显示欢迎页
        this.setData({
          isShowpage: true
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    code: ''
  },
  // 获取手机号
  getPhone: function (e) {
    var val = e.detail.value
    this.setData({
      mobile: val
    });
    wx.setStorageSync('mobile', this.data.mobile)
  },
  // 获取手机号
  getTel: function (e) {
    var val = e.detail.value
    this.setData({
      tel: val
    })
  },
  getPassword(e) {
    var val = e.detail.value
    this.setData({
      pass: val
    })
  },
  // 倒计时
  timeDwon() {
    this.setData({
      timeDown: 59
    })
    var interval = setInterval(() => {
      if (this.data.timeDown <= 0) {
        clearInterval(interval)
        return false
      }
      var second = parseInt(this.data.timeDown) - 1
      this.setData({
        timeDown: second
      })
    }, 1000)
  },
  getmobileValidCode() {
    // 获取短信验证码
    if (!this.data.mobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
    } else if (!(/^0?(13|15|18|14|17|16|19)[0-9]{9}$/.test(this.data.mobile))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 获取短信验证码
      app.ajax.postApi('SendValidCode', {
        "mobile": this.data.mobile, // 手机号
        "type": 7
      }).then(res => {
        var res = res.data
        if (res.status == 1) {
          // 倒计时
          this.timeDwon()
        } else {
          wx.showToast({
            title: res.statusDetail,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  formSubmit(e) {
    // 绑定用户
    var that = this
    var warn = "" // 弹框时提示的内容
    var flag = true // 判断信息输入是否完整
    var {
      mobileValidCode,
      mobile,
      inviteCode
    } = e.detail.value
    // console.log('邀请码：'+inviteCode)
    that.setData({
      mobileValidCode: mobileValidCode, // 短信验证码
      mobile: mobile, // 手机号
      inviteCode: inviteCode // 邀请码
    })
    if (!mobile) {
      warn = "请输入手机号"
    } else if (!(/^0?(13|15|18|14|17|16|19)[0-9]{9}$/.test(mobile))) {
      warn = "请输入正确的手机号"
    } else if (!mobileValidCode) {
      warn = "请输入短信验证码"
    } else if (!(/^[0-9]{6}$/.test(mobileValidCode))) {
      warn = "请输入正确的短信验证码"
    } else {
      flag = false //若必要信息都填写，则不用弹框，且页面可以进行跳转
      // 绑定用户
      app.ajax.postApi('BindUser', {
        "openId": that.data.miniProgramUserinfo.openId,
        "mobileValidCode": mobileValidCode, // 短信验证码
        "mobile": mobile, // 手机号
        "inviteCode": inviteCode,
        "channel": "miniProgram"
      }).then(res => {
        var res = res.data
        if (res.status == 1) {
          // 更新数据
          wx.setStorageSync('miniProgramUserinfo', res.data)
          if (this.data.fromType && this.data.fromType == 'detail' && this.data.fromUrl) {
            wx.navigateTo({
              url: this.data.fromUrl
            })
          } else {
            // 去到首页
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        } else {
          wx.showToast({
            title: res.statusDetail,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
    if (flag) {
      wx.showToast({
        title: warn,
        icon: 'none',
        duration: 2000
      })
    }
  }
})