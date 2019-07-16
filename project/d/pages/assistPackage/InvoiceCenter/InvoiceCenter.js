// pages/fpages/discountPage/discountPage.js
import {
  formatTimeAmt
} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab1: 0,
    loadFlag: [false, false, false], //分页是否到底
    size: 10, // 每页条数
    page: 1, // 当前nav当前页码
    usedList:[],
    unUsedList:[],
  },
  clickTab1: function (e) {
    if (this.data.currentTab1 === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab1: e.target.dataset.current,
      })
      if (this.data.currentTab1==0) {
        this.setData({
          orderList: this.data.unUsedList
        })
      } else {
        this.setData({
          orderList: this.data.usedList
        })
      }
    }
  },
  openBill:function (e) {
    let id = e.currentTarget.dataset.id    
    wx.navigateTo({
      url: '/pages/assistPackage/receiverInfo/receiverInfo?orderId=' + id
    })
  },
  lookInvoice (e) {
    let id = e.currentTarget.dataset.id    
    wx.navigateTo({
      url: '/pages/assistPackage/InvoiceDetail/InvoiceDetail?orderId=' + id
    })
  },
  getUnused () {
    app.$http.getOrderInfoByBillFlag({
        page: this.data.page,
        param: 0,
        size: this.data.size
    }).then(res => { //获取未开发票列表
      this.setData({
        unUsedList: [...res.result.datas],
        orderList: [...res.result.datas]
      })
    }).catch(res => {})
  },
  getUsed () {
    app.$http.getOrderInfoByBillFlag({
        page: this.data.page,
        param: 1,
        size: this.data.size
    }).then(res => { //获取已开发票列表
      this.setData({
        usedList: [...res.result.datas]
      })
    }).catch(res => {})
  },
  toDetail: function (e) {
    let id = e.currentTarget.dataset.id    
    wx.navigateTo({
      url: '/pages/assistPackage/orderDetail/orderDetail?orderId=' + id
      // url: '/pages/assistPackage/orderDetail/orderDetail' 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.currentTab1 = 0
    this.getUnused()
    this.getUsed()
  }


})