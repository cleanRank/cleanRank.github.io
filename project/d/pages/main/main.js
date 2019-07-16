//index.js
// 12.24 跳转商品详情：
// pages / detail / detail ? productNo = sxyp1540007583489 & isActivity=0 & activityNo=
//获取应用实例
const app = getApp()
Page({

  data: {
    nav: [{
        name: '休闲驿站'
      }
      // , {name: '水象优品'}
    ],
    flag: 0, // 当前页面展示对象
    shopInfo: '', // 当前店铺信息
    currentIndex: 0, // 当前tabNav指针,
    showToast: false,
  },
  onShow: function (options) {
    if (app.globalData.shopInfo.shopId != this.data.shopInfo.shopId) {
      this.setData({
        shopInfo: app.globalData.shopInfo
      })
      if (app.globalData.shopInfo.shopId) {
        this.reInit()
      }
    } else {
      this.setData({
        shopInfo: app.globalData.shopInfo
      })
    }
  },
  onLoad: function () {},
  onHide: function () {},
  // 子组件触发定位门店事件
  onLocate(e) {
    this.setData({
      flag: e.detail.flag ? e.detail.flag : 0,
      shopInfo: e.detail.shopInfo
    })
    app.globalData.shopInfo = e.detail.shopInfo
    this.reInit()
  },
  // 跳转附近门店
  selectNearStore(e) {
    let dis;
    if (this.data.shopInfo) {
      dis = 0
    } else {
      dis = 3000
    }
    wx.navigateTo({
      url: `/pages/assistPackage/nearbyStore/nearbyStore?distance=${dis}&size=100`
    })
  },
  showToast(e) {
    this.setData({
      showToast: e.detail.showToast,
    })
  },
  // 提示方法上海职场默认2秒
  toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  // 搜索商品事件
  navigatorToSearch(e) {
    if (!this.data.shopInfo.shopId) {
      this.toast('请先定位店铺')
      return false
    }
    if (this.data.currentIndex == 0) { // 跳转至线下搜索页
      wx.navigateTo({
        url: '/pages/assistPackage/searchGoods/searchGoods'
      })
    } else { // 跳转至线上搜索页
      wx.navigateTo({
        url: ''
      })
    }
  },
  // 门店更换重新拉载数据
  reInit() {
    this.selectComponent("#offlineStore").init()
  },
  // 刷新定位门店
  reBindFresh() {
    this.selectComponent("#offlineStore").refreshLocation()
  },
  // 线上线下模块切换
  changeTab(e) {
    let id = e.currentTarget.dataset.id
    if (id == this.data.currentIndex) {
      return false
    }
    this.setData({
      flag: 1,
      currentIndex: e.currentTarget.dataset.id
    })
  }
})