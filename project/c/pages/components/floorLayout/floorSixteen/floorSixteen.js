// pages/components/floorLayout/floorSixteen/floorSixteen.js
const app = getApp()
Component({
  options:{
    multipleSlots: true //在组件定义时的选项启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    floorData: {
      type: Object,
      value: {},
      observer: function (newVal,oldVal) {
        this.initFloorData(newVal)
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _item:{},
    marketType: 16, //营销活动版式
    clickStart:true
  },
  attached: function() {},
  pageLifetimes: {
    show: function() {
      // 页面被展示
      this.setData({
        clickStart:true
      })
    },
    hide: function() {
      // 页面被隐藏
      this.setData({
        clickStart:true
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化数据
    initFloorData: function (newVal, newSession) {
      this.setData({
        _item: newVal
      })
    },
    bannerClick: function (e) {
      let that = this
      if(that.data.clickStart){
        let bannerinfo = e.currentTarget.dataset.bannerinfo
        let linkType = bannerinfo.bannerJumpType || bannerinfo.linkType
        let isActivity = bannerinfo.isActivity
        let activityNo = bannerinfo.activityNo
        let floorLinkUrl = bannerinfo.bannerContent || bannerinfo.LinkUrl
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
      setTimeout(function() {
        that.setData({
          clickStart:false
        })
      })
      
    }

  }
})
