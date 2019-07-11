import { getQueryString } from '../../utils/util.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showMammon: false,
    subjectNo: '',
    acFlag:true,
    hideBom:true,
    userInfo: {}, //用户信息
    back: '',
    qrcode:'',
    subjectFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log('activity-option')
    console.log(option)
    this.setData({
      back: option.back || '',
    });
    var userInfo = wx.getStorageSync('miniProgramUserinfo') || '';
    var share = option.share || '' // 获取邀请码
    var qrId = option.scene || '' // 获取扫描二维码进来的qrId
    console.log("获取二维码信息："+qrId)
    var data = {}
    // 获取识别二维码跳转过来传递的参数 drId
    if (qrId) {
      qrId = decodeURIComponent(qrId)
      console.log('qrId:' + qrId)
      this.setData({
        qrId: qrId,
        option: option
      })
      this.getQRcode(this.data.qrId, this.data.option)
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _this = this
    // 获取红包优惠券名称
    app.ajax.postApi('internalCoupon').then(res => {
      if (res.data.subjectNo){
        _this.setData({ 
          subjectNo: res.data.subjectNo ,
          subjectFlag:true
        })
      }else{
        wx.showToast({
          title: '获取编号失败',
          duration: 2000,
          icon: 'none'
        })
      }
      wx.hideLoading()
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
    let that=this
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
    // 判断是否二维码进来的
    //end
    if (!userInfo) {
      if (this.data.qrId) {
        console.log("无信息")
        this.getQRcode(this.data.qrId, this.data.option).then(function(){
          console.log("异步获取")
          console.log('二维码获取：' + that.data.share)
          url = url + `?inviteCode=${that.data.share}&fromType=activity`
          wx.reLaunch({
            url
          })
          console.log("测试url:" + url)
        })
      }
      return
    } else {
      console.log("有信息--" + url)
      this.setData({
        userInfo
      })
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
          var str = res.data.scenc
          var query = getQueryString(str)
          console.log(str)
          this.setData({
            share: query.share || option.share || '', //读取二维码邀请码
          })
          console.log('测试邀请码：' + this.data.share)
          resolve(res)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  hideMask(){
    this.setData({
      showMammon:false,
      hideBom:true
    })
  },
  // 去首页
  goIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 分享
  shareActivity(){
    this.setData({
      acFlag:false
    })
    //请求接口获取分享图
    wx.showLoading({
      title: '加载推广信息...',
      mask: true
    })
    var { uid, inviteCode } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('getActivityQrcode', {
      scene: `share=${inviteCode}`,
      page: 'pages/activity/activity',
      width: 300,
      uid,
    }).then(({
      data: res
    }) => {
      wx.hideLoading()
      //console.log(res.data)
      if (res.status == '1') {
        this.setData({
          qrcode:res.data
        })
      } else {
        wx.showToast({
          title: res.statusDetail,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  // 关闭分享图
  promotionClose(){
    this.setData({
      acFlag: true
    })
  },
  //保存图片到相册，提示保存成功
  savePhoto() {
    let that = this
    let str = this.data.qrcode//图片路径
    let shareImgUrl = 'https://' + str.split("://")[1]
    wx.downloadFile({
      url: shareImgUrl,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '分享图已保存到手机，分享保存的图片到朋友圈即可',
              icon: "none",
              duration: 2000
            })
          }
        })
      }
    })
  },
  /**
   * 展示财神弹窗
   * */
  getMammon() {
    let _this = this
    let { mobile, token } = wx.getStorageSync('miniProgramUserinfo')
    if(this.data.subjectFlag){
      app.ajax.postApi('getSubjectAppInternal', {
        mobile,
        token,
        subjectNo: _this.data.subjectNo
      }).then(res => {
        let resData = res.data
        if (resData.status == 1) {
          this.setData({ showMammon: true, hideBom: false })
        } else {
          wx.showToast({
            title: resData.statusDetail,
            mask: true,
            icon: "none"
          })
        }
      })
    }else{
      wx.showToast({
        title: '活动编号不能为空',
        duration: 2000,
        icon: 'none'
      })
    }
  }
})