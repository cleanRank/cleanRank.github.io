import {
  formatTimeAmt
} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usedActionTicketId: null, // 活动券
    usedCashTicketId: null, // 代金券
    usedDiscountTicketId: null, // 折扣券
    ticketInfo: [],
    disabledTicketList: [], //不可用优惠券,
    index1: 0,
    index2: 0,
    noSelectAction: false
  },
  modelShow(e) {
    let index = e.currentTarget.dataset.index
    let nowToggle1 = this.data.ticketInfo[index].isShow
    let ticketInfo = this.data.ticketInfo
    if (this.data.index1 !== index) {
      this.setData({
        [`ticketInfo[${this.data.index1}].isShow`]: false
      })
    }
    this.setData({
      [`ticketInfo[${index}].isShow`]: !nowToggle1
    })
    this.data.index1 = index
  },
  modelShow1(e) {

    let index = e.currentTarget.dataset.index
    let nowToggle1 = this.data.disabledTicketList[index].isShow
    let disabledTicketList = this.data.disabledTicketList
    if (this.data.index2 !== index) {
      this.setData({
        [`disabledTicketList[${this.data.index2}].isShow`]: false
      })
    }
    this.setData({
      [`disabledTicketList[${index}].isShow`]: !nowToggle1
    })
    this.data.index2 = index
  },
  // //不适用优惠券
  selectNoneCoupon() {
    this.setData({
      noSelectAction: true
    })
    if (this.data.noSelectAction) {
      this.setData({
        usedActionTicketId: null,
        usedCashTicketId: null,
        usedDiscountTicketId: null
      })
    }

  },
  // // 使用优惠券
  selectCoupon(e) {
    app.globalData.couponInfo.usedActionTicketId = null
    app.globalData.couponInfo.usedCashTicketId = null
    app.globalData.couponInfo.usedDiscountTicketId = null
    // 1:代金券 2：活动券 9：折扣券
    let item = e.currentTarget.dataset.list
    if (item.ticketType === 1) { //代金券  一个都不置灰，选择代金+活动 折扣置灰，选择代金+折扣 活动置灰
      this.setData({
        usedCashTicketId: this.data.usedCashTicketId === item.ticketId ? null : item.ticketId,
        noSelectAction: false
      })
    } else if (item.ticketType === 2 && item.isGray) { //活动券  选择后折扣置灰
      this.data.ticketInfo.forEach(v => {
        if (v.ticketType === 9) {
          v.isGray = false
        }
      })
      this.setData({
        usedDiscountTicketId: null,
        usedActionTicketId: this.data.usedActionTicketId === item.ticketId ? null : item.ticketId,
        ticketInfo: this.data.ticketInfo,
        noSelectAction: false
      })
      if (!this.data.usedActionTicketId) {
        this.data.ticketInfo.forEach(v => {
          v.isGray = true
        })
        this.setData({
          ticketInfo: this.data.ticketInfo
        })
      }
    } else if (item.ticketType === 9 && item.isGray) { //折扣券  选择后活动置灰
      let that = this
      that.data.ticketInfo.forEach(v => {
        if (v.ticketType === 2) {
          v.isGray = false
        }
      })
      that.setData({
        usedActionTicketId: null,
        usedDiscountTicketId: that.data.usedDiscountTicketId === item.ticketId ? null : item.ticketId,
        ticketInfo: that.data.ticketInfo,
        noSelectAction: false
      })
      if (!this.data.usedDiscountTicketId) {
        this.data.ticketInfo.forEach(v => {
          v.isGray = true
        })
        this.setData({
          ticketInfo: this.data.ticketInfo
        })
      }
    }
    if (!this.data.usedActionTicketId && !this.data.usedCashTicketId && !this.data.usedDiscountTicketId) {
      this.setData({
        noSelectAction: true
      })
    }

  },
  // 确定使用优惠券
  confirm() {
    app.globalData.ticketConfirm = true
    app.globalData.couponInfo['usedActionTicketId'] = this.data.usedActionTicketId || null
    app.globalData.couponInfo['usedCashTicketId'] = this.data.usedCashTicketId || null
    app.globalData.couponInfo['usedDiscountTicketId'] = this.data.usedDiscountTicketId || null
    wx.navigateBack({
      url: `/pages/assistPackage/confirmOrder/confirmOrder`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.actionConfirm = false
    app.globalData.ticketConfirm = false
    let usableActionTicketList = JSON.parse(options.usableActionTicketList)
    let usableCashTicketList = JSON.parse(options.usableCashTicketList)
    let usableDiscountTicketList = JSON.parse(options.usableDiscountTicketList)
    let disabledTicketList = JSON.parse(options.disabledTicketList)
    let ticketInfo = [...usableActionTicketList, ...usableCashTicketList, ...usableDiscountTicketList]
    this.setData({
      orderId: options.orderId,
      usedActionTicketId: app.globalData.couponInfo.usedActionTicketId,
      usedCashTicketId: app.globalData.couponInfo.usedCashTicketId,
      usedDiscountTicketId: app.globalData.couponInfo.usedDiscountTicketId,
      ticketInfo: ticketInfo,
      disabledTicketList: disabledTicketList
    })


    // 可用优惠券
    this.data.ticketInfo.forEach(v => {
      v.beginDate = formatTimeAmt(v.beginDate, 'yyyy.MM.dd')
      v.endDate = formatTimeAmt(v.endDate, 'yyyy.MM.dd')
      if (v.actionMemo) {
        v.actionMemo = v.actionMemo.split("\n")
      } else {
        v.actionMemo = []
      }
      v.isGray = true
      if (v.ticketType == 9) {
        if ((v.discountValue * 10).toString().length > 1) {
          v.discountValue = (v.discountValue * 10).toFixed(1)
        } else {
          v.discountValue = (v.discountValue * 10)
        }
      }
    })
    // 不可用优惠券
    this.data.disabledTicketList.forEach(v => {
      v.beginDate = formatTimeAmt(v.beginDate, 'yyyy.MM.dd')
      v.endDate = formatTimeAmt(v.endDate, 'yyyy.MM.dd')
      if (v.actionMemo) {
        v.actionMemo = v.actionMemo.split("\n")
      } else {
        v.actionMemo = []
      }
      if (v.ticketType == 9) {
        if ((v.discountValue * 10).toString().length > 1) {
          v.discountValue = (v.discountValue * 10).toFixed(1)
        } else {
          v.discountValue = (v.discountValue * 10)
        }
      }
    })
    this.setData({
      ticketInfo: ticketInfo,
      disabledTicketList: disabledTicketList,
      noSelectAction: true
    })
    if (this.data.usedActionTicketId || this.data.usedCashTicketId || this.data.usedDiscountTicketId) {
      this.setData({
        noSelectAction: false
      })
    }
  },
})