//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fansNav: [],
    type: 1,
    invitationType: 1,
    isShow: false,
    pageNo: 1,
    pageSize: 10,
    pageCount: 1,
    fansNumInfo: {}, // 粉丝数量信息
    followerList: [], // 粉丝集合
    popupFlag: false,
    imInstalment:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getSwitch()
    this.setData({
      type: options.type,
      invitationType: options.type,
    })
    // this.getFollower()
  },
  onShow: function (options) {
    this.setData({
      pageNo: 1,
      pageCount: 1,
      imInstalment: app.globalData.imInstalment == 1? true:false  //IM开关
    })
    this.getFollower()
    // this.findUnreadCount(this.data.followerList)
    app.sdk.DataObserver.getInstance().notify_observers.length = 0
    app.sdk.DataObserver.getInstance().Register(this.initMessageList)
  },
  onHide:function() {
    this.setData({
      followerList:[],
      pageNo:1,
      pageCount: 1
    })
  },
  initMessageList(param1,param2){
    if(param1 === app.sdk.DataConst.NOTIFY_ONOPEN) {
      console.log("sock connent success ==> webInfo")
    } else if(param1 === app.sdk.DataConst.NOTIFY_RECEIVE_CHAT_MESSAGE){
      this.findUnreadCount(this.data.followerList)
      console.log('这里是接收到聊天信息通知处理事件',JSON.parse(param2.body))
    } else if(param1 === app.sdk.DataConst.NOTIFY_RECEIVE_SERVICE_MESSAGE){
      console.log('这里是接收到客服消息通知处理事件')
    }
  },
  gofansDeatil: function (e) {
    wx.navigateTo({
      url: '/pages/vip/fansDetail/fansDetail?followerUid=' + e.currentTarget.dataset.uid,
    })
  },
  onReachBottom: function () {
    var that = this
    this.getUsersList('1')
  },
  getFollower: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this
    var {
      token,
      uid
    } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('myInvitationTypeList', {
      'token': token,
      'uid': uid
    }).then(res => {
      var res = res.data
      if (res.status == 1) {
        // res.data.forEach((item, index) => {
        //   if (item.invitationType == 2) {
        //     res.data.splice(index, 1)
        //   }
        // })
        that.setData({
          fansNav: res.data,
        })
        this.getUsersList()
      } else {
        // 失败提示
        wx.showToast({
          title: res.statusDetail,
          duration: 2000
        })
      }
      wx.hideLoading()
    })
  },
  // 切换粉丝列表
  checkFansNav(e) {
    var type = e.currentTarget.dataset.type
    this.setData({
      type: type,
      invitationType: type,
      pageNo: 1
    })
    this.getUsersList()
    // 获取用户列表
  },
  /**
   * 邀请用户列表
   * uid
   * token
   * type
   *  1-我的粉丝
   *  2-已邀会员
   *  3-买家用户
   *  4-浏览用户
   * pageNo
   * pageSize
   */
  getUsersList(n) {
    if (this.data.pageCount < this.data.pageNo) {
      return Promise.resolve()
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var {
      token,
      uid
    } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('myInvitationInfo', {
      'token': token,
      'uid': uid,
      'pageNo': this.data.pageNo,
      'pageSize': this.data.pageSize,
      'type': this.data.invitationType
    }).then(({
      data: res
    }) => {
      if (res.status == '1') {
        this.data.pageNo += 1
        this.data.pageCount = res.pageCount || 1
        // 统一字段
        var followerList = res.data.followerList || res.data.invitedMemberList || res.data.buyingFollowersList || res.data.browseFollowersList
        var followerCnt = res.data.followerCnt || res.data.totalMemberCnt || res.data.fansCnt || 0
        var buyerFansCnt = res.data.buyerFansCnt || res.data.effectiveMemberCnt || 0
        var notBuyFansCnt = res.data.notBuyFansCnt || res.data.normalMemberCnt || 0
        if (!n) {
          this.setData({
            followerList: []
          })
          // 第一次加载
          this.setData({
            followerList: followerList,
            "fansNumInfo.followerCnt": followerCnt,
            "fansNumInfo.buyerFansCnt": buyerFansCnt,
            "fansNumInfo.notBuyFansCnt": notBuyFansCnt
          })
        } else {
          // 翻页
          var newData = this.data.followerList.concat(followerList)
          this.setData({
            followerList: newData
          })
        }
        // this.findUnreadCount(this.data.followerList)
        // this.setData({
        //   followerList
        // })
        this.findUnreadCount(this.data.followerList)
      }
      wx.hideLoading()
    })
  },
  // 弹窗
  openPopup(e) {
    this.setData({
      popupFlag: true
    })
  },
  closePopup() {
    this.setData({
      popupFlag: false
    })
  },
  //IM聊一聊入口
  singleChat(e){
    let info = e.currentTarget.dataset.info
    let params={
      groupId:'',
      toUsers:[]
    }
    params.toUsers.push(info.imUserId)
    app.sdk.addUsersToGroup(params).then(res => {
      if(res.appCode == "S0000"){
        // let entryNum={
        //   'entryNum':'fans',
        //   'invitationType':this.data.invitationType
        // }
        wx.setStorageSync('entryNum', '')
        wx.navigateTo({
          url: `/subPages/IM/ImChat/ImChat?username=${info.nickName}&groupId=${res.result[0].groupId}&chatType=single`
        })
      } else {
        wx.showToast({
          title: res.appMesg,
          icon: 'none'
        })
      }
    }).catch(error => {
      wx.showToast({
        title: '请求失败'
      })
    })
  },
  //获取用户未读信息条数
  findUnreadCount(e){
    let that = this
    let info = e
    let params = []
    if(info && info.length >0){
      info.forEach((item,index) => {
        if(item.imUserId){
          params.push(item.imUserId)
        }
      })
      console.log(params)
      app.sdk.findUnreadCount({userIds:params}).then( res => {
        if (res.appCode == 'S0000'){
            console.log(res)
            let unReadInfos = res.result
            let followerList = that.data.followerList
            followerList.forEach((item,index) => {
              unReadInfos.forEach((ite,ind) => {
                if(item.imUserId == ite.userId){
                  if(ite.unReadCount >=99){
                    ite.unReadCount = '99+'
                  }
                  item.unReadCount = ite.unReadCount
                }
              })
            })
            console.log(followerList)
            that.setData({
              followerList
            })    
        }else {
          wx.showToast({
            title: res.appMesg,
            icon: 'none'
          })
        }
      }).catch( error => {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      })

    }
    
  },
})