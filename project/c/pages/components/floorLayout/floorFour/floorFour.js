const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  properties: {
    floorData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.initFloorData(newVal)
      }
    },
  },
  data: {
    _item: {},
    token: "",
    uid: '',
    packsType: 4,//大礼包，双列商品
  },
  attached: function () { },
  methods: {
    //初始化数据
    initFloorData: function (newVal, newSession) {
      this.setData({
        _item: newVal
      })
    },
    // 商品
    productClick: function (e) {
      this.productDetail(e, '0')
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
              url: '/pages/order/confirmOrder/confirmOrder?fromPage=Detail',
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
          url: '/pages/order/confirmOrder/confirmOrder?fromPage=Detail',
        })
      }
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

    }
  }
})