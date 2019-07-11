const app = getApp()
var WxParse = require('../../detail/wxParse/wxParse.js')
import { getQueryString } from '../../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    articleId:'',
    articleCon:'',
    goodSwiper: { //商品轮播
      cur: 0, // 改变当前索引
      index: 1 // 当前索引
    },
    shareImg:'',
    smallImg:'',
    backFlag:0,
    ifHaveData: false,
    promotionData:{
      shareImg:''
    },
    nodataList: {
      imgSrc: '../../../images/noData/noCon.png',
      isShowbtn: 0,
      jumpUrl: '',
      btnTxt: '还没有内容哦~',
      btnTxtTwo: ''
    },
    promotionFlag: false // 推广弹窗
  },
  onLoad(option) {
    console.log('detail-option')
    console.log(option)
    var userInfo = wx.getStorageSync('miniProgramUserinfo') || ''
    var share = option.share || option.inviteCode || '' // 获取邀请码
    var qrId = option.scene || '' // 获取扫描二维码进来的qrId
    var data = {} 
    let id = option.id || ''
    // 获取识别二维码跳转过来传递的参数 drId
    if (qrId) {
      qrId = decodeURIComponent(qrId)
      console.log('qrId:' + qrId)
      this.setData({
        qrId: qrId,
        option: option
      })
    } else {
      this.setData({
        backFlag: option.back || 0,
      })
    }
    this.setData({
      share: share,
    })
    this.setData({
      articleId:id,
      resource: option.resource || ''
    })
  },
  onShow(){
    if (this.data.qrId || this.data.backFlag) {
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
    if (userInfo) {
      this.setData({
        userInfo
      })
    }
    if (this.data.qrId) {
      // qrId存在就获取详情的商品信息
      this.getQRcode(this.data.qrId, this.data.option).then((res) => {
        if (res.status == '1') {
          if (!userInfo) {
            var url = `/pages/start/start?fromType=finding&id=${this.data.articleId}&backflag=1`
            if (this.data.share) {
              url = url + `&inviteCode=${this.data.share}`
            }
            wx.reLaunch({
              url
            })
            return
          }
          // 获取详情信息
          this.setData({
            backFlag: 1
          })
          this.getDetail()
        }
      })
    } else {
      if (!userInfo) {
        console.log("yaoqingma:" + wx.getStorageSync('miniProgramUserinfo').inviteCode)
        var url = `/pages/start/start?fromType=finding&inviteCode=${this.data.share}&id=${this.data.articleId}&backflag=1`
        wx.reLaunch({
          url
        })
        return
      }
      // 获取详情信息
      this.getDetail()
    }
  },
  onHide() {
  },
  // 推广弹窗隐藏 组件接受操作
  promotionClose(e) {
    var flag = e.detail.flag
    this.setData({
      promotionFlag: flag
    })
  },
  // 获取分享码
  getShare(){
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.ajax.postApi('GetArticleShare', {
      uid,
      token,
      id: this.data.articleId
    }).then(res => {
      wx.hideLoading()
      if(res.data.status==1){
        this.setData({
          shareImg: res.data.data.sharePic,
          smallImg: res.data.data.sharePic4send,
          promotionFlag: true,
          promotionData: {
            shareImg: res.data.data.sharePic
          }
        })
      }
    })
  },
  onShareAppMessage(option) {
    let userInfo = wx.getStorageSync('miniProgramUserinfo') || '';
    var path = `pages/finding/detail/detail?id=${this.data.articleId}&inviteCode=${userInfo.inviteCode}&back=1`
    return {
      title: this.data.articleCon.title,
      path: path,
      imageUrl: `${this.data.smallImg}`
    }
  },
  // 跳转商品详情页
  proDetail(e){
    let info = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '/pages/detail/detail?productNo=' + info.productNo + '&isActivity=' + (info.isActivity ? info.isActivity : 0) + '&activityNo=' + (info.activityNo ? info.activityNo : '')
    })
  },
  // 商品轮播图片监听数量
  goodSwiperChang(e) {
    let current = e.detail.current
    let source = e.detail.source
    let that = this
    if (source == 'touch') {
      this.setData({
        "goodSwiper.index": current + 1,
      })
    }
  },
  getDetail(){
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    app.ajax.postApi('GetArticleDetail', {
      uid,
      token,
      id:this.data.articleId
    }).then(res => {
      wx.hideLoading()
      if(res.data.status==1){
        this.setData({
          articleCon:res.data.data,
          ifHaveData:false
        })
        let content = res.data.data.content.replace(/="http:/g, '="https:')
        let _content = content.replace(/font-size:\s\d+px/g, function (wrod) {
          return 'font-size:' + ((wrod.split('font-size:')[1].trim().split('px')[0])*2) + 'rpx'
        })
        WxParse.wxParse('article', 'html', _content, this, 0);
        // 点击分享进来就直接请求分享码
        if (this.data.resource == 'share') {
          this.getShare()
        }
      }else{
        this.setData({
          ifHaveData:true
        })
      }
    })
  },
  // 通过qrId获取详细的商品信息
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
            share: option.share || query.share || '',
            articleId: option.id || query.id || ''
          })
          resolve(res)
        }
      })
    })
  }
})