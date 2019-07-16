// pages/fpages/ticketCenter/ticketCenter.js
import {
  formatTimeAmt
} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // ticketList: [], //活动名称下的优惠券列表
    ticketActivityNameList: [], //领券中心返回总数据
    index1: 0,
    index2: 0,
    actionTypeName: '' //活动名称
  },
  getTicket(e) { //点击立即领券
    app.$http.getCurrentTicket({
      ticketgroupId: this.data.ticketActivityNameList[e.currentTarget.dataset.ddid].ticketGroupVoFrontList[e.currentTarget.dataset.id].ticketgroupId
    }).then(res => {
      this.getTicketList()
    }).catch(res => {})

  },
  modelShow(e) { //点击规则显示隐藏
    let that = this;

    let ddid = e.currentTarget.dataset.ddid, //外层活动列表索引
      id = e.currentTarget.dataset.id, //内层优惠券索引
      nowToggle1 = this.data.ticketActivityNameList[ddid].ticketGroupVoFrontList[id].isShow,
      ticketList = this.data.ticketActivityNameList
    if (this.data.index1 != ddid && this.data.index2 != id || this.data.index1 == ddid && this.data.index2 != id || this.data.index1 != ddid && this.data.index2 == id) {
      this.setData({
        ['ticketActivityNameList[' + this.data.index1 + '].ticketGroupVoFrontList[' + this.data.index2 + '].isShow']: false,
      })
    }
    this.setData({
      ['ticketActivityNameList[' + ddid + '].ticketGroupVoFrontList[' + id + '].isShow']: !nowToggle1,
    })
    this.data.index1 = ddid
    this.data.index2 = id
  },
  getTicketList() { //获取领券中心的优惠券
    app.$http.getTicketInfo({
      shopId: app.globalData.shopInfo.shopId
    }).then(res => {
      if (res.appCode === "S0000") {
        // res.result ? res.result : this.data.ticketActivityNameList
        for (let j = 0; j < res.result.length; j++) {
          let ticketList = res.result[j].ticketGroupVoFrontList
          for (let i = 0; i < ticketList.length; i++) { //获取活动名称及活动下的优惠券列表，每个对象添加isShow属性，用来控制规则显示隐藏
            ticketList[i].isShow = false
            ticketList[i].beginDate = formatTimeAmt(ticketList[i].beginDate, "yyyy.MM.dd")
            ticketList[i].endDate = formatTimeAmt(ticketList[i].endDate, "yyyy.MM.dd")
            if (ticketList[i].actionMemo) {
              ticketList[i].actionMemo = ticketList[i].actionMemo.split("\n")
            } else {
              ticketList[i].actionMemo = []

            }
            if (ticketList[i].ticketType == 9) {
              if ((ticketList[i].discountValue * 10).toString().length > 1) {
                ticketList[i].discountValue = (ticketList[i].discountValue * 10).toFixed(1)

              } else {
                ticketList[i].discountValue = (ticketList[i].discountValue * 10)
              }
            }
          }
        }
        this.setData({
          ticketActivityNameList: res.result,
        })
      }
    }).catch(res => {})



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    this.setData({
      scroll_height: (windowHeight - 10) + 'px',
    })
    this.getTicketList()
  }



})