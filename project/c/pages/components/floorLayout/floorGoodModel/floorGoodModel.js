const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  properties: {
    good: {
      type: Object,
      value: {}
    },
    // 楼层编号
    floorType: {
      type: Number,
      value: 0
    },
    // 是否返利 0-不展示返利 1-展示返利
    rebateStatus: {
      type: Number,
      value: 0
    }
  },
  attached: function () {},
  methods: {
    // 商品详情-分享
    goodDetail: function (e) {
      let share = e.currentTarget.dataset.share || false
      let good = e.currentTarget.dataset.good   
      let productNo = good.productNo
      let activityNo = good.activityNo || ''
      let isActivity = activityNo ? 1 : 0
      let url = '/pages/detail/detail?productNo=' + productNo + '&isActivity=' + isActivity + '&activityNo=' + activityNo
      console.log('测试：'+url)
      // 推广
      if (share) {
        url = url + '&share=1'
      }
      wx.navigateTo({
        url
      })
    },
    // 抢购
    snapUp(e) {
      let good = e.currentTarget.dataset.good
      let userChooseGoods = [{
        virtualPrice: good.originPrice || good.virtualPrice || '', //商品划线价格
        rebateStatus: this.data.rebateStatus, // 是否返利
        quantity: "1", // 商品数量
        fromNo: good.activityNo || '', // 活动编号
        rebates: good.rebate,
        isCrossBorder:good.isCrossBorder,
        qualityProduct: {
          isActivity: good.activityNo ? 1 : 0, // 是否是活动商品
          productNo: good.productNo, // 商品id
          price: good.price || good.buyingPrice, // 商品价格
          productName: good.productName, // 商品名称
          mainImagePath: good.proImage, // 商品对应的小icon
          viceTitle: good.viceTitle || ''// 二级标题
        }
      }]
      // 缓存购买商品的数据
      wx.setStorageSync('userChooseGoods', userChooseGoods)
      wx.navigateTo({
        url: '/pages/order/confirmOrder/confirmOrder?fromPage=Detail',
      })
    },
    jump (e) {
      if (this.data.floorType =='7') {
        // 跳转订单结算
        this.snapUp(e)
      } else {
        // 跳转商品详情
        this.goodDetail(e)
      }
    }
  }
})
