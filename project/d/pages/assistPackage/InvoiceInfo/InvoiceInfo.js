const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab1: 0,
    loadFlag: [false, false, false], //分页是否到底
    size: 8, // 每页条数
    page: [1, 1, 1], // 当前nav当前页码
    currentIndex:'',
    getUserInvoiceList:[],
    orderId:''
  },
  addBill: function () {
    wx.navigateTo({
      url: `/pages/assistPackage/receiverInfo/receiverInfo?isAddInvoice=2&orderId=`+this.data.orderId
    })
  },
  selectRise (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
      invoiceId: e.currentTarget.dataset.id
    })
  },
  selectInvoiceRise (e) {
    let id = e.currentTarget.dataset.id    
    wx.navigateTo({
      url: `/pages/assistPackage/receiverInfo/receiverInfo?isAddInvoice=3&invoiceId=${id}&orderId=${this.data.orderId}` 
    })
  },
  sureUse () {
    app.$http.printInvoiceByInvoiceId(JSON.stringify({invoiceId:this.data.invoiceId,orderId:this.data.orderId})).then(res => { //获取可用优惠活动
        
    }).catch(res => {})
    wx.navigateBack({
      url: `/pages/assistPackage/receiverInfo/receiverInfo?isAddInvoice=1` 
    })
  },
  init () {
    app.$http.getUserInvoiceList().then(res => { 
      this.setData({
        invoiceList: [...res.result.datas],
        invoiceId: res.result.datas[0].invoiceId
      })
    }).catch(res => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderId) {
      options.orderId = parseInt(options.orderId)
      this.setData({
        orderId: options.orderId
      })
    }
    this.data.currentTab1 = 0
    this.init()
  }


})