
var WxParse = require('../detail/wxParse/wxParse.js')
import { computed } from '../../utils/vuefy.js'
import { getQueryString } from '../../utils/util.js'
import { before, min } from '../../utils/underscore.js';
var _ = require('../../utils/underscore.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    wxUserInfo: {},
    shopCartNum: 0,
    productNo: '',
    copyProductNo: '',
    goodInfo: {},
    stagesFlag: false, //sku显示隐藏
    entryType: 0,
    isActive: false,
    isGrayBtn: false, //置灰下单按钮
    promotionFlag: false, // 推广弹窗
    promotionData: {},
    time: { //秒杀商品
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    timer: null,
    goodFlag: true,
    query: {},
    sceneData: {},
    backFlag: 0,
    goodSwiper: { //商品轮播
      cur: 0, // 改变当前索引
      index: 1 // 当前索引
    },
    goodsComments: [],
    quantity: 1, // 购买数量
    maxQuantity: -1,
    bIntroduction: false,// 商品图文详情
    pageName:'商品详情',
    videoContent:{},//视频对象
    showPlay:true,//控制播放按钮显示与否
    videoConr:false,//播放器控制按钮
    posterImg:'',//视频封面图
    showBg:false,//流量确认
    outVideo:false,
    move:'',
    swiperNum: true,
    videoMark:false,
    pageNo:1,
    pageSize:10,
    detail_address:'',
    address_flag:false,
    checkAddresAble:true,
    address_list_flag:false,
    addreList:[],
    addressList: {
      addProvince: '',
      addProvinceCode: '',
      addCity: '',
      addCityCode: '',
      addCounty: '',
      addCountyCode: '',
      addTown: '',
      addTownCode: '',
      consignee: '',
      consigneeMobile: ''
    },
    nodataList: {
      imgSrc: '../../images/noData/blank_adress_icon.png',
      text: '暂时还没有收货地址哦~',
      jumpUrl: '',
    },
    nolocation:false,
    detail_eq:0,
    promoteShow:false,
    promoteCommonWrap: true //秒杀  限时购描述文案
  },
  onLoad(option) {
    console.log('detail-option')
    console.log(option)
    var userInfo = wx.getStorageSync('miniProgramUserinfo') || ''
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
        // productNo: 'sxyp1558317023978',
        // productNo: 'sxyp1558682373654',
        isActivity: option.isActivity ? option.isActivity : 0,
        activityNo: option.activityNo || ''
      }
      this.setData({
        productNo: data.productNo,
        copyProductNo: qrId ? data.productNo : option.productNo,
        backFlag: option.back || 0,
        query: {
          productNo: data.productNo,
          isActivity: data.isActivity,
          activityNo: data.activityNo
        }
      })
    }
    this.setData({
      share: share,
      showPlay:true,
      videoConr:false,
      videoContent: wx.createVideoContext('myVideo', this)
    })
    // 计算属性 按钮是否置灰
    computed(this, {
      isClickNextBtn: function () {
        const { cannotsale } = this.data.goodInfo
        return cannotsale && cannotsale != '0' || this.data.isGrayBtn
      },
      // 库存
      inventory: function () {
        const { jdState, state,productStock} = this.data.goodInfo
        if ((jdState != '1' || state != '1' || productStock == '0') && Object.keys(this.data.goodInfo).length > 0) {
          return false
        } else {
          return true
        }
        
      }
    })

    // fromPage页
    let pages = getCurrentPages();
    try{
      let prevPage = pages[pages.length - 2]
      let info = prevPage.data
      this.setData({
        fromPag: info.pageName || ''
      })
    }catch(err){

    }
    
    wx.removeStorageSync('ifChooseAdd')
  },
  onShareAppMessage (option) {
    var price = '【仅需'+parseFloat(this.data.goodInfo.jdPrice || 0)+'元】'
    var path = `pages/detail/detail?productNo=${this.data.productNo}&isActivity=${this.data.query.isActivity}&activityNo=${this.data.query.activityNo}&inviteCode=${this.data.userInfo.inviteCode}&back=1`
    return {
      title: price + this.data.goodInfo.productName,
      path: path,
      imageUrl: `${this.data.goodInfo.imageList[0].videoUrl ? this.data.goodInfo.imageList[1].imagePath : this.data.goodInfo.imageList[0].imagePath}?x-oss-process=image/resize,m_fixed,h_400,w_500/quality,q_100`
    }
  },
  onShow () {
    if (this.data.qrId || this.data.backFlag){
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
    this.onLine()
    // 查询用户信息
    var userInfo = wx.getStorageSync('miniProgramUserinfo') || ''
    if (userInfo) {
      this.setData({
        userInfo
      })
      // 获取购物车数量
      this.getShoppingCart()
    }
    if (this.data.qrId) {
      // qrId存在就获取详情的商品信息
      this.getQRcode(this.data.qrId, this.data.option).then((res) => {
        if (res.status == '1') {
          if (!userInfo) {
            var url = `/pages/start/start?fromType=detail&productNo=${this.data.productNo}&isActivity=${this.data.query.isActivity}&activityNo=${this.data.query.activityNo}`
            if (this.data.share) {
              url = url + `&inviteCode=${this.data.share}`
            }
            wx.reLaunch({
              url
            })
            return
          }
          // 获取商品信息
          this.setData({
            backFlag: 1
          })
          this.getGoodData(this.data.query)
          this.getNewAddadress()
        }
      })
    } else {
        if (!userInfo) {
          console.log("yaoqingma:" + wx.getStorageSync('miniProgramUserinfo').inviteCode)
          var url = `/pages/start/start?fromType=detail&productNo=${this.data.productNo}&isActivity=${this.data.query.isActivity}&activityNo=${this.data.query.activityNo}&inviteCode=${this.data.query.inviteCode}`
          wx.reLaunch({
            url
          })
          return
        }
        // 获取商品信息
        this.getGoodData(this.data.query)
        this.getNewAddadress()
    }
    // 直接弹窗
    if (this.data.share == '1') {
      this.promotionShow()
    }
  },
  onHide () {
    // this.setData({
    //   showPlay:true,
    //   videoConr:false,
    //   outVideo: false,
    //   videoMark:false
    // })
    // this.data.videoContent.stop();
  },
  swipAni(e){
    let detail=e.detail
    let that=this
    if (detail.current == 0 && detail.source == 'touch') {
        that.setData({
          showPlay: true,
          outVideo: false,
          videoConr: false
        })
    }
  },
  //新增地址获取
  getNewAddadress(){
    let addressFrom = wx.getStorageSync('addressFrom')
    let ifClickAdd = wx.getStorageSync('ifChooseAdd')
    let addressinfo = wx.getStorageSync('addressInfo')
    // addressinfo.userid = userInfo.uid
    // addressinfo.userid=userInfo.uid
    if (addressFrom && addressFrom == 2 && addressinfo && ifClickAdd == 1) {
      this.setData({
        detail_address: addressinfo.addProvince + addressinfo.addCity + addressinfo.addCounty + (addressinfo.addTown || '') + (addressinfo.addDetail || '')
      })
      //回显订单接收地址
      wx.setStorageSync('selectedAddress', addressinfo)
      this.newAddressCheck(addressinfo)
    } else {
      this.checkAdress()
    }
    wx.setStorageSync('detail_eq', 0)
  },
  // 商品轮播图片监听数量
  goodSwiperChang (e) {
    let current = e.detail.current
    let source = e.detail.source
    let that=this
    if(source=='touch'){
      this.setData({
        "goodSwiper.index": current + 1,
      })
    }
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
            productNo: query.productNo,
            copyProductNo: this.data.qrId ? query.productNo : option.productNo,
            share: option.share || query.share || '',
            query: {
              productNo: query.productNo,
              isActivity: query.isActivity,
              activityNo: query.activityNo
            }
          })
          resolve(res)
        }
      })
    })
  },
  //视频缓存
  videoWait(e){
    if(e.timeStamp>10*1000){//缓存超过10秒视为卡顿
      wx.showToast({
        title: '网络不流畅',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //视频出错
  videoErro(e){
    let that = this;
    wx.showToast({
      title: '网络不给力，请重试！',
      icon: 'none',
      duration: 2000
    })
    that.setData({
      showPlay: true,
      videoConr: false,
      outVideo:false,
      move: 'return false'
    })
  },
  //播放器播放
  videoPlay(){
    let that=this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if(res.networkType != 'wifi'){
           that.setData({
             showBg:true
           })
        }else{
          that.setData({
            showPlay: false,
            videoConr: true,
            showBg:false,
            outVideo:true,
            move:'return false',
            swiperNum:false,
            videoMark:true
          })
          that.data.videoContent.play()
        }
      }
    })
  },
  //检查wifi环境确认播放
  surePlay(){
    let that=this;
    that.setData({
      showBg:false,
      outVideo:true,
      showPlay:false,
      videoConr: true,
      move:'return false',
      swiperNum:false,
      videoMark:true
    })
    that.data.videoContent.play()
  },
  videoOut(){
    let that = this;
    that.data.videoContent.stop()
    // that.data.videoContent.seek(0)
    that.setData({
      videoContent: wx.createVideoContext('myVideo', that),
      showBg: false,
      outVideo: false,
      showPlay: true,
      videoConr: false,
      move:'',
      swiperNum:true,
      videoMark:false
    })
  },
  // 推广弹窗显示
  promotionShow() {
    let that = this
    wx.showLoading({
      title: '加载推广信息...',
      mask: true
    })
    var activityNo = that.data.query.activityNo || that.data.activityNo 
    var isActivity = that.data.query.isActivity || that.data.isActivity 
    app.getUserToken.getToken().then(res => {
      var res = res
      if (res.status == 1) {
        var { uid, inviteCode } = wx.getStorageSync('miniProgramUserinfo')
        app.ajax.postApi('GetMiniShareProductInfo', {
          scenc: `productNo=${this.data.query.productNo}&isActivity=${isActivity}&activityNo=${activityNo}&share=${inviteCode}`,
          page: 'pages/detail/detail',
          width: 300,
          uid,
          productNo: this.data.productNo,
          isActivity: isActivity,
          activityNo: activityNo
        }).then(({
          data: res
        }) => {
          wx.hideLoading()
          //console.log(res.data)
          if (res.status == '1') {
            res.data.imInstalment = app.globalData.imInstalment == 1?true:false
            this.setData({
              promotionData: res.data
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
      }
    })
  },
  // 推广弹窗隐藏 组件接受操作
  promotionClose(e) {
    var flag = e.detail.flag
    this.setData({
      promotionFlag: flag
    })
  },
  onHide() {
    // 隐藏spu
    this.setData({
      stagesFlag: false,
      move:'',
      // videoOut:false,
      // showPlay: true,
      // videoConr: false,
      swiperNum:true,
      // videoMark:false
    })
    // this.data.videoContent.stop();
  },
  checkCxShow(){
    if(this.data.goodInfo.promoteSaleList && this.data.goodInfo.promoteSaleList.length > 0){
      let productList = this.data.goodInfo.promoteSaleList
      if(productList.length == 1 && (productList[0].activityType == 1 || productList[0].activityType == 4 )&&!productList[0].activityDesc){
        this.setData({
          promoteCommonWrap: false
        })
      }
    }
  },
  // 拉去商品信息
  getGoodData(data) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var userInfo= wx.getStorageSync('miniProgramUserinfo') || ''
    var data = {
      productNo: this.data.productNo,
      isActivity: this.data.isActive ? 0 : this.data.query.isActivity,
      activityNo: this.data.isActive ? '' : this.data.query.activityNo
    }
    if (userInfo) {
      var { uid, token} = userInfo
      data.uid = uid
      data.token = token
    }
    return app.ajax.postApi('ProductDetailShowMini', {
      ...data  
    }).then(({
      data: res
    }) => {
      if (res.status == '1') {
        let minBuyCnt = res.data.minBuyCnt
        this.setData({
          quantity: minBuyCnt
        })
        if(minBuyCnt > 1){
          this.setData({
            startSellFlag: true
          })
        }
        var {
          diffSes,
          isActivity,
          currentSpu,
          spu,
          promoteSaleActivityList
        } = res.data
        // 视频封面取图片第一张
        if (res.data.imageList.length > 1 && res.data.imageList[0].videoUrl){
          this.setData({
            posterImg: res.data.imageList[1].imagePath
          })
        } else{
          this.setData({
            posterImg: ''
          })
        }
        var jdPrice2 = ""
        // 当前选中的商品id对应的spu
        res.data.curSkuProNo = []
        // 当前选中的商品sku对应的索引
        res.data.curSkuProNoIndex = []
        res.data.diffSes = (diffSes && diffSes != '') ? diffSes : 0
        if (isActivity == 1) {
          jdPrice2 = res.data.jdPrice
          res.data.jdPrice = res.data.activityPrice
          res.data.jdPrice2 = jdPrice2
        }
        var currentSpuCopy = currentSpu && currentSpu.split('、')
        if(currentSpuCopy){
          spu.map((value, index) => {
            value.saleAttrList.map((val, idx) => {
              if (currentSpuCopy.indexOf(val.saleValue) > -1) {
                val.selected = true
                res.data.curSkuProNo.push(val.productNos)
                res.data.curSkuProNoIndex.push(idx)
              }
            })
          })
        }
        // 促销大于三个 取前三个
        if(promoteSaleActivityList && promoteSaleActivityList.length > 0){
          if(promoteSaleActivityList.length > 3){
            var promoteSaleList = promoteSaleActivityList.slice(0,3)
          }else {
            var promoteSaleList = promoteSaleActivityList
          }
          res.data.promoteSaleList = promoteSaleList
        }
        // spu促销优惠
        if(promoteSaleActivityList && promoteSaleActivityList.length > 0){
          var spuPromote =null
          promoteSaleActivityList.forEach((item,index) => {
            // if(item.activityType == 7){
            //   spuPromote = {}
            //   spuPromote.spuPromotePro = item
            //   console.log(spuPromote)
            // }else if(item.activityType == 5){
            //   spuPromote = {}
            //   spuPromote.spuPromotePro = item
            //   console.log(spuPromote)
            // }else if(item.activityType == 6){
            //   spuPromote = {}
            //   spuPromote.spuPromotePro = item
            //   console.log(spuPromote)
            // }
            if(item.activityType == 7 || item.activityType ==4 || item.activityType ==1){
              spuPromote = Object.assign({},item)
            }
          })
          this.setData({
            spuPromote
          })
          console.log('spuPromote')
          console.log(spuPromote)
        }else{
          this.setData({
            spuPromote:null
          })
        }
        
        // 计算默认选择的sku,其余的哪些sku不能选择
        this.calceSkuNotChoose(res.data, currentSpuCopy)
        this.setData({
          goodInfo: res.data,
        })
        if(!this.data.isActive){
          this.setData({
            query: {
              productNo: res.data.productNo,
              isActivity: res.data.isActivity || (res.data.promoteSaleActivityList.length > 0 && res.data.promoteSaleActivityList[0].activityNo?1:0) || 0,
              activityNo: res.data.activityNo || (res.data.promoteSaleActivityList.length > 0 && res.data.promoteSaleActivityList[0].activityNo?res.data.promoteSaleActivityList[0].activityNo:'') || ''
            },
          })
        }
        this.getComments()
        this.checkCxShow()
        setTimeout(() => {
          wx.hideLoading()
        }, 100)
      }
    }).then(() => {
      var {
        diffSes
      } = this.data.goodInfo
      if (diffSes && diffSes > 0) {
        // 如果倒计时id存在，则先清除倒计时，再开启新的倒计时
        if (this.data.time) {
          clearInterval(this.data.timer)
        }
        this.data.timer = setInterval(() => {
          diffSes--
          this.setData({
            "goodsInfo.diffSes": diffSes
          })
          this.countDown(diffSes)
        }, 1000)
      } else {
        if (this.data.timer) {
          clearInterval(this.data.timer)
        }
      }

      //埋点
      let sensorsObj = this.getSenObj()
        app.sensors.track('productDetail',{
        upSource:this.data.fromPag,                  //前向来源
        productId: this.data.productNo,              //商品ID
        productName:this.data.goodInfo.productName,  //商品名称
        categoryName:this.data.goodInfo.categoryName,               //商品一级分类
        upCategoryName:this.data.goodInfo.upCategoryName,           //商品二级分类
        productPrice: this.data.goodInfo.jdPrice,             //商品单价
        storeId:'',                  //店铺ID
        storeName:'',                //店铺名称
        starName:'',                 //网红名称
        starId:'',                   //网红ID
        productTitle:this.data.goodInfo.viceTitle,             //商品标题
        rebates: Number(this.data.goodInfo.rebate) || 0,      //返利金额
        isCrossBorderProduct:this.data.goodInfo.isCrossBorder != 0,  //是否海淘商品
        isActivityProduct: this.data.goodInfo.activityNo  && this.data.goodInfo.activityNo.length > 0 ? true : false,   //是否活动商品
        isSeckillProduct:  this.data.goodInfo.diffSes != 0,      //是否秒杀
        isSearch: this.data.fromPag == '搜索',                //是否搜索
        partnerOrNot: sensorsObj.partnerOrNot,
        partnershipLevel:sensorsObj.partnershipLevel,
        platform_type:"小程序"
      })
      this.checkCxShow()
    })
    
  },
  
  // 计算sku哪些不能选择
  calceSkuNotChoose(spuData, currentSpuCopy) {
    const { spu, curSkuProNo } = spuData
    if(spu){
      spu.map((val, idx) => {
        val.saleAttrList.map((_item, index) => {
          let curSkuProNoList = []
          if (_.indexOf(currentSpuCopy, _item.saleValue) > -1) {
            return false
          }
          let productNos = _item.productNos.split(',')
          // 把当前选中的sku对应的数组存起来，以为二维数组的形式存放
          curSkuProNo.map((v, i) => {
            if (idx == i) {
              return false
            }
            curSkuProNoList.push(v.split(','))
          })
          // 只有当前属性和所有选中的sku能匹配出来productNo，判定为可以选择
          let intersectionArr = _.intersection(productNos, ...curSkuProNoList)[0]
          if (!(intersectionArr && intersectionArr.length > 0)) {
            _item.isNotExit = true
          }
        })
      })
    }
    
    return spuData
  },
  // 倒计时
  countDown(countTime) {
    if (countTime == 0) {
      this.getGoodData(this.data.query)
    }
    let time = {}
    time.hours = parseInt(countTime / (60 * 60)) >= 10 ? parseInt(countTime / (60 * 60)) : '0' + parseInt(countTime / (60 * 60))
    time.minutes = parseInt(countTime / 60 % 60) >= 10 ? parseInt(countTime / 60 % 60) : '0' + parseInt(countTime / 60 % 60)
    time.seconds = parseInt(countTime % 60) >= 10 ? parseInt(countTime % 60) : '0' + parseInt(countTime % 60)
    this.setData({
      time
    })
  },
  // 显示spu选择页面
  showSpuChooseTab(e) { 
    let that = this
    let type = e.currentTarget.dataset.type
    let inventory = e.currentTarget.dataset.inventory || 0
    // 地区不支持
    if (this.data.address_flag){
      return
    }
    if (type) {
      this.setData({
        entryType: 1
      })
    } else {
      if (inventory && !this.data.inventory) {
        return
      }
      this.setData({
        entryType: 0
      })
    }
    this.setData({
      stagesFlag: true,
    })
    that.checkActivity(type)
    wx.removeStorageSync('addressFrom')
  },
  //立即购买type=0,判断活动提示语
  checkActivity(type){
    let that = this
    if (!that.data.spuPromote || !that.data.spuPromote.discountRuleList) return
    let activity_num = that.data.spuPromote.discountRuleList[0].discountType //活动件数
    let activity_desc = that.data.spuPromote.discountRuleList[0].ruleDesc  //活动描述
    let activity_price = that.data.spuPromote.discountRuleList[0].discountThreshold  //活动金额
    let quantity = that.data.quantity //数量
    console.log("活动金额:" + activity_price + ",活动件数：" + activity_num)
    // if (type == 0) {
      if (quantity < activity_num) {
        console.log("不满足")
        that.setData({
          ruleDesc: `购${activity_num}件立享【满${activity_price}元任选${activity_num}件】`
        })
      } else {
        console.log("满足")
        that.setData({
          ruleDesc: `已满${activity_num}件，仅需支付${activity_price}元`
        })
      }
    // }
  },
  // 隐藏spu
  closeSpu() {
    this.setData({
      stagesFlag: false
    })
  },
  // 切换sku
  chooseSku(e) {
    var spuIndex = e.currentTarget.dataset.index
    var skuIndex = e.currentTarget.dataset.idx
    var pruductNoList = e.currentTarget.dataset.productnos
    let isGrayBtnFlag = false  // 判定spu弹框下面的按钮是否可以点击的标志
    let isUserChooseNotExit = false
    let curSkuProNoList = []
    let firstJoin = false
    var { spu, curSkuProNo } = this.data.goodInfo
    curSkuProNo.splice(spuIndex, 1, pruductNoList)
    // 点击的时候，当前纬度的sku为选中状态，其余sku 取消选中状态
    spu[spuIndex]['saleAttrList'].map((val, index) => {
      if (index == skuIndex) {
        val.selected = true
        val.isNotExit = false
      } else {
        //  val.isNotExit = false
        val.selected = false
      }
      spu[spuIndex]['saleAttrList'].splice(index, 1, val)

    })
    // 把选中所有sku对应的productNo取出来赋值给curSkuProNoList
    curSkuProNo.map((curVal, idx) => {
      if (curVal != '') {
        curSkuProNoList.push(curVal.split(','))
      }
    })
    // 把所有选中的状态取出来，然后取交集
    const intersectionArr = _.intersection(...curSkuProNoList)
    setTimeout(() => {
      spu.map((val, idx) => {
        let arrSkuProNoList = []
        let isChooseSelected = false
        val.isClearUserChoose = false  // 判断是否显示红色tips的标志
        // 如果没有交集，则把当前数组赋值给选中的sku数组列表
        if (!(intersectionArr && intersectionArr.length > 0)) {
          arrSkuProNoList.push(spu[spuIndex].saleAttrList[skuIndex].productNos.split(','))
        } else {
          curSkuProNo.map((v, i) => {
            if (idx == i || v == '') {
              return false
            }
            arrSkuProNoList.push(v.split(','))
          })
        }
        val.saleAttrList.map((_item, index) => {
          let saleAttrList = _item.productNos.split(',')
          // 如果spu的纬度和当前循环到的纬度一样，则直接return 回去
          if (spuIndex == idx) {
            return false
          }
          // 首先判断当前选中的几个sku是否有交集如果没有,则其余的纬度都显示error信息
          if (!(intersectionArr && intersectionArr.length > 0)) {
            val.isClearUserChoose = true
            _item.selected = false
            if (!firstJoin) {
              firstJoin = true
              curSkuProNoList = [pruductNoList.split(',')]
            }
          }
          // 判断当前sku与已经选中的数据是否有交集(已经选中的sku，需要排除当前纬度)
          let curProNo = _.intersection(...arrSkuProNoList, saleAttrList)[0]
          /**
           * 如果selected是true代表是当前选中状态
           * 需要判断用户选中的这个sku对应productNo，
           * 是否在其他spu的sku对应的productno中有交集
           * 如果没有则这个属性的外边框变成虚线，然后提示用户请选择属性
           */
          // 当前sku对应的productNos
          let isSelected = !!(_item.selected && (curProNo && curProNo.length > 0))
          _item.selected = isSelected
          if (_item.selected) {
            isChooseSelected = _item.selected
          }
          // 当前属性需要和除本纬度以外所有选中的属性进行取交集操作，如果能取出来那代表可以选择
          if (curProNo) {
            _item.isNotExit = false
          } else {
            _item.isNotExit = true
            _item.selected = false
          }
          val.saleAttrList.splice(index, 1, _item)
        })
        // 如果当前纬度没有选中的状态，那么判定当前需要显示红色error信息, 并且底部的btn置灰不能点击
        if (!isChooseSelected && idx != spuIndex) {
          this.data.goodInfo.curSkuProNo.splice(idx, 1, "")
          val.isClearUserChoose = true
          isGrayBtnFlag = true
        }
        if (val.isClearUserChoose && !isUserChooseNotExit) {
          isUserChooseNotExit = true
        }
        spu.splice(idx, 1, val)
        this.setData({
          'goodInfo.spu': spu,
          isGrayBtn: isGrayBtnFlag
        })
      })
      if (!isUserChooseNotExit) {
        // 三个属性取交集，然后重新渲染页面
        const productNos = this.intersectionArr()
        // 取出来数组交集的productNo通知父级组件
        this.chooseSpu(productNos)
      }
    }, 0)
  },
  // 选中sku以后调用productdetailshowspujd接口，重新渲染页面
  chooseSpu(productNo) {
    if (productNo && productNo != '') {
      this.setData({
        productNo: productNo
      })
      if (productNo == this.data.copyProductNo) {
        this.setData({
          isActive: false
        })
      } else {
        this.setData({
          isActive: true
        })
      }
      this.getGoodData()
    }
  },
  // 判断是否只选中啦一个spu
  checkOneSku() {
    let num = 1
    const { curSkuProNo } = this.data.goodInfo
    curSkuProNo.map((val, index) => {
      if (val == '') {
        num++
      }
    })
    return num
  },
  // 该函数是在提交代码的时候取出来交集用的
  intersectionArr(pruductNoList) {
    let curSpu = []
    this.data.goodInfo.curSkuProNo.map((val, index) => {
      curSpu[index] = val.split(',')
    })
    // 判断当前选中的几个spu是否都有值
    const chooseNum = this.checkOneSku()
    // 数组取交集 如果选中的数组只有刚才用户点击的有值，那么直接把用户选中的spu返回去，否则取交集
    const productNos = _.intersection(...curSpu)[0]
    if (chooseNum == 1) {
      return productNos
    } else {
      return [pruductNoList.split(',')]
    }
  },
  callConfirmOrder() {
    if (!this.data.isClickNextBtn || !this.data.inventory) {
      if (this.data.entryType) {
        // 加入购物车
        this.callAddShopCartFn()
      } else {
        //获取优惠金额
        this.getDiscount()
      }
    } 
  },
  //获取优惠金额
  getDiscount(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if(this.data.spuPromote){
      activityNo = this.data.spuPromote.activityNo
    }
    let {
      productNo,
      activityNo,
    } = this.data.goodInfo
    app.ajax.postApi('GetProductDiscount', {
      productNo: productNo,
      activityNo: activityNo || '',
      count: this.data.quantity
    }).then(({
      data: res
    }) => {
      wx.hideLoading()
      if (res.status == 1) {
        // 立即购买
        this.confirmOrder(res.data.discountPrice)
      }else{
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      } 
    })
  },
  // 立即下单
  confirmOrder(val) {
    let {
      jdPrice,
      productName,
      productNo,
      isActivity,
      activityNo,
      currentSpu,
      cannotsale,
      is7ToReturn,
      virtualPrice,
      rebateStatus,
      rebate,
      productStock,
      isCrossBorder
    } = this.data.goodInfo
    if (this.data.goodInfo.cannotsale != 0) {
      wx.showToast({
        title: '已售罄，暂时无法加入购物车',
        duration: 2000,
        icon: 'none'
      })
      return false
    }
    if(this.data.quantity > this.data.goodInfo.productStock){
      wx.showToast({
        title:'库存不足',
        duration: 1500,
        icon: 'none'
      })
      return false
    }
    if(this.data.spuPromote && this.data.spuPromote.activityNo){
      activityNo = this.data.spuPromote.activityNo
    }
    var userChooseGoods = [{
      quantity: this.data.quantity,
      spu: currentSpu || '',
      fromNo: activityNo || '', // 活动no
      is7ToReturn, // 商品是否支持退换货
      virtualPrice,
      rebateStatus,
      rebates: rebate,
      productStock: productStock,
      isCrossBorder, // =1跨境商品
      qualityProduct: {
        isActivity: isActivity || 0, // 是否是活动商品
        productNo, // 商品id
        price: jdPrice, // 商品单价
        productName, // 产品名称
        mainImagePath: this.data.goodInfo.mainImagePath, // 产品对应的小icon
        viceTitle: this.data.goodInfo.words || this.data.goodInfo.viceTitle
      }
    }]
    // 缓存购买商品的数据
    wx.setStorageSync('userChooseGoods', userChooseGoods)
    wx.navigateTo({
      url: '/pages/order/confirmOrder/confirmOrder?fromPage=Detail&discountPrice='+val,
    })
  },
  // 立即购买
  immedatPay() {
    if (!this.data.inventory) {
      return false
    }
    const {
      spu
    } = this.data.goodInfo
    if (spu.length === 0) {
      // cannotsale 3[没有图片] 4[gateway返回不可以卖]
      if (this.data.goodInfo.cannotsale != 0) {
        wx.showToast({
          title: '库存不足，请重新选择',
          duration: 2000,
          icon: 'none'
        })
        return false
      }
      this.confirmOrder()
      return false
    }
    this.setData({
      entryType: 0,
      stagesFlag: true
    })
  },
  // 去购物车
  goShopCart () {
    wx.removeStorageSync('addressFrom')
    wx.switchTab({
      url: '/pages/shopCart/shopCart'
    })
  },
  // 请求添加购物车
  callAddShopCartFn() {
    // var that = this
    if(this.data.quantity > this.data.goodInfo.productStock){
      wx.showToast({
        title:'库存不足',
        duration: 1500,
        icon: 'none'
      })
      return false
    }
    app.getUserToken.getToken().then(res => {
      var res = res
      if (res.status == 1) {
        var productNo = this.data.productNo
        var activityNo = this.data.goodInfo['activityNo'] || ''
        var {
          uid,
          token
        } = wx.getStorageSync('miniProgramUserinfo')
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        console.log(this.data.spuPromote)
        if(this.data.spuPromote){
          activityNo = this.data.spuPromote.activityNo
        }
        app.ajax.postApi('addShoppingCart', {
          uid,
          token,
          productNo: productNo,
          activityNo: activityNo || '',
          quantity: this.data.quantity
        }).then(({
          data: res
        }) => {
          console.log(res)
          wx.hideLoading()
          if (res.status == 1) {
            wx.showToast({
              title: '加入购物车成功',
              duration: 2000,
              icon: 'none'
            })
            this.setData({
              shopCartNum: this.data.shopCartNum + this.data.quantity
            })
          } else {
            wx.showToast({
              title: res.statusMessage,
              duration: 2000,
              icon: 'none'
            })
          }
        })
      }
    })
  },
  // 查询购物车数量
  getShoppingCart () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var userInfo = wx.getStorageSync('miniProgramUserinfo')
    var { uid, token } = userInfo
    app.ajax.postApi('QueryShoppingCart', {
      uid,
      token
    }).then(({
      data: res
    }) => {
      if (res.status == "1" && res.data && res.data.productList) {
        var shopCatProductList = res.data.productList
        var totalQuantity = 0
        res.data.productList.forEach((item) => {
          totalQuantity += item.quantity
        })
        this.setData({
          shopCartNum: totalQuantity
        })
      }
    })
  },
  // 修改购买数量
  changeQuantity (e) {
    var type = e.currentTarget.dataset.type
    var num = e.currentTarget.dataset.num
    if (type) {
      // 加
      if (this.data.quantity < this.data.goodInfo.productStock) {
        if (this.data.quantity >= this.data.goodInfo.userCount) {
          this.setData({
            maxQuantity: this.data.quantity
          })
          wx.showToast({
            title: '不能再添加更多',
            duration: 1500,
            icon: 'none'
          })
          return
        }
      } else {
        this.setData({
          maxQuantity: this.data.quantity
        })
        wx.showToast({
          title: '库存不足',
          duration: 1500,
          icon: 'none'
        })
        return
      }
    } else {
      // 减
      if(this.data.quantity <= this.data.goodInfo.minBuyCnt) {
        return
      }
    }
    this.setData({
      quantity: this.data.quantity + (+num)
    })
    this.checkActivity(0)
  },
  // 查询评论接口
  getComments () {
    app.ajax.postApi('selectTwoComment', {
      productNos: `'${this.data.productNo}'`
    }).then(({
      data: res
    }) => {
      if (res.status == 1) {
        this.setData({
          sumCount: res.data.sumCount,
          goodsComments: res.data.productComments,
          feedbackRate: res.data.feedbackRate
        })
      }
    })
  },
  // 跳转商品评论列表
  tapCommentList () {
    wx.navigateTo({
      url: "/pages/detail/commentList/commentList?productNos='" + this.data.productNo+"'",
    })
  },
  // 获取商品图文详情
  getGraphicDetails () {
    if (this.data.bIntroduction) {
      return
    }
    app.ajax.postApi('productImgText', {
      productNo: this.data.productNo
    }).then(({
      data: res
    }) => {
      if (res.status == 1) {
        this.setData({
          bIntroduction: true
        })
        WxParse.wxParse('article', 'html', res.data.introduction, this, 0);
      }
    })
  },
  // 去优惠商品列表
  promoteGoodsList(e){
    let info = e.currentTarget.dataset.info
    let url = `/pages/detail/preferGoodsList/preferGoodsList?activityNo=${info.activityNo}`
    wx.navigateTo({
      url
    })
  },
  // 上拉加载图文
  onReachBottom: function () {
    this.getGraphicDetails()
  },
  onLine() {
    let userInfo = wx.getStorageSync('miniProgramUserinfo');
    let ysf = {
      title: '在线客服',
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      config: JSON.stringify({
        "level": 1,  // vip等级
        "data": JSON.stringify([
          { "key": "avatar", "value": userInfo.avatarUrl },
          { "key": "mobile_phone", "value": userInfo.mobile },
          { "key": "real_name", "value": userInfo.nickName }
        ])
      })
    }
    this.setData({
      ysf
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
      partnerOrNot,
      partnershipLevel
    }
    return senObj;
  },
  //获取默认地址
  checkAdress(){
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let that=this
    if(!uid||!token) return
    wx.showLoading({
      title: '加载中...',
    })
    app.ajax.postApi('CheckAdress', {
       token,
       uid,
       productNo: this.data.productNo,
       pageNo:this.data.pageNo,
       pageSize:this.data.pageSize
    }).then(({
      data: res
    }) => {
      wx.hideLoading()
      // 支持配送
      if (res.status == 1) {
        let data=res.data
        this.setData({
          address_flag:false,
          checkAddresAble:true,
          detail_address: data.addProvince + data.addCity + data.addCounty + (data.addTown||'') + (data.addDetail||'')
        })
      }else if(res.status==27){ //不支持配送
        let data = res.data
        this.setData({
          address_flag:true,
          checkAddresAble:true,
          detail_address: data.addProvince + data.addCity + data.addCounty + (data.addTown||'') + (data.addDetail||'')
        })
      }else if(res.status==29){ 
        //发送地理位置，无收货地址
        this.setData({
          checkAddresAble:false
        })
        // this.checkSetting()
        this.getAddressLoc()
      }
    })
  },
  // 打开促销弹框
  promoteShow(){
    this.setData({
      promoteShow:true
    })
  },
  //切换地址
  address_tab(){
    let flag = this.data.checkAddresAble
    let detail_eq = wx.getStorageSync('detail_eq') || 0
    this.setData({
      detail_eq: detail_eq
    })
    console.log("状态："+flag)
    this.setData({
      address_list_flag:true
    })
    this.getaddreList()
  },
  //获取地址列表
  getaddreList(){
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    wx.showLoading({
      title: '加载中...',
    })
    app.ajax.postApi('addressqQueryList', {
      token,
      uid,
      pageNo: 1,
      pageSize:100
    }).then(({
      data: res
    }) => {
      wx.hideLoading()
      if (res.status == 1) {
         this.setData({
           addreList:res.data
         })
      }
    })
  },

  // 关闭促销弹框
  closePromote(){
    this.setData({
      promoteShow: false
    })
  },
  closeAddress(){
    this.setData({
      address_list_flag: false
    })
  },
  checkAddress(e){
    let addressNo = e.target.dataset.addressno
    let address = e.target.dataset.info
    let eq = e.target.dataset.index
    let that = this
    wx.setStorageSync('addressFrom', 1)
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    wx.showLoading({
      title: '校验中...',
    })
    app.ajax.postApi('checkAreaCanOrder', {
      token,
      uid,
      addressNo,
      productData: JSON.stringify([{
        "price": this.data.goodInfo.activityPrice ||  this.data.goodInfo.price || '',
        "productNo": this.data.goodInfo.productNo
      }])
    }).then(({
      data: res
    }) => {
      wx.hideLoading()
      if (res.status == 1) {
        that.setData({
          address_list_flag:false,
          address_flag:false,
          detail_address: address.addProvince + address.addCity + address.addCounty + (address.addTown||'') + (address.addDetail||'')
        })
        console.log('标志：'+that.data.address_list_flag)
        //回显订单接收地址
        wx.setStorageSync('selectedAddress', address)
        wx.setStorageSync('detail_eq', eq)
      }else{
        wx.removeStorageSync('detail_eq')
        wx.showToast({
          title: res.statusMessage,
          icon:'none',
          duration:2000
        })
      }
    })
  },
  //新增收货地址
  addressEditBtn(event) {
    //保存新增地址来源，1是新增地址页面，2是商品详情页
    wx.setStorageSync('addressFrom', 2)
    wx.navigateTo({
      url: '/pages/mine/address/newAddres/receivingaddress/receivingaddress',
    })
    this.setData({
      address_list_flag:false
    })
  },
  //省市联动后校验地址
  newAddressCheck(info){
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    wx.showLoading({
      title: '校验中...',
    })
    app.ajax.postApi('NewAddressCheck', {
      token,
      uid,
      productNo: this.data.productNo,
      addCityCode: info.addCityCode,
      addCountyCode:info.addCountyCode,
      addProvinceCode: info.addProvinceCode
    }).then(({
      data: res
    }) => {
      wx.hideLoading()
      if (res.status == 1) {
        this.setData({
          address_list_flag: false,
          address_flag:false,
          detail_address: info.addProvince + info.addCity + info.addCounty + (info.addTown||'') + (info.addDetail||'')
        })
      } else {
        this.setData({
          address_flag:true
        })
      }
    })
  },
  //经纬度获取地址
  getLocation(latitude, longitude){
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    wx.showLoading({
      title: '校验中...',
    })
    app.ajax.postApi('CheckUserNowLocation', {
      token,
      uid,
      coordinatesType:'gps',
      latitude: latitude,
      longitude: longitude,
      productNo: this.data.productNo
    }).then(({
      data: res
    }) => {
      wx.hideLoading()
      console.log('位置：'+JSON.stringify(res))
      if (res.status == 1) {
        this.setData({
          address_list_flag: false,
          address_flag: false,
          detail_address: res.data.addProvince + res.data.addCity + (res.data.addCounty||'') + (res.data.addTown||'') + (res.data.addDetail||'')
        })
      } else {
        this.setData({
          address_flag: true,
          detail_address: res.data.addProvince + res.data.addCity + (res.data.addCounty||'') +(res.data.addTown||'') + (res.data.addDetail||'')
        })
      }
    })
  },
  // 验证是否地理位置授权
  checkSetting(){
    let that = this
    wx.getSetting({
      success(res) {
        console.log("授权信息：" + JSON.stringify(res.authSetting))
        if (res.authSetting['scope.userLocation']){
          console.log("已授权："+JSON.stringify(res.authSetting))
          that.setData({
            nolocation: false
          })
          that.getAddressLoc()
        }else{
          console.log("未授权")
          that.setData({
            detail_address:'未获取到当前位置',
            address_flag:false,
            nolocation:true
          }) 
        }
      }
    })
  },
  // 获取地理位置信息
  getAddressLoc(){
    let that=this
    wx.showLoading({
      title: '位置信息加载中...',
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        wx.hideLoading()
        const latitude = res.latitude
        const longitude = res.longitude
        wx.setStorageSync("location", {
          latitude,
          longitude
        })
        that.setData({
          nolocation:false
        })
        that.getLocation(latitude, longitude)
      },
      fail(err){
        wx.hideLoading()
        that.setData({
          detail_address: '未获取到当前位置',
          address_flag: false,
          nolocation:true
        }) 
      }
    })
  }
})