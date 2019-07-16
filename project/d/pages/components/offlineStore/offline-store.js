// components/offline/offline-store.js
import {
  formatTimeAmt,
  buttonClicked
} from '../../../utils/util.js'
const app = getApp()
Component({
  /**
   * 组件属性
   */
  properties: {},
  data: {
    banner: '',
    buttonClicked: false,
    activityBanner: [],
    vipBanner: [],
    discountList: ['特价','折扣','满减'],
    items: [{
      name: '自由购',
      img: '/images/main/hp_icon_zy.png',
      path: '/pages/assistPackage/freeBuy/freeBuy'
    }, {
      name: '扫码购',
      img: '/images/main/hp_icon_sm.png',
      path: '/pages/assistPackage/scanCodeBuy/scanCodeBuy'
    }, {
      name: '领券中心',
      img: '/images/main/hp_icon_lq.png',
      path: '/pages/assistPackage/ticketCenter/ticketCenter'
    }],
    list: [],
    ticketInfoNoUse: [], //首页首次进入页面弹框
    close: true
  },
  // 组件生命周期
  lifetimes: {
    created() {
      let shopCode = app.globalData.shopCode
      if (!shopCode) {
        this.getMinimumListByDistance()
      }
      // shopCode ? this.init() : this.getMinimumListByDistance()
      // this.init()

    }
  },
  pageLifetimes: {},
  methods: {
    init() {
      let shopId = app.globalData.shopInfo.shopId
      if (shopId || shopId == 0) {
        this.getTicketList()
      }
      if (shopId) {
        this.getBannerByShopId(shopId)
        this.selectActivityBanner(shopId)
        this.queryHot(shopId)
      } else {
        // this.selectBannerListByType(5)
      }
      this.selectBannerListByType(4)
    },
    toFreeBuy(e) {
      if (!this.data.buttonClicked) {
        buttonClicked(this)
        let item = e.currentTarget.dataset.list;
        app.$http.getParent({
          childId: item.categoryId
        }).then(res => {
          let list = {
            firstId: res.result[0].categoryId,
            secondId: res.result[1] ? res.result[1].categoryId : 0,
            skuId: item.skuId
          }
          wx.navigateTo({
            url: '/pages/assistPackage/freeBuy/freeBuy?list=' + JSON.stringify(list)
          })
        })
      }
    },
    $Toast(msg) {
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000
      })
    },
    // 重新定位门店
    refreshLocation() {
      wx.removeStorageSync('city');
      wx.removeStorageSync('cityCode');
      this.getMinimumListByDistance(1)
    },
    // 引导用户开启定位授权
    openSetting() {
      wx.showModal({
        title: '温馨提示',
        content: '获取定位失败，请前往设置打开定位权限',
        success(res) {
          if (res.confirm) {
            wx.openSetting({
              fail: function () {
                console.log('openSetting.failed')
              }
            })
          }
        }
      })
    },
    //根据经纬度定位门店
    getMinimumListByDistance(type = 0) {
      let _this = this
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          app.$http.getMinimumListByDistance({
            latitude: res.latitude,
            longitude: res.longitude,
            distance: -1,
            size: 1,
            type: 1,
            cityCode: 0,
            cityName: ''
          }).then(res => {
            if (res.appCode === 'S0000' && res.result.length) {
              _this.triggerEvent('onLocate', {
                shopInfo: res.result[0]
              })
            }
          }).catch(res => {
            _this.triggerEvent('onLocate', {
              shopInfo: ""
            })
          })
        },
        fail(res) {
          if (type == 1) {
            _this.openSetting()
          }
        }
      })
    },
    sanCode(e) {
      let _this = this
      wx.scanCode({
        success: (res) => {
          if (res.scanType == 'WX_CODE') { // 小程序码
            if (res.path) {
              let arr = res.path.split('=')
              if (arr.length > 1) {
                _this.getStoreInfoByCode(arr[1])
              }
            } else {
              _this.$Toast('请扫描门店二维码')
              return false
            }
          }
        },
        fail: () => {}
      })
    },
    // 扫码定位店铺
    getStoreInfoByCode(code) {
      app.$http.getStoreInfoByCode({
        shopCode: code
      }).then(res => {
        if (res.result) {
          this.triggerEvent('onLocate', {
            shopInfo: res.result
          })
        }
      }).catch(res => {})
    },
    // 当存在shopId时获取店铺banner
    getBannerByShopId(id) {
      app.$http.getBannerByShopId({
        shopId: id
      }).then(res => {
        this.setData({
          banner: res.result
        })
      }).catch(res => {})
    },
    // 获取类型banner
    selectBannerListByType(type) {
      app.$http.selectBannerListByType({
        advtypeId: type
      }).then(res => {
        if (type == 5) {
          this.setData({
            banner: [...this.data.banner, ...res.result]
          })
        } else {
          this.setData({
            vipBanner: res.result[0] || ''
          })
        }
      }).catch(res => {})
    },
    // 活动banner图片
    selectActivityBanner(id) {
      app.$http.selectActivityBanner({
        shopId: id
      }).then(res => {
        this.setData({
          activityBanner: res.result || []
        })
      }).catch(res => {})
    },
    // 获取热销商品
    queryHot(id) {
      app.$http.recommend({
        shopId: id,
        // limit: 6,
        // timeFlag: 'TIMERANGE',
        // timeRange: 'DAY_30'
      }).then(res => {
        this.setData({
          list: res.result
        })
      }).catch(res => {})
    },
    //首页每天首次进入页面时优惠券展示
    getTicketList() {
      app.$http.getTicketInfo({
        shopId: app.globalData.shopInfo.shopId,
        oncePerDay: true
      }).then(res => {
        let canUseTicketList = []
        res.result.forEach((x, i) => {
          x.ticketGroupVoFrontList.forEach((v, i) => {
            if (i < 5 && v.acquireStatus == 0) {
              v.beginDate = formatTimeAmt(Number(v.beginDate), 'yyyy.MM.dd')
              v.endDate = formatTimeAmt(Number(v.endDate), 'yyyy.MM.dd')
              if (v.ticketType == 9) {
                if ((v.discountValue * 10).toString().length > 1) {
                  v.discountValue = (v.discountValue * 10).toFixed(1)

                } else {
                  v.discountValue = (v.discountValue * 10)
                }
              }
              canUseTicketList.push(v)
            }
          })
        })
        this.setData({
          ticketInfoNoUse: canUseTicketList
        })
        this.triggerEvent("showToast", {
          showToast: this.data.ticketInfoNoUse.length
        });
      }).catch(res => {})
    },
    //进入领券中心
    goMyTicket() {
      wx.navigateTo({
        url: '/pages/assistPackage/ticketCenter/ticketCenter'
      })
      this.setData({
        close: false
      })
    },
    //关闭优惠券列表弹层
    closeModel() {
      this.setData({
        close: false
      })
      this.triggerEvent("showToast", {
        showToast: false
      });
    }
  },
})