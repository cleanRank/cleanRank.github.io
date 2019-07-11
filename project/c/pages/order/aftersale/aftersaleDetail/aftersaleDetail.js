const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aIndex:0,
    data:{},
    cancelModel:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let serviceOrderId = options.serviceOrderId
    this.setData({
      serviceOrderId
    })
    this.init()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 删除缓存在本地的地址信息
    try {
      wx.removeStorageSync('selectedAddress')
    } catch (e) {}
  },
  /**
   * 查看信息
   */
  init(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let { serviceOrderId } = this.data
    let formData = {
      uid,
      token,
      serviceOrderId
    }
    app.ajax.postApi('afterSaleProgressDetail', formData).then(({ data: res }) => {
      wx.hideLoading()
      if (res.status == 1) {
        var res = res.data
        this.setData({
          data:res
        })
      }else{
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      }

    })
  },
  /**
   * 查看物流
   */
  goToLog(){
    let serviceOrderId = this.data.data.serviceOrderId
    let url = `/pages/order/aftersale/logisticsDetail/logisticsDetail?orderId=${serviceOrderId}&type=4`
    wx.navigateTo({
      url
    })
  },
  /**
   * 寄送商品
   */
  send(){
    let serviceOrderId = this.data.serviceOrderId
    let url = '/pages/order/aftersale/sendMsg/sendMsg?serviceOrderId='+serviceOrderId
    wx.navigateTo({
      url
    })
  },
  /**
   * 进度查询
   */
  progress(){
    let serviceOrderId = this.data.serviceOrderId
    let progressLogList = JSON.stringify(this.data.data.progressLogList) 
    let url = '/pages/order/aftersale/progressDetail/progressDetail?serviceOrderId='+serviceOrderId+'&progressLogList='+progressLogList
    wx.navigateTo({
      url
    })
  },
  /**
   * 取消申请按钮
   */
  cancelApply(){
    this.setData({
      cancelModel:false
    })
  },
  /**
   * 取消
   */
  cancel(){
    this.setData({
      cancelModel:true
    })
  },
  /**
   * 确认
   */
  confirm(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let { serviceOrderId } = this.data
    let formData = {
      uid,
      token,
      serviceOrderId
    }
    app.ajax.postApi('afterSaleProgressCancel', formData).then(({ data: res }) => {
      wx.hideLoading()
      if (res.status == 1) {
        this.setData({
          cancelModel:true
        })
        wx.showToast({
          title: '取消成功',
          duration: 2000,
          icon: 'none'
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1000)
      }else{
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      }

    })
  }


})