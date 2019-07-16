//orderList.js
//订单列表js
import {
  formatTimeAmt
} from '../../../utils/util.js'
import {buttonClicked} from '../../../utils/util'
const app = getApp()
Page({
  data: {
    loadFlag: 0, // 是否可以下拉分页
    buttonClicked: false,
    params: {
      page: 0,
      size: 10,
      param: {
        payStatusList: [2, 3, 4],
        // shopId: app.globalData.shopInfo.shopId,
        shopId: '',
        sourceFrom: 3
      }
    },
    orderList: []
  },
  onShow: function () {
    this.data.params.page = 0
    this.setData({
      orderList: [],
      buttonClicked: false
    })
    this.getPageDetail()
  },
  onReachBottom () {
    if (!this.data.loadFlag) {
      this.getPageDetail()
    }
  },
  onHide: function () {
    // this.setData({
    //   params: {
    //     page: 0,
    //     size: 10,
    //     param: {
    //       payStatusList: [2, 3, 8],
    //       shopId: app.globalData.shopInfo.shopId,
    //       sourceFrom: 4
    //     }
    //   },
    //   orderList: []
    // })
  },
  // 提示方法上海职场默认2秒
  toast (msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  // 分页获取订单列表
  getPageDetail () {
    this.data.params.page = this.data.params.page + 1
    app.$http.pageDetail(this.data.params).then(res => {
      if (res.result && res.result.datas.length < this.data.params.size) {
        this.data.loadFlag = 1
      }
      res.result.datas.forEach(e => {
        e.gmtCreated = formatTimeAmt(e.gmtCreated, "yyyy-MM-dd HH:mm:ss")
      })
      this.setData({
        orderList: [...this.data.orderList, ...res.result.datas]
      })
    }).catch(res => {})
  },
  // 跳转订单详情
  goDetail (e) {
    if (!this.data.buttonClicked) {
      buttonClicked(this)
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/assistPackage/orderDetail/orderDetail?orderId=' + id
      })
    }
  },
  // 立即支付跳转支付页面
  pay (e) {
    let list = e.currentTarget.dataset.list
    wx.navigateTo({
      url: `/pages/assistPackage/pay/pay?orderId=${list.orderId}&amt=${list.realAmt}&type=1`
    })
  }
})

