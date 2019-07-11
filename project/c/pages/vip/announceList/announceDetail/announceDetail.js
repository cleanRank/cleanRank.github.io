//获取应用实例
const app = getApp()
var WxParse = require('../../../detail/wxParse/wxParse.js')
import { getQueryString } from '../../../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    origin:'',
    showShare:false,
    promotionData: {},
    announceData:{},
    contentNum:'',
    back:'',
    cid:'',
    createTime:'',
    backFlag: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    // 查询用户信息
    console.log("22222-" + JSON.stringify(option))
    console.log("22222-"+option.contentId)

    this.setData({
      showShare: false,
      contentNum: option.contentNum,
      number: option.number,
      back: option.back,
      cid: option.contentId,
      origin: option.origin//origin:floor代表楼层版式详情，origin:announce为公告详情
    });
    console.log("文章number：" + this.data.number)
    console.log('测试数据2:' +this.data.number)
    var userInfo = wx.getStorageSync('miniProgramUserinfo') || '';
    var share = option.share || '' // 获取邀请码
    var qrId = option.scene || '' // 获取扫描二维码进来的qrId
    var data = {}
    // 获取识别二维码跳转过来传递的参数 drId
    if (qrId) {
      qrId = decodeURIComponent(qrId)
      console.log('qrId:' + qrId)
      this.setData({
        qrId: qrId,
        option: option
      })
    } else {
      data = {
        productNo: option.productNo,
        isActivity: option.isActivity ? option.isActivity : 0,
        activityNo: option.activityNo || ''
      }
      this.setData({
        backFlag: option.back || 0,
        query: {
          productNo: data.productNo,
          isActivity: data.isActivity,
          activityNo: data.activityNo
        }
      })
    }
    this.setData({
      share: share
    })
    if(option.origin=='announce'){
      this.getDetail(option.contentId)
    }else{
      this.getDetail(option.contentNum || getApp().globalData.contentNum)
    }
  },
  onShow:function(){
    if (this.data.qrId || this.data.backFlag) {
      console.log('测试id:'+this.data.cid)
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
    var url = `/pages/start/start?id=` + this.data.cid + `&number=` + this.data.number
    console.log('地址：'+url)
    // 判断是否二维码进来的
    if (this.data.qrId) {
      this.getQRcode(this.data.qrId, this.data.option)
    }
    //end
    if (!userInfo) {
      console.log("无信息")
      if (this.data.share) {
        url = url + `&inviteCode=${this.data.share}`
      }
      wx.reLaunch({
        url
      })
      return
    }else{
      console.log("有信息--"+url)
      this.setData({
        userInfo
      })
      this.getShareImg()
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
          console.log(query.share)
          this.setData({
            share: option.share || query.share || '', //读取二维码邀请码
            number: option.number || query.contentNumber || '' //读取二维码内容number
          })
          resolve(res)
        }
      })
    })
  },
  toShare:function(){
    let that=this;
    that.setData({
      showShare:true
    })
  },
  // 推广弹窗隐藏 组件接受操作
  promotionClose(e) {
    var flag = e.detail.flag
    this.setData({
      showShare: flag
    })
  },
  // 获取公告内容详情
  getDetail:function(id){
    let that =this;
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.postApi('getArticleDetail', {
      contentId : id
    }).then(res => {
       wx.hideLoading();
       if(res.data.status==1){
         that.setData({
           announceData:res.data.data,
           createTime: res.data.data.createTime
         })
         wx.setNavigationBarTitle({
           title: res.data.data.designation
         })
         let content = res.data.data.detail.replace(/="http:/g, '="https:')
         let _content = content.replace(/font-size:\s\d+px/g, function (wrod) {
           return 'font-size:' + ((wrod.split('font-size:')[1].trim().split('px')[0]) * 2) + 'rpx'
         })
         WxParse.wxParse('article', 'html', _content , this, 0);
       }
    })
  },
  //获取版式详情
  getFloorDetail: function (id) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    var { uid } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('getFloorList', {
      contentNumber:that.data.contentNum
    }).then(res => {
      wx.hideLoading();
      if (res.data.status == 1) {
        that.setData({
          announceData: res.data,
          createTime: res.data.createTime.time
        })
        WxParse.wxParse('article', 'html', res.data.detail, this, 0);
      }
    })
  },
  // 点击推广获取分享图
  getShareImg:function(){
    wx.showLoading({
      title: '加载推广信息...',
      mask: true
    })
    var { uid } = wx.getStorageSync('miniProgramUserinfo')
    app.getUserToken.getToken().then(res=>{
      app.ajax.postApi('getFloorDetail', {
        uid: uid || '',
        contentNumber: this.data.number
      }).then(({
        data: res
      }) => {
        wx.hideLoading()
        if (res.status == '1') {
          this.setData({
            promotionData: res
          })
          this.setData({
            promotionFlag: true
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
  onShareAppMessage(option) {
    try{
      var inviteCode = app.globalData.weid || ''
    }catch(err){
      console.log(err)
    }
    var path = `pages/vip/announceList/announceDetail/announceDetail?fromType=announcedetail&inviteCode=` + inviteCode+`&origin=announce&contentNum=` + getApp().globalData.icd + `&back=1&contentId=` + this.data.cid + `&number=` + this.data.number
    console.log('分享地址：'+path)
    return {
      title: this.data.announceData.title,
      path: path,
      imageUrl: `${this.data.promotionData.smallImg}?x-oss-process=image/resize,m_fixed,h_400,w_500/quality,q_100`
    }
  },
  // 返回首页
  toIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})