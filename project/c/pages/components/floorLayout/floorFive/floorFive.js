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
    iconType: 5,//品牌模块
  },
  attached: function () { },
  methods: {
    //初始化数据
    initFloorData: function (newVal, newSession) {
      this.setData({
        _item: newVal
      })
    },
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
    }
  }
})