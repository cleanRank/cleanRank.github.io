
// pages/components/floor-component.js
const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    listFloor: {
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型)
      value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) {
        this.initCurrent(newVal)
      }
    },
    scrollTop:{
      type:Number,
      value:0
    },
    closeVideo:{
      type:Boolean,
      value:false
    },
    headTop:{
      type:Number,
      value:0
    },
    time: {
      type: Number,
      value: 0
    },
    seckillStatus: {
      type: String,
      value: '0',//秒杀状态,1-已开始，0-未开始
    },
    ishowPromotion: {
      type: Boolean,
      value: false, // 是否隐藏推广，false-显示，true-隐藏
    },
    seckillIndex: {
      type: Number,
      value: 0,
    },
    newList: {
      type: Object,
      value: {},
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    token: "",
    uid: '',
    token: '',
    // 楼层版式
    imagetype: 1,//图片
    bannerType: 2,//轮播banner
    defaultType: 3,//单列商品
    packsType: 4,//大礼包，双列商品
    iconType: 5,//品牌模块
    sekillType: 6,//秒杀
    marketType: 16,
    current: 0,//banner
    bannerInd: 0,//banner右下角的下标
    //**************** banner start*************
    indexData: {},
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 500,
    // ********* banner end *******************
    seckillIndex: 0,//秒杀
    // seckillStatus: 0,//秒杀状态,1-已开始，0-未开始
    seckillScrollLeftValue: 0,//秒杀的滚动
    listFloor:[],
    scrollTop: 0, // 当前滚动的距离
    timer: null, // 计时器
  },
  attached:function(){
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化banner
    initCurrent: function (newVal, newSession) {
      this.setData({
        current: 0,
        bannerInd: 0
      })
      let newFloorList = newVal
      newFloorList.forEach((val, index) => {
        if (val.floorType == 6 && val.activityInfos.length>0) {
          let floorId = val.floorId
          val.activityInfos.forEach((_val, _index) => {
            _val.floorId = floorId
          })
        }
      })
      this.setData({
        listFloor: newFloorList
      })
    },
    onSlideChangeEnd: function (e) {
      this.setData({
        bannerInd: e.detail.current
      })
    },
    getUserInfo: function () {
      try {
        const value = wx.getStorageSync('miniProgramUserinfo')
        if (value) {
          //console.log(value['token'])
          this.setData({
            token: value['token'],
            uid: value['uid']
          })
        }
      } catch (e) { }
    },
    // 这里是一个自定义方法
    // banner/图片
    bannerCick: function (e) {
      let bannerinfo = e.currentTarget.dataset.bannerinfo
      let linkType = bannerinfo.linkType
      let isActivity = bannerinfo.isActivity
      let activityNo = bannerinfo.activityNo
      let floorLinkUrl = bannerinfo.floorLinkUrl
      let title = bannerinfo.picName
      // 0 商品 1 模板，结合linkUrl中的商品编号或模板编号
      if (linkType == "0" && floorLinkUrl) {
        wx.navigateTo({
          url: '/pages/detail/detail?productNo=' + floorLinkUrl + '&isActivity=' + isActivity + '&activityNo=' + activityNo,
        })
      } else if (linkType == '1' && floorLinkUrl) {  //模板
        let url = '/pages/index/activityPage/activityPage?versionid=' + floorLinkUrl
        // 红包特殊活动
        if (floorLinkUrl == '888') {
          url = '../../activityPages/pages/newYearRedEnvelop/newYearRedEnvelop'
        }
        wx.navigateTo({
          url
        })
      }
    },
    // 秒杀 //
    seckillPageClick: function (e) {
      var idx = e.currentTarget.dataset.idx
      var sekillstatus = e.currentTarget.dataset.sekillstatus
      this.setData({
        seckillStatus: sekillstatus
      })
      if (this.data.seckillIndex != idx) {
        this.sekillPageAutoScroll(idx, e.currentTarget.offsetLeft - e.detail.x * 0.5)
      } else {

      }
    },
    sekillPageAutoScroll: function (idx, x) {
      if (idx < 2) {
        this.data.seckillScrollLeftValue = 0
      } else {
        this.data.seckillScrollLeftValue = x
      }
      this.setData({
        seckillScrollLeftValue: this.data.seckillScrollLeftValue,
        seckillIndex: idx,
      })
    },
    // 秒杀商品
    productClickSekill: function (e) {
      this.productDetailSekill(e, '0')
    },
    promotionShowSekill: function (e) {
      this.productDetailSekill(e, '1')
    },
    productDetailSekill(e, showPro) {
      let info = e.currentTarget.dataset.info
      let id = e.currentTarget.dataset.id
      let productno = info.productNo
      //console.log(this.properties.listFloor) 
      let listfloor = this.properties.listFloor
      for (let index in listfloor) {
        let floorInfo = listfloor[index]
        // 错误写
        if (floorInfo && floorInfo.floorType == this.data.sekillType &&floorInfo.floorId==id) {//秒杀商品
          let activityInfos = floorInfo.activityInfos
          var isActivity = activityInfos[this.data.seckillIndex].status == 1 ? (info.remainderCount >= 1 ? '1' : '0') : '0'
          var activityNo = isActivity == 1 ? activityInfos[this.data.seckillIndex].activityNo : ''

          wx.navigateTo({
            url: '/pages/detail/detail?productNo=' + productno + '&isActivity=' + isActivity + '&activityNo=' + activityNo + '&share=' + showPro,
          })
          return
        }
      }
    },

    fourteenNav: function (e) {
      let linkType = e.target.dataset.linktype;
      console.log('类型：'+linkType)
      let linkUrl = e.target.dataset.linkurl;
      if (linkType == '0' && linkUrl){
        console.log(0)
        // 跳商品
        wx.navigateTo({
          url: '/pages/detail/detail?productNo=' + linkUrl + '&share=0',
        })
      } else if (linkType == '1' && linkUrl){
        console.log(1)
        // 跳活动
        wx.navigateTo({
          url: '/pages/index/activityPage/activityPage?versionid=' + linkUrl,
        })
      }
    },
    // 商品
    productClick: function (e) {
      console.log("商品")
      this.productDetail(e, '0')
    },
    // // 推广页面显示
    promotionShow(e) {
      this.productDetail(e, '1')
    },
    productDetail(e, showPro) {//showPro是否弹出推广窗口
      //console.log(e.currentTarget.dataset.productNo)
      let info = e.currentTarget.dataset.info
      let productno = info.productNo
      let isActivity = info.isActivity
      let activityNo = info.activityNo
      wx.navigateTo({
        url: '/pages/detail/detail?productNo=' + productno + '&isActivity=' + isActivity + '&activityNo=' + activityNo + '&share=' + showPro,
      })

    },
    // 直购或者加车-秒杀商品
    putShopCartOrBuySekill: function (e) {
      //console.log(e.currentTarget.dataset)
      let status = e.currentTarget.dataset.status
      let info = e.currentTarget.dataset.info
      let id = e.currentTarget.dataset.id
      let listfloor = this.properties.listFloor
      for (let index in listfloor) {
        let floorInfo = listfloor[index]
        if (floorInfo && floorInfo.floorType == this.data.sekillType && floorInfo.floorId==id) {//秒杀商品
          let activityInfos = floorInfo.activityInfos
          var isActivity = activityInfos[this.data.seckillIndex].status == 1 ? (info.remainderCount >= 1 ? '1' : '0') : '0'
          var activityNo = isActivity == 1 ? activityInfos[this.data.seckillIndex].activityNo : ''
          info.activityNo = activityNo
          try {
            const value = wx.getStorageSync('miniProgramUserinfo')
            if (value) {
              //console.log(value['token'])
              this.setData({
                token: value['token'],
                uid: value['uid']
              })
              if (status == 0) {// 跳转商品详情
                let productNo = info.productNo
                wx.navigateTo({
                  url: '/pages/detail/detail?productNo=' + productNo
                })
                // this.callAddShopCartFn(productNo, activityNo) 
              }
              else if (status == 1) {//直购
                this.toBuy(info, true)
              }
            }
          } catch (e) { }
        }
      }
    },


    // 直购或者加车-普通商品
    putShopCartOrBuy: function (e) {
      //console.log(e.currentTarget.dataset)
      let status = e.currentTarget.dataset.status
      let info = e.currentTarget.dataset.info
      try {
        const value = wx.getStorageSync('miniProgramUserinfo')
        if (value) {
          //console.log(value['token'])
          this.setData({
            token: value['token'],
            uid: value['uid']
          })
          if (status == 0) {//加车
            let productNo = info.productNo
            let activityNo = info.activityNo
            this.callAddShopCartFn(productNo, activityNo ? activityNo : '')
          }
          else if (status == 1) {//直购
            this.toBuy(info, false)
          }
        }
      } catch (e) { }

    },
    // 加入购物车
    callAddShopCartFn(productNo, activityNo) {

      //console.log(activityNo)

      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      app.ajax.postApi('addShoppingCart', {
        uid: this.data.uid,
        token: this.data.token,
        productNo: productNo,
        activityNo: activityNo,
      }).then(({
        data: res
      }) => {
        wx.hideLoading()
        if (res.status === "1") {
          wx.showToast({
            title: '加入购物车成功',
            duration: 2000,
            icon: 'none'
          })
          this.setData({
            shopCartNum: this.data.shopCartNum + 1
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
    // 直购,isSekill是否是秒杀
    toBuy(info, isSekill) {
      this.getUserInfo()
      // 秒杀商品要判断是否已抢完
      if (info.remainderCount == 0) {//请求接口
        app.ajax.postApi('ProductDetailShowMini', {
          uid: this.data.uid,
          token: this.data.token,
          productNo: info.productNo,
          isActivity: 0,
          activityNo: null,
        }).then(res => {
          wx.hideLoading()
          var res = res.data
          if (res.status == 1) {
            // 成功
            // 处理数据
            var data = res.data
            var userChooseGoods = [{

              rebateStatus: this.data.ishowPromotion == false ? 1 : 0,
              quantity: "1",
              fromNo: '', // 活动no
              rebates: data.rebate,//返利
              isCrossBorder: info.isCrossBorder,
              qualityProduct: {
                isActivity: 0, // 是否是活动商品
                productNo: info.productNo, // 商品id
                price: data.jdPrice,
                productName: info.productName, // 产品名称
                mainImagePath: info.proImage, // 产品对应的小icon
                viceTitle: info.words || info.viceTitle || ''
              }
            }]
            // 缓存购买商品的数据
            wx.setStorageSync('userChooseGoods', userChooseGoods)
            wx.navigateTo({
              url: '/pages/order/confirmOrder/confirmOrder?fromPage=Detail'
            })
          } else {
            // 失败提示
            // wx.showToast({
            //   title: res.statusDetail,
            //   duration: 2000
            // })
          }
        })


      } else {

        let productNo = info.productNo
        let activityNo = info.activityNo
        let isActivity = info.isActivity

        var userChooseGoods = [{
          virtualPrice: isSekill ? info.originPrice : (info.isActivity == '1' ? (info.virtualPrice ? info.virtualPrice : info.price) : ''),//划线
          rebateStatus: this.data.ishowPromotion == false ? 1 : 0,
          quantity: "1",
          fromNo: activityNo || '', // 活动no
          rebates: info.rebate,//返利
          isCrossBorder: info.isCrossBorder,
          qualityProduct: {
            isActivity: (isSekill ? 1 : (isActivity || 0)), // 是否是活动商品
            productNo, // 商品id
            price: info.buyingPrice ? info.buyingPrice : (info.activityPrice ? info.activityPrice : info.price), //要先判断是否抢光，remainderCount, 商品单价-buyingPrice,大礼包-price
            productName: info.productName, // 产品名称
            mainImagePath: info.proImage, // 产品对应的小icon
            viceTitle: info.viceTitle || ''
          }
        }]
        // 缓存购买商品的数据
        wx.setStorageSync('userChooseGoods', userChooseGoods)
        wx.navigateTo({
          url: '/pages/order/confirmOrder/confirmOrder?fromPage=Detail'
        })
      }
    },
    pauseVideo(e){
      let detail=e.detail
      this.setData({
        playIndex:{
          'pre':detail.pre,
          'curr':detail.curr
        }
      })
    }
  }
})
