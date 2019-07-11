// pages/vip/ImSearchPage/ImSearchPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defineWord: '请输入关键字搜索',       // 默认文案
    pageReady: false,
    showResult:false,
    pageIndex:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.queryUsers()
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
  //获取联系人
  searchFn(){
    if(this.data.searchWord){
      this.sendSearchFn(this.data.searchWord, true,this.data.pageIndex)
    }else {
      wx.showToast({
        title: '请输入搜索关键字',
        icon: 'none',
        duration: 2000
      })
      return;
    }
  },
  // 发送搜索请求
  sendSearchFn(word, boo,type){
    //收起软键盘
    if (boo) {
      this.selectComponent("#searchCom").cancelFocus()
    }
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    let params = {
      uid,
      token,
      pageIndex:this.data.pageIndex,
      pageSize: this.data.pageSize,
      searchContext:word
    }
    if(type == 1){
      app.ajax.postApi('searchMyFriends',params).then( res => {
        wx.hideLoading()
        if(res.data.status == '1'){
          let myFriends = res.data.data.myFriends
          let totalCount = res.data.data.totalCount
          this.setData({
            friendResult:myFriends,
            showResult:true,
            totalCount
          })
        }
      })
    } else if(this.data.pageIndex <= this.data.pageCount){
      app.ajax.postApi('searchMyFriends',params).then( res => {
        wx.hideLoading()
        if(res.data.status == '1'){
          let myFriends = this.data.friendResult.concat(res.data.data.myFriends)
          let totalCount = res.data.data.totalCount
          this.setData({
            friendResult:myFriends,
            showResult:true,
            totalCount
          })
        }
      })
    }else {
      wx.hideLoading()
      this.setData({
        showResult:false
      })
    }
  },
  // 获取输入框中的文字
  getSearchWord (word) {
    // 将回传的文字赋值给预搜索文案
    this.setData({searchWord: word.detail})
    // 如果文字非空，将文字传送给补全接口
    if (this.data.searchWord) {
      this.sendSearchFn(this.data.searchWord,false,this.data.pageIndex)
    } else {
      this.setData({
        showResult:false
      })
    }
  },
  // 聊天
  chatEvent(e) {
    let info = e.currentTarget.dataset.info
    let params = {
      groupId: '',
      toUsers: []
    }
    params.toUsers.push(info.imUserId)
    app.sdk.addUsersToGroup(params).then(res => {
      if (res.appCode =="S0000") {
        wx.navigateTo({
          url: `/subPages/IM/ImChat/ImChat?username=${info.nickName}&groupId=${res.result[0].groupId}&chatType=single`,
        })
      } else {
        wx.showToast({
          title: res.appMesg,
          icon: 'none'
        })
      }
    }).catch(error => {
      wx.showToast({
        title: '请求失败',
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageIndex++
    sendSearchFn(this.data.searchWord, true,this.data.pageIndex)
  },
})
