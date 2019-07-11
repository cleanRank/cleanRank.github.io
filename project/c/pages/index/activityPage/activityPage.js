// pages/index/activityPage.js
import { getQueryString } from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    versionid:null,
    token: "",
    uid: '',
    promotionFlag: false, // 推广弹窗,
    ishowPromotion: false,//是否隐藏推广，0.不展示
    listFloor:[],
    seckillStatus: 0,//秒杀状态,1-已开始，0-未开始
    promotionFlag:false,
    promotionData: {},
    userInfo: {}, //用户信息
    back: '',
    qrcode: '',
    smallImg:'',
    tit:'',
    showShare:false,
    backflag:0,
    scrollTop: 0,
    closeVideo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('activity-option')
    console.log('二维码option:' +JSON.stringify(options))
    this.setData({
      back: options.back || ''
    });
    var userInfo = wx.getStorageSync('miniProgramUserinfo') || '';
    var share = options.share || options.inviteCode || '' // 获取邀请码
    var versionid = options.versionid || '' // 获取邀请码
    var backflag = options.backflag || '' // 获取返回首页状态
    var qrId = options.scene || '' // 获取扫描二维码进来的qrId
    console.log("获取二维码信息：" + qrId)
    console.log("share：" + share)
    console.log("userinfo:" + JSON.stringify(userInfo))
    var data = {}
    if (options.versionid && userInfo) {
      console.log("有userinfo")
      this.setData({
        versionid: options.versionid
      })
      this.getUserInfo()
    }
    // 获取识别二维码跳转过来传递的参数 drId
    if (qrId) {
      qrId = decodeURIComponent(qrId)
      console.log('qrId:' + qrId)
      this.setData({
        qrId: qrId,
        option: options
      })
      this.getQRcode(this.data.qrId, this.data.option)
    }
    this.setData({
      share:share,
      versionid:versionid,
      backflag:backflag
    })
  },
  getUserInfo: function () {
    try {
      const value = wx.getStorageSync('miniProgramUserinfo')
      if (value) {
        this.setData({
          token: value['token'],
          uid: value['uid']
        })
        this.loadActData()
      }
    } catch (e) { }
  },
  loadActData: function () {
    let that = this
    console.log("版本id3:" + this.data.versionId)
    var topCategoryItem = this.data.versionid
    wx.showLoading({
      title: '加载中...',
    })
    app.ajax.postApi('ActiveTemplateNew', {
      versionId: topCategoryItem,
      uid: that.data.uid
    }).then(res => {
      wx.hideLoading()
      var res = res.data
      if (res.status == 1) {
        // myDictionary.add(category.h5Url,res.data)
        // 成功
        // 处理数据
        wx.setNavigationBarTitle({
          title: res.data.versionName ? res.data.versionName : "水象优品"
        })
          that.setData({
            currentPageData: res.data,
            listFloor: res.data.listFloor,
            ishowPromotion: res.data.rebateStatus == 0 ? true : false,
            showShare: (res.data.shareImg && res.data.shareWord)?true:false
          })
          let listFloor = that.data.listFloor 
          for (let index in listFloor) {
            let data = listFloor[index]
            if (data.floorType == 6) {
              let activityInfos = data.activityInfos
              if (activityInfos.length>0){
                let status = activityInfos[0].status || ''
                that.setData({
                  seckillStatus: status
                })
              }
            }
          }
      } else {
        that.setData({
          currentPageData: null
        })
        wx.hideLoading()
      }
    })
  },
  //点击分享
  goShare: function () {
    this.getShareImg()
  },
  // 推广弹窗隐藏 组件接受操作
  promotionClose(e) {
    var flag = e.detail.flag
    this.setData({
      promotionFlag: flag
    })
  },
  // 点击推广获取分享图
  getShareImg: function () {
    let that=this;
    console.log("版本id:"+this.data.versionId)
    wx.showLoading({
      title: '加载推广信息...',
      mask: true
    })
    var { uid, token, inviteCode } = wx.getStorageSync('miniProgramUserinfo')
    app.getUserToken.getToken().then(res => {
      app.ajax.postApi('getIndexActivityQrcode', {
        uid: uid || '',
        token:token,
        senc: `share=${inviteCode}`,
        turnPage: 'pages/index/activityPage/activityPage',
        versionId: this.data.versionid,
      }).then(({
        data: res
      }) => {
        wx.hideLoading()
        if (res.status == '1') {
          this.setData({
            promotionData: { shareImg: res.data.activityPageShareUrl},
            promotionFlag: true,
            smallImg: res.data.smallProgramSharePicUrl,
            tit:res.data.title
          })
        } else {
          wx.showToast({
            title: res.statusDetail,
            duration: 2000,
            icon: 'none'
          })
        }
      })
    })
  },
  // 分享给好友
  onShareAppMessage(option) {
    var { inviteCode } = wx.getStorageSync('miniProgramUserinfo')
    try {
      var inviteCode = inviteCode || ''
    } catch (err) {
      console.log(err)
    }
    var path = `pages/index/activityPage/activityPage?fromType=activityPage&inviteCode=` + inviteCode + `&back=1&versionid=` + this.data.versionid +'&backflag=1'
    console.log('分享地址：' + path)
    return {
      title: this.data.tit,
      path: path,
      imageUrl: `${this.data.smallImg}`
    }
  },
  // 通过qrId获取二维码信息
  getQRcode(qrId, option) {
    console.log('getQRcode:')
    console.log(option)
    return new Promise((resolve, reject) => {
      app.ajax.postApi('GetQrcodeInfo', {
        qrId: qrId
      }).then(({ data: res }) => {
        if (res.status == '1') {
          console.log("二维码返回信息："+JSON.stringify(res))
          var str = res.data.scenc
          var query = getQueryString(str)
          console.log(str)
          this.setData({
            share: query.share || option.share || '', //读取二维码邀请码
            versionid: query.versionId || option.versionid || '',
            backflag:1
          })
          console.log('测试邀请码：' + this.data.share)
          resolve(res)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    if (this.data.qrId) {
      app.wxLogin().then(res => {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        if (res) {
          app.wxGetSetting()
        }
      })
    }
    var userInfo = wx.getStorageSync('miniProgramUserinfo') || ''
    var url = `/pages/start/start`
    console.log('地址：' + url)
    console.log('用户信息：' + JSON.stringify(userInfo))
    if (!userInfo) {
      if (this.data.qrId) {
        console.log("无信息")
        this.getQRcode(this.data.qrId, this.data.option).then(function () {
          console.log("异步获取")
          console.log('二维码获取：' + that.data.share)
          url = url + `?inviteCode=${that.data.share}&fromType=activityPage&versionid=${that.data.versionid}&backflag=1`
          wx.reLaunch({
            url
          })
          console.log("测试url:" + url)
        })
      }else if(this.data.share && this.data.versionid){
        url = url + `?inviteCode=${this.data.share}&fromType=activityPage&versionid=${that.data.versionid}&backflag=1`
        wx.reLaunch({
          url
        })
      }
      return
    } else {
      console.log("有信息--")
      this.setData({
        userInfo
      })
      if (this.data.qrId) {
        this.getQRcode(this.data.qrId, this.data.option).then(function () {
          console.log("有信息后获取二维码")
          that.getUserInfo()
        })
      }else if(this.data.versionid){
        that.getUserInfo()
      }
    }
    this.setData({
      closeVideo: false
    })
    //tabbar切换触发事件，通知组件初始化视频
    setTimeout(function () {
      that.setData({
        closeVideo: true
      })
    })
    wx.removeStorageSync("video_arr")
    wx.removeStorageSync("playIndex")
  },
  touchStart: function (e) {
    this.setData({
      scrollTop: e.touches[0].pageY
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync("video_arr")
    wx.removeStorageSync("playIndex")
  },
  onUnload:function(){
    wx.removeStorageSync("video_arr")
    wx.removeStorageSync("playIndex")
  }
})
