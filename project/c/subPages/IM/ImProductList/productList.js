// pages/vip/productList/productList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList:[],
    pageNo:1,
    pageSize: 10,
    pageName:'分享好物'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: options.groupId || '',
      chatType: options.chatType || '',
      username: options.username || ''
    })
    this.getImShareOrders(this.data.pageNo)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //分享好物商品列表
  getImShareOrders(type){
    wx.showLoading()
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    let params={
      uid,
      token,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }
    if(type == 1){
      app.ajax.postApi('getImShareOrders',params).then( res => {
        wx.hideLoading()
        if(res.data.status == '1'){
          this.setData({
            productList: res.data.data.concat(this.data.productList),
            pageCount: res.data.pageCount
          })
        }
      })
    }else if(this.data.pageNo <= this.data.pageCount){
      app.ajax.postApi('getImShareOrders',params).then( res => {
        wx.hideLoading()
        if(res.data.status == '1'){
          this.setData({
            productList: this.data.productList.concat(res.data.data),
            pageNo: this.data.pageNo
          })
        }
      })
    }else{
      wx.showToast({
        title:'没有更多内容',
        icon:'none',
        duration: 2000
      })
    }
    

    wx.setNavigationBarTitle({
      title: '分享好物'
    })
  },
  //分享商品
  shareGoods(e){
    // let shareGoods = e.detail
    let info = e.currentTarget.dataset.info
    let mini = wx.getStorageSync('miniProgramUserinfo')
    if(info.productImage){
      info.imgUrl = info.productImage
    }
    if(info.productName) {
      info.title = info.productName
    }
    if(info.viceTitle){
      info.desc = info.viceTitle
    }
    let params = {
      fromUserId: mini.imUserId,
      groupId: this.data.groupId,
      content: info.productName,
      ext: [info],
      contentType: 6,
      type: '1',
      signature: new Date().getTime()
    }
    app.sdk.sendMessage(params).then(res => {
      wx.navigateBack({
        delta: 1
      })
      // wx.navigateTo({
      //   url: `/subPages/IM/ImChat/ImChat?username=${this.data.username}&groupId=${this.data.groupId}&chatType=${this.data.chatType}`
      // });
    })

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 好物分享 上拉加载
    this.data.pageNo = this.data.pageNo+1
    this.setData({
      pageNo: this.data.pageNo
    })
    this.getImShareOrders(this.data.pageNo)
  }
})