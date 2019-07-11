// pages/start/start.js
//获取应用实例
const app = getApp()
import { getQueryString } from '../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '', // 手机号
    inviteCode: '', // 邀请码
    fromType: '',
    fromUrl: '', // 绑定成功后跳转指定路径
    bStart: true,
    bNumber: false, // 显示手授权手机号
    memberInfo: null, // 上级用户信息
    bEditMember: false, // 显示修改邀请码弹窗
    bLoginWay: true, //
    timeDown: 0,
    iptDisabledFlag: true,
  },
  onLoad: function (options) {
    console.log('邀请码：' + options.inviteCode)
    console.log('文章id：'+options.contentId)
    var echoInviteCode = options.inviteCode || ''
    var fromType = options.fromType || ''
    var qrId = options.scene || '' // qrid
    if (qrId) {
      this.setData({
        qrId: qrId
      })
    }
    if (echoInviteCode) {
      this.setData({
        inviteCode: echoInviteCode,
        iptDisabledFlag: false
      })
    }
    console.log('start-options')
    console.log(options)
    // 指定跳转页面
    if (fromType == "detail") {
      var fromUrl = `/pages/detail/detail?productNo=${options.productNo}&isActivity=${options.isActivity}&activityNo=${options.activityNo}&back=1`
      this.setData({
        fromUrl,
        fromType: fromType
      })
    } else if (fromType == "announcedetail"){
      console.log("路由信息id：" + options.contentId + ',number' + options.contentNum)
      var fromUrl = '/pages/vip/announceList/announceDetail/announceDetail?origin=floor&back=1&contentNum=' + options.contentId + '&number=' + options.number
      this.setData({
        fromUrl,
        fromType: fromType
      })
    } else if (fromType == "activity"){
      var fromUrl = '/pages/activity/activity?back=1'
      this.setData({
        fromUrl,
        fromType: fromType
      })
    } else if (fromType == "activityPage") {
      var fromUrl = '/pages/index/activityPage/activityPage?back=1&versionid=' + options.versionid + '&backflag=' + options.backflag
      this.setData({
        fromUrl,
        fromType: fromType
      })
    } else if (fromType == "finding") {
      var fromUrl = '/pages/finding/detail/detail?back=1&id=' + options.id + '&backflag=' + options.backflag
      this.setData({
        fromUrl,
        fromType: fromType
      })
    }
    app.wxLogin().then(res => {
      if (res) {
        this.getUserInfo()
      }
    })
  },
  onShow () {
    app.getSwitch().then(res => {
      if (res.status == '1') {
        app.globalData.bLoginWay = res.announcementControl//存钱开关全局变量
        app.globalData.imInstalment = res.imInstalment //IM开关
        if (res.sxtInstalment<1) {
          this.setData({
            bLoginWay: false
          })
        }
      }
    })
  },
  // 通过qrid查询邀请码
  getQRcode: function () {
    app.ajax.postApi('GetQrcodeInfo', {
      qrId: this.data.qrId
    }).then(({ data: res }) => {
      if (res.status == '1') {
        var str = res.data.scenc
        var query = getQueryString(str)
        this.setData({
          inviteCode: query.share
        })
      }
    })
  },
  // 绑定用户
  bindUser (e) {
    var type = e.currentTarget.dataset.type || 0
    // 跳转填写邀请码
    if (type == 1) {
      this.setData({
        inviteCode: ''
      })
      this.snedBindUser()
    } else if (type == 2) {
      this.getMember().then( res => {
        if (res.status ==1) {
          this.snedBindUser()
        }
      })
    } else {
      this.snedBindUser()
    }
  },
  snedBindUser () {
    let sensorsObj = this.getSenObj(); //埋点
    app.ajax.postApi('BindUser', {
      "openId": app.miniProgramUserinfo.openId,
      "mobile": this.data.mobile, // 手机号
      "inviteCode": this.data.inviteCode,
      "channel": "miniProgram",
      distinctId:sensorsObj.distinctId,
      properties:JSON.stringify(sensorsObj.properties)
    }).then(res => {
      var res = res.data
      if (res.status == 1) {
        // 更新数据
        app.miniProgramUserinfo = res.data
        wx.setStorageSync('miniProgramUserinfo', res.data)
        if (this.data.fromType && (this.data.fromType == 'detail' || this.data.fromType == 'announcedetail' || this.data.fromType == 'activity' || this.data.fromType == 'activityPage' || this.data.fromType == 'finding') && this.data.fromUrl) {
          wx.redirectTo({
            url: this.data.fromUrl
          })
        } else if (this.data.qrId=='26585') {
          wx.redirectTo({
            url: '/pages/activity/activity'
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
   },
  // 获取手机号
  getPhoneNumber(e) {
    app.wxLogin().then(res => {
      if (res) {
        if (e.detail.errMsg == "getPhoneNumber:ok") {
          app.globalData.userInfo.encryptedData = e.detail.encryptedData
          app.globalData.userInfo.iv = e.detail.iv
          this.getPhoneInfo()
        } else {
          // 用户拒绝授权
          return
        }
      }
    })
    
  },
  getUserInfo () {
    if (!this.data.bStart) {
      return false
    }
    this.setData({
      bStart: false
    })
    this.wxGetSetting()
  },
  wxGetSetting() {
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // 获取用户信息
          wx.getUserInfo({
            success: res => {
              if (res) {
                app.globalData.userInfo = res
                // 本地存数据
                wx.setStorageSync('globalData', app.globalData)
                app.checksession().then(res => {
                  if (res) {
                    this.sendOutuser()
                  }
                })
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            },
            fail: function (res) {
              this.setData({
                bStart: true
              })
            }
          })
        } else {
          this.setData({
            bStart: true
          })
        }
      }
    })
  },
  // 手机号信息解密
  getPhoneInfo () {
    app.checksession().then(res => {
      if (res) {
        var that = this
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        app.ajax.postApi("getPhoneInfo", {
          "code": app.globalData.code,
          "encryptedData": app.globalData.userInfo.encryptedData,
          "iv": app.globalData.userInfo.iv
        }).then(res => {
          var res = res.data
          wx.hideLoading()
          if (res.status == 1) {
            this.setData({
              bNumber: false,
              needParent: res.data.needParent,
              mobile: res.data.phone
            })
            if (this.data.needParent == "0") {
              this.snedBindUser()
            } else {
              if (this.data.inviteCode) {
                console.log('inviteCode:' + this.data.inviteCode)
                this.getMember().then(res => {})
              } else {
                this.setData({
                  bEditMember: true
                })
              }
            }
          }else{
            wx.showToast({
              title: res.statusDetail,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  // 通过邀请码查询用户信息
  getMember () {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      app.ajax.postApi("QueryMember", {
        "inviteCode": this.data.inviteCode
      }).then(res => {
        var res = res.data
        wx.hideLoading()
        if (res.status == 1) {
          this.setData({
            memberInfo: res.data
          })
          resolve(res)
        } else {
          wx.showToast({
            title: res.statusDetail,
            icon: 'none',
            duration: 2000
          })
        }
      })
    })
    
  },
  // 获取预置属性
  getSenObj() {
    let memberInfo = wx.getStorageSync('miniProgramUserinfo') || ''
    let partnerOrNot = memberInfo.memberLevel && memberInfo.memberLevel > 0 ? true: false
    var partnershipLevel= ""
    if(partnerOrNot) {
      partnershipLevel =  memberInfo.memberLevel == 1 ? '初级' :'中级'
    }
    
    var senObj = {
      distinctId:app.sensors.store.getDistinctId(),
      properties:app.sensors.getPresetProperties()
    }
    senObj.properties.partnerOrNot = partnerOrNot
    senObj.properties.partnershipLevel = partnershipLevel
    senObj.properties.platform_type = "小程序"
    return senObj;
  },
  // 发送用户信息查询用户
  sendOutuser() {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let sensorsObj = this.getSenObj(); //埋点
    // 把用户信息传给
    app.ajax.postApi('GetUserInfoByMiniprogram', {
      "code": app.globalData.code,
      "encryptedData": app.globalData.userInfo.encryptedData,
      "iv": app.globalData.userInfo.iv,
      "ip":"",
      distinctId:sensorsObj.distinctId,
      properties:JSON.stringify(sensorsObj.properties)
    }).then(res => {
      var res = res.data
      wx.hideLoading()
      if (res.status == 1 || res.status == 67) {
        app.miniProgramUserinfo = res.data 
        // app.globalData.ImUserId = res.data.ImUserId

        var { uid, token } = res.data
        if (uid && token) { 
          // 已绑定用户 缓存记录登录信息
          wx.setStorageSync('miniProgramUserinfo', res.data)
          //IM获取用户信息
          let {imToken,imUserId} = res.data
          if(imToken && imUserId){
            app.sdk.getUserInfoById({userId:imUserId}).then(res => {
              if(res.appCode == 'S0000'){
                console.log('IM个人信息')
                app.globalData.myInfo = res.result
                console.log(app.globalData.myInfo)
                // 调取用户头像 昵称
                let userInfo = wx.getStorageSync('miniProgramUserinfo')
                let{uid,token,imUserId} = userInfo

                // IM获取信息
                app.connectSocket()
                app.ajax.postApi('getUsersByImUserIds',{
                  uid,
                  token,
                  imUserIds:imUserId
                }).then( res => {
                  var res = res.data
                  if(res.status == '1') {
                    res = res.data
                    app.globalData.myInfo.avatarUrl = res[0].avatarUrl
                    app.globalData.myInfo.nickName = res[0].nickName
                  }else {
                    wx.showToast({
                      title: res.statusDetail,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
              }else {
                wx.showToast({
                  title: res.appMesg || '',
                  icon: 'none'
                })
              }
           }).catch(error => {
             wx.showToast({
               title:'获取个人信息请求失败',
               icon: 'none'
             })
           })
          } else {
            wx.showToast({
              title: '获取taken失败',
              icon: 'none'
            })
          }
          


          if (this.data.fromType && (this.data.fromType == 'detail' || this.data.fromType == 'announcedetail' || this.data.fromType == 'activity' || this.data.fromType == 'activityPage' || this.data.fromType == 'finding') && this.data.fromUrl) {
            // 商品详情页(fromtype==detail)或者课程详情页(fromtype==announcedetail)跳转过来
            wx.redirectTo({
              url: this.data.fromUrl
            })
          } else if (this.data.qrId == '26585') {
            wx.redirectTo({
              url: '/pages/activity/activity'
            })
          }  else {
            // 跳转首页
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        } else {
          if (app.mainSwitch.sxtInstalment =='0') {
            // 提供测试
            that.setData({
              isShowfrom: true
            })
            wx.setNavigationBarColor({
              frontColor: '#000000',
              backgroundColor: '#ffffff'
            })
          } else {
            // 如果携带邀请码则回显邀请码
            if (this.data.qrId) {
              this.getQRcode()
            }
            this.setData({
              bNumber: true,
              bLoginWay: true
            })
          }
          
        }
      } else if (res.status == 66) {
        app.wxLogin().then((res) => {
          if (res) {
            this.sendOutuser()
          }
        })
      } else {
        // 恢复可点击状态
        this.setData({
          bStart: true
        })
      }
    })
  },
  // 更换绑定人
  changeInviter () {
    this.setData({
      inviteCode: '',
      memberInfo: null,
      bEditMember: true
    })
  },
  // 收到输入邀请码
  editInviteCode (e) {
    let val = e.detail.value
    this.setData({
      inviteCode: val
    })
  },
  // 获取手机号
  getPhone: function (e) {
    var val = e.detail.value
    this.setData({
      mobile: val
    });
  },
  // 倒计时
  timeDwon() {
    this.setData({ timeDown: 59 })
    var interval = setInterval(() => {
      if (this.data.timeDown <= 0) {
        clearInterval(interval)
        return false
      }
      var second = parseInt(this.data.timeDown) - 1
      this.setData({ timeDown: second })
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
    var { mobileValidCode, mobile, inviteCode } = e.detail.value
    console.log('邀请码：' + inviteCode)
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
        "openId": app.miniProgramUserinfo.openId,
        "mobileValidCode": mobileValidCode, // 短信验证码
        "mobile": mobile, // 手机号
        "inviteCode": inviteCode,
        "channel": "miniProgram",  
      }).then(res => {
        var res = res.data
        if (res.status == 1) {
          // 更新数据
          wx.setStorageSync('miniProgramUserinfo', res.data)
          if (this.data.fromType && (this.data.fromType == 'detail' || this.data.fromType == 'announcedetail' || this.data.fromType == 'activity' || this.data.fromType == 'activityPage' || this.data.fromType == 'finding') && this.data.fromUrl) {
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