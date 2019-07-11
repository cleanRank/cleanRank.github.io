// pages/vip/ImInfoList/ImInfoList.js
import { timeFormat,imFormatTime} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    navList:[
      {
        'name':'会员'
      },{
        'name':'联系人',
        'notifyNum':0
      },{
        'name':'消息',
        'notifyNum':0
      }
    ],
    hotword:'请输入关键字搜索',
    myFriends:[],
    page: 1,
    alphabets:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'],
    messageList1:[],
    pageIndex: 1,
    pageSize:10,
    pendingSta:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.currentIndex = options.currentIndex  // 设置导航项
    this.data.entryNum = options.entryNum
    this.setData({
      currentIndex: this.data.currentIndex || this.data.entryNum
    })
    // if(this.data.currentIndex == '1'){
    //   this.queryUsers()
    //   this.getFansAndInviter()
    //   // this.getApplyFriends()
    //   // this.getFansAndInviter()
    // } else if(this.data.currentIndex == '2'){
    //   this.getMessageList()
    // }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      pendingSta: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMessageList()
    this.getFansAndInviter()
    this.findAllUnreadCount()
    this.queryUsers(this.data.pageIndex)
    app.sdk.DataObserver.getInstance().notify_observers.length = 0
    app.sdk.DataObserver.getInstance().Register(this.initMessageList)
  },
  initMessageList(param1,param2){
    if(param1 === app.sdk.DataConst.NOTIFY_ONOPEN) {
      console.log("sock connent success ==> webInfo")
    } else if(param1 === app.sdk.DataConst.NOTIFY_RECEIVE_CHAT_MESSAGE){
      this.getMessageList()
      this.getFansAndInviter()
      this.findAllUnreadCount()
      console.log('这里是接收到聊天信息通知处理事件',JSON.parse(param2.body))
    } else if(param1 === app.sdk.DataConst.NOTIFY_RECEIVE_SERVICE_MESSAGE){
      // this.getMessageList()
      console.log('这里是接收到客服消息通知处理事件')
    }
  },
  //tab切换
  changeTab(e){
    this.data.currentIndex = e.detail
    if(this.data.currentIndex == '0'){
      wx.switchTab({
        url:'/pages/vip/vip'
      })
    }
    this.setData({
      currentIndex: this.data.currentIndex
    })
    if(this.data.currentIndex == '1'){
      // this.queryUsers(this.data.pageIndex)
      // this.getFansAndInviter()
    } else if(this.data.currentIndex == '2'){
      // this.getMessageList()
    }
    
  },
  // 获取消息列表得到groupIds  通过groupIds获取群中所有用户  通过用户imUserId获取用户头像
  //获取消息列表
  getMessageList: function() {   
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    let that = this
    let ImUserInfo = []
    app.sdk.getRecentContact().then(res => {
      if(res.appCode == 'S0000'){
        if(res.result) {
          res.result.forEach((item,index) => {
            item.unix = item.messageTimeLong
          })
          res.result.map(item => {
            item.messageTimeLong = imFormatTime(new Date(item.messageTimeLong))
          })
          this.data.messageList = res.result
          this.data.messageList.forEach((item,index) => {
            if(item.unreadCount >= 99){
              item.unreadCount = '99+'
            }
          })
          this.setData({
            messageList: this.data.messageList
          })
          // 根据群组获取群中所有用户
          let groupIds = []
          
          this.data.messageList.forEach((item,index) => {
            groupIds.push(item.groupId)
          })
          this.getUserIdByGroupIds(groupIds)
          console.log('消息列表调用成功')
        } else {
          this.setData({
            messageList:''
          })
          // wx.showToast({
          //   title: '列表为空',
          //   duration: 2000,
          //   icon: 'none'
          // })
        }
        wx.hideLoading()
      } else {
        wx.showLoading({
          title:'加载中...',
          mask: true
        })
        let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
        let params = {
          loginType:3,
          uid,
          token
        }
        app.ajax.postApi('RefreshImToken',params).then(res => {
          if(res.data.status == '0'){
            let imUserToken = res.data.imUserToken
            if(imUserToken){
              let userInfo = wx.getStorageSync('miniProgramUserinfo')
              userInfo.imToken = imUserToken
              wx.setStorageSync('miniProgramUserinfo',userInfo)
              // setTimeout(function() {
              //   // that.getMessageList()
              //   // app.connectSocket()
              // },300)
              
            }else {
              wx.showToast({
                title: res.data.statusDetail,
                duration: 2000,
                icon: 'none'
              })
            }
            
          }
          wx.hideLoading()
        })
      }
    }).catch(error => {
      wx.hideLoading()
      // wx.showToast({
      //    title:'请求失败',
      //    duration: 2000,
      //    icon: 'none'
      // })
    })
  },
  // 根据群组获取群中所有用户
  getUserIdByGroupIds: function(e) {
    var that = this
    let params = {
      groupIds:e
    }
    app.sdk.getUserIdByGroupIds(params).then(res => {
      if(res.appCode == "S0000"){
        let ImUserInfo = res.result
        let messageList = this.data.messageList
        messageList.forEach((item,index) => {
          ImUserInfo.forEach((ite,ind) => {
            if(item.groupId == ite.groupId){
              let {imUserId} = wx.getStorageSync('miniProgramUserinfo')
              for(let i=0;i<ite.userIds.length;i++){
                if(ite.userIds[i] != imUserId){
                  item.imUserId = ite.userIds[i]
                }
              }
            }
          })
        })
        this.setData({
          messageLen:messageList.length
        })
        // this.getAllUsersInfoByList(messageList)
        this.getUserInfo(messageList)
      }
    })
  },
  getAllUsersInfoByList:function(arr) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let messageList = arr
    let list = []
    messageList.forEach((item,index) => {
      list.push(item.imUserId)
    })
    let param = {
      userIds:list
    }
    app.sdk.getAllUsersInfoByList(param).then( res => {
      if(res.appCode == 'S0000'){
        wx.hideLoading()
      }
    })
  },
  //根据群组里面imUserId获取用户头像 昵称
  getUserInfo(arr){
    var that = this
    let list = arr
    let imUserIds = []
    for(let i=0;i<list.length;i++){
      imUserIds.push(list[i].imUserId)
    }
    let userInfo = wx.getStorageSync('miniProgramUserinfo')
    let{uid,token} = userInfo
    app.ajax.postApi('getUsersByImUserIds',{
      uid,
      token,
      imUserIds:imUserIds
    }).then( res => {
      if(res.data.status == '1') {
        let infoList = res.data.data
        list.forEach((item,index) => {
          infoList.forEach((ite,ind) => {
            if(item.imUserId == ite.imUserId){
              item.mainPic  =ite.avatarUrl
              item.name =ite.nickName
            }
          })
        })

        list = this.sort(list)

        // list = list.sort((a,b) =>{
        //   a.unix - b.unix
        // })
        this.setData({
          messageList: list
        })
      }
    })

  },
  // 排序
  sort (arr){
    for(var i=0;i<arr.length-1;i++){
        for(var j=0;j<arr.length-i-1;j++){
            if(arr[j]>arr[j+1]){// 相邻元素两两对比
                var hand = arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=hand;
                 
            }
        }
    }
    return arr;
  },
  // 删除聊天记录
  delItem(e){
    let param = e.detail
    app.sdk.removeRecent(param).then(res => {
      this.getMessageList()
      this.findAllUnreadCount()
    })
  },

  //联系人方法
  //获取联系人
  queryUsers(type) {
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    let formData = {
      findInviter: true,
      uid,
      token,
      pageIndex:this.data.pageIndex,
      pageSize: this.data.pageSize
    }
    if(type == 1){
      app.ajax.postApi('findFansAndInviter',formData).then( res => {
        if(res.data.status == '1'){
          console.log(res.data.pageCount)         
          var res = res.data
          if(!res.data) return
          this.data.inviter = res.data.inviter
          this.data.myFriends = res.data.myFriends
          this.data.myFriendsLink = res.data.myFriends  //联系人列表
          // this.data.myFriends = this.getSortData(this.data.myFriends)
          this.setData({
            inviter:this.data.inviter,
            myFriends:this.data.myFriends,
            myFriendsLink:this.data.myFriendsLink,
            pageCount: res.pageCount
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
      app.ajax.postApi('findFansAndInviter',formData).then( res => {
        if(res.data.status == '1'){
          var res = res.data
          this.data.inviter = res.data.inviter
          // this.data.myFriends = res.myFriends
          this.data.pageCount = res.pageCount
          this.data.myFriendsLink = res.data.myFriends  //联系人列表
          // this.data.myFriends = this.getSortData(this.data.myFriends)
          this.setData({
            myFriends:this.data.myFriends.concat(res.data.myFriends),
            pageCount: this.data.pageCount,
            myFriendsLink:this.data.myFriendsLink
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
    } else{
      wx.hideLoading()
      // wx.showToast({
      //   title:'没有更多数据',
      //   icon:'none',
      //   duration: 2000
      // })
    }
    
  },
  //待处理请求
  getFansAndInviter(){
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('getApplyFriendCount',{
      uid,
      token,
    }).then( res => {
      if(res.data.status == "1"){
        this.data.applyFriendCount = res.data.data
        this.setData({
          applyFriendCount: this.data.applyFriendCount,
          'navList[1].notifyNum': this.data.applyFriendCount
        })
      }else{
        wx.showToast({
          title: res.statusDetail,
          icon: 'none',
          duration: 2000
        })
      }
      wx.hideLoading()
    })
  },
  // 聊天
  chatEvent(e) {
    let info = e.detail
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
      console.log(error)
      // wx.showToast({
      //   title: '请求失败',
      // })
    })
  },
  // 按照字母排序
  // getSortData(arr){
  //   var dataArr = [], str =[]
  //   var letters = "abcdefghijklmnopqrstuvwxyz".toLocaleUpperCase()
  //   let strObj = {'alphabet':'#','datas':[]}
  //   arr.forEach((item,index) => {
  //     let letter = item['pinYinInfo']['longPinYin'][0].substr(0,1)
  //     if(letters.indexOf(letter) == -1){
  //       strObj['datas'].push(item)
  //     }
  //   })
  //   for(let i=0;i<26;i++){
  //     var upperchar = String.fromCharCode(65+i);
  //     var flag = false;
  //     dataArr.push({'alphabet':upperchar,'datas':[]})
  //     for(var j=0;j<arr.length;j++){
  //         var firstchar = arr[j].pinYinInfo.longPinYin[0].substr(0,1);
  //         if(upperchar == firstchar){
  //             flag = true;
  //             dataArr[i]['datas'].push(arr[j]);
  //         }
  //     }
  //     // if(flag == 'flase'){
  //     //     str.push(upperchar)
  //     // }
  //   }
  //   dataArr.push(strObj)
  //   return dataArr
  // },
  // 去搜索页
  goSearchPage(){
    wx.navigateTo({
      url:'/subPages/IM/ImSearchPage/ImSearchPage'
    })
  },
  // 去待处理页面
  applyFriendsPage(){
    let that = this
    if(that.data.pendingSta){
      wx.navigateTo({
        url: '/pages/pendingDo/pendingDo'
      })
    }
    setTimeout(function(){
      that.setData({
        pendingSta:false
      })
    })
  },
  //获取消息总条数
  findAllUnreadCount() {
    app.sdk.findAllUnreadCount().then( res => {
      if(res.appCode == 'S0000'){
        this.data.findAllUnreadCount = res.result
        if(this.data.findAllUnreadCount >= 9999){
          this.data.findAllUnreadCount = 9999
        }
        this.setData({
          'navList[2].notifyNum':this.data.findAllUnreadCount
        })
      }else {
        // wx.showToast({
        //   title: res.appMesg,
        //   icon: 'none'
        // })
      }
    }).catch( error => {
      wx.showToast({
        title:'请求失败',
        mask: true
      })
      console.log(error)
    })

  },
  // compare(property){
  //   return function(a,b){
  //       var value1 = a[property];
  //       var value2 = b[property];
  //       return value1 - value2;
  //   }
  // },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      pendingSta:true
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.switchTab({
      url:'/pages/vip/vip'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.pageIndex= 1
    this.setData({
      pageIndex:this.data.pageIndex
    })
    this.getMessageList()
    this.getFansAndInviter()
    this.findAllUnreadCount()
    this.queryUsers(this.data.pageIndex)
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageIndex++
    this.queryUsers(this.data.pageIndex)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})