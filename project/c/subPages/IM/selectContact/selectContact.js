// pages/vip/selectContact/selectContact.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    page:1,
    groupId:null,
    total:0,
    showBtn:false,
    pageName:'分享列表',
    pageIndex:1,
    pageSize:10,
    minHeight: 0 // 容器最小高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.groupId = options.groupId || ''
    this.setData({
      groupId: this.data.groupId
    })
    this.setData({ minHeight: wx.getSystemInfoSync().windowHeight + 1 })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  postData(e){
    console.log(e.detail)
    let info = e.detail
    let params = {
      groupId: '',
      toUsers: []
    }
    params.toUsers.push(info[0].imUserId)
    app.sdk.addUsersToGroup(params).then(res => {
      if (res.appCode == "S0000") {
        let ImProductDetail = wx.getStorageSync('ImProductDetail')
        let mini = wx.getStorageSync('miniProgramUserinfo')
        let info = JSON.parse(ImProductDetail)
        let result = res.result
        if(info.mainImagePath){
          info.imgUrl = info.mainImagePath
        }
        if(info.productName) {
          info.title = info.productName
        }
        if(info.viceTitle){
          info.desc = info.viceTitle
        }
        let params = {
          fromUserId: mini.imUserId,
          groupId: result[0].groupId,
          content: info.productName,
          ext: [info],
          contentType: 6,
          type: '1',
          signature: new Date().getTime()
        }
        app.sdk.sendMessage(params).then(data => {
          // wx.setStorageSync('entryNum','detail')
          // wx.navigateTo({
          //   url: `/subPages/IM/ImChat/ImChat?username=${result[0].groupName}&groupId=${result[0].groupId}&chatType=single`
          // });
          wx.removeStorage('ImproductDetail')
          wx.navigateBack({
            delta: 1
          })
        })
      } else {
        wx.showToast({
          title: res.appMesg,
          icon: 'none'
        })
      }
    })
    // .catch(error => {
    //   wx.showToast({
    //     title: '请求失败',
    //   })
    // })
  },
  cancelEvent(){
    wx.removeStorage('ImproductDetail')
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.addressList.length>0) {
      return
    }
    let ImproductDetail = JSON.parse(wx.getStorageSync('ImProductDetail')) || []
    if(ImproductDetail){
      this.setData({
        ImproductDetail:ImproductDetail.productName
      })
    }
    this.data.addressList.length = 0
    this.setData({
      addressList: this.data.addressList
    })
    this.queryUsers(this.data.pageIndex)
  },
  queryUsers(type){
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    let params = {
      uid,
      token,
      findInviter: true,
      pageIndex:this.data.pageIndex,
      pageSize: this.data.pageSize
    }
    if(type == 1){
      app.ajax.postApi('findFansAndInviter',params).then( res => {
        if(res.data.status == '1'){
          if(!res.data) return
          let addressList = res.data.data.myFriends
          this.setData({
            addressList,
            pageCount: res.data.pageCount
          })
        }else {
          wx.showToast({
            title: res.statusMessage,
            icon:'none',
            duration:2000
          })
        }
        wx.hideLoading()
      })
    } else if(this.data.pageIndex <= this.data.pageCount){
      app.ajax.postApi('findFansAndInviter',params).then( res => {
        if(res.data.status == '1'){
          let addressList = res.data.data.myFriends
          this.data.pageCount = res.pageCount

          this.setData({
            addressList:this.data.addressList.concat(addressList),
            pageCount: res.data.pageCount,
          })
        }else {
          wx.showToast({
            title: res.statusMessage,
            icon:'none',
            duration:2000
          })
        }
        wx.hideLoading()
      })
    }else{
        wx.hideLoading()
        // wx.showToast({
        //   title:'没有数据',
        //   icon:'none',
        //   duration: 2000
        // })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageIndex++
    this.queryUsers(this.data.pageIndex)
  }
})