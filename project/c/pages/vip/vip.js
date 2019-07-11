// pages/vip/vip.js
//获取应用实例
const app = getApp()
import { copyText } from '../../utils/common.js' // 引入复制文本api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    miniProgramUserinfo: {},
    memberList: {},
    memberLevellist: ['小象首席体验官', '银牌合伙人', '水象合伙人'],
    vip_rank: ['', '/images/icon/vip1.png','/images/icon/vip2.png'],
    isLoading: false,
    newNickName: '',
    newLevelList:[],
    newLevelListObj:[],
    listFloor: [],
    seckillIndex: 0,
    seckillStatus: 0,//秒杀状态,1-已开始，0-未开始
    ishowPromotion: 0,//是否隐藏推广，0.不展示
    versionId: '',
    pageIndex: 1,//分页用到
    currentPageData: {},
    ifhasSekill: true,//当前活动页是否有秒杀楼层
    showFloorArray:["1","2","3","5","7","10","13","15","16","17"],
    announceList:[],
    bLoginWay:true,
    imInstalment:true,
    dataLen:false,
    newList:{},
    ishowPromotion: false,//是否隐藏推广，0.不展示
    currentIndex: 0,  
    navList:[      // navList:['会员','联系人','消息']
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
    class_flag:false,
    closeVideo: false
  },
  // 点击tabbar 刷新当前页信息
  onTabItemTap: function (e) {
    if (app.onTabIndex == e.index) {
      this.getMember().then(res => {
        if (res.status == '1') {
          this.getFollower()
        }
      })
      this.getSwitch()
    }
    app.onTabIndex = e.index
    //用户级别埋点
    app.getMemberLevel()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(){
    wx.setTabBarStyle({
      "selectedColor": "#DA9F4A"
    }),
    this.setData({
      class_flag: wx.getStorageSync("fullClass")
    })
  },
  onShow: function () {
    console.log(111)
    let that =this
    wx.setTabBarStyle({
      "selectedColor": "#DA9F4A"
    })
    this.getMember().then(res => {
      if (res.status == '1') {
        this.getFollower()
      }
    })
    this.setData({
      bLoginWay: app.globalData.bLoginWay==1?true:false,
      currentIndex: 0,  //导航
    })
    this.getSwitch()
    console.log("开关:"+this.data.bLoginWay)
    this.getAnnounceList(1,10)
    console.log("测试："+JSON.stringify(this.data.newList))
    this.getFansAndInviter()  //联系人待处理请求
    this.findAllUnreadCount() //联系未处理消息总条数
    app.sdk.DataObserver.getInstance().notify_observers.length = 0
    app.sdk.DataObserver.getInstance().Register(this.initMessageList)
    this.setData({
      closeVideo: false
    })
    //tabbar切换触发事件，通知组件初始化视频
    setTimeout(function () {
      that.setData({
        closeVideo: true
      })
    })
    wx.removeStorageSync("video_arr")
    wx.removeStorageSync("playIndex")
  },
  onHide() {
    wx.removeStorageSync("video_arr")
    wx.removeStorageSync("playIndex")
  },
  onUnload(){
    wx.removeStorageSync("video_arr")
    wx.removeStorageSync("playIndex")
  },
  initMessageList(param1,param2){
    if(param1 === app.sdk.DataConst.NOTIFY_ONOPEN) {
      console.log("sock connent success ==> webInfo")
    } else if(param1 === app.sdk.DataConst.NOTIFY_RECEIVE_CHAT_MESSAGE){
      this.getFansAndInviter()
      this.findAllUnreadCount()
      console.log('这里是接收到聊天信息通知处理事件',JSON.parse(param2.body))
    } else if(param1 === app.sdk.DataConst.NOTIFY_RECEIVE_SERVICE_MESSAGE){
      console.log('这里是接收到客服消息通知处理事件')
    }
  },
  stopTouchMove: function () {
    return false;
  },
  // 水象通开关
  getSwitch() {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      var { uid, token } = wx.getStorageSync('miniProgramUserinfo')
      app.ajax.postApi('FinanceSwitch', {
        'token': token || '',
        'uid': uid || ''
      }).then(({ data: res }) => {
        wx.hideLoading()
        if (res.status == '1') {
          let {imInstalment} = res
          app.globalData.imInstalment = imInstalment
          this.setData({
            imInstalment:app.globalData.imInstalment == 1? true:false
          })
          resolve(res)
        }
      })
    })

  },
  getMember: function () {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      this.setData({
        miniProgramUserinfo: wx.getStorageSync('miniProgramUserinfo')
      })
      var {
        token,
        uid
      } = wx.getStorageSync('miniProgramUserinfo')
      app.ajax.postApi('memberNew', {
        'token': token,
        'uid': uid,
        'type':2,
        'versionType':1
      }).then(res => {
        var res = res.data
        if (res.status == 1) {
          this.setData({
            memberList: res.data,
            versionId: res.data.versionId
          })
          this.loadActData();
          app.globalData.weid = res.data.inviteCode
          if(res.data.memberLevel==1){
            // 查询银牌合伙人列表
            this.getLeveList();
            // 如果已经选过银牌合伙人类型就显示类型
            // if(res.data.levelOneTitleName){
            //   let memberLevellist = this.data.memberLevellist
            //   memberLevellist[res.data.memberLevel]=res.data.levelOneTitleName
            //   this.setData({
            //     memberLevellist
            //   })
            // }
          }
          resolve(res)
        }
      })
    })
  },
  getFollower: function () {
    var {
      token,
      uid
    } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('myInvitationTypeList', {
      'token': token,
      'uid': uid
    }).then(data => {
      var res = data.data
      if (res.status == 1) {
        res.data.forEach((item) => {
          if (item.invitationType == '1') {
            // 我的粉丝
            item.num = this.data.memberList.followerCount || 0
          } else if (item.invitationType == '2') {
            // 已邀会员
            item.num = this.data.memberList.superFansCnt || 0
          } else if (item.invitationType == '3') {
            // 买家用户
            item.num = this.data.memberList.buyerFansCnt || 0
          } else {
            // 浏览用户
            item.num = this.data.memberList.browserFansCnt7days || 0
          }
        })
        // res.data.forEach((item, index) => {
        //   if (item.invitationType == '2') {
        //     res.data.splice(index, 1)
        //   }
        // })
        this.setData({
          fansNav: res.data,
        })
      } else {
        // 失败提示
        wx.showToast({
          title: res.statusDetail,
          duration: 2000
        })
      }
      this.setData({
        isLoading: true
      })
      wx.hideLoading()
    })
  },
  //过滤floortype=[2,3,5,7]的值
  filterData:function(data){
    let that=this;
    var newArr = that.data.showFloorArray;
    var newFloorArry=[];
    for(let i in data){
      if (newArr.indexOf(data[i].floorType) > -1) {
        newFloorArry.push(data[i])
      }
    }
    return newFloorArry;
  },
  //获取版式数据
  loadActData: function (type) {
    let that = this
    var loadingTxt = '加载中...'
    if (type == 'down') {
      loadingTxt = '正在刷新...'
    }
    wx.showLoading({
      title: loadingTxt
    })
    var {
      uid
    } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('ActiveTemplateNew', {
      versionId: that.data.versionId,
      uid: uid
    }).then(res => {
      if (type == 'down') {
        wx.hideNavigationBarLoading() //完成停止加载
      }
      wx.hideLoading()
      var res = res.data
      if (res.status == 1) {
        that.setData({
          closeVideo: true
        })
        wx.removeStorageSync("video_arr")
        wx.removeStorageSync("playIndex")
        // myDictionary.add(category.h5Url,res.data)
        // 成功
        // 处理数据
        let pageIndex = that.data.pageIndex
        if (pageIndex == 1) {
          that.setData({
            currentPageData: res.data,
            listFloor: that.filterData(res.data.listFloor),
            ishowPromotion: res.data.rebateStatus == 0 ? true : false,
            newList:res.data
          })
          let listFloor = that.filterData(that.data.listFloor)
          for (let index in listFloor) {
            let data = listFloor[index]
            if (data.floorType == 6 && data.activityInfos.length > 0) {//秒杀
              let activityInfos = data.activityInfos
              let status = activityInfos[0].status
              that.setData({
                seckillStatus: status,
                seckillIndex: 0,
                ifhasSekill: true,
              })
            }
          }
        } else {
          let listFloor = that.filterData(that.data.listFloor)
          that.setData({
            listFloor: listFloor.concat(that.filterData(res.data.listFloor))
          })
        }
      } else {
        that.setData({
          currentPageData: null
        })
      }
    })
  },
  //end
  //获取公告
  getAnnounceList:function(pageNum,pageSize){
    let that=this;
    app.ajax.postApi('getAnnouncementList', {
      pageNo: pageNum,
      pageSize: pageSize
    }).then(res => {
       if(res.data.status==1&&res.data.data.length>0){
          that.setData({
            announceList:res.data.data,
            dataLen:true
          })
       }else{
         that.setData({
           dataLen: false
         })
       }
    })
  },
  //导航切换
  changeTab: function(e) {
    this.data.currentIndex = e.detail
    if(this.data.currentIndex == '0'){
      wx.switchTab({
        url:'/pages/vip/vip'
      })
    } else{
      this.setData({
        currentIndex:this.data.currentIndex
      })
      let url = `/subPages/IM/ImInfoList/ImInfoList?currentIndex=${this.data.currentIndex}`
      wx.navigateTo({
        url
      })
    }

  },
  goIncomeDetail: function (e) {
    wx.navigateTo({
      url: '/pages/vip/incomeDetails/incomeDetails?tabIndex=' + e.currentTarget.dataset.index
    })
  },
  goVipSharePage: function (e) {
    // 跳转分享页
    wx.navigateTo({
      url: '/pages/vip/share/share'
    })
  },
  /* 礼包跳转 */
  goGiftBagActivity: function (e) {
    let versionId = this.data.memberList.miniGiftVersionId
    if (versionId) {
      wx.navigateTo({
        url: `/pages/index/activityPage/activityPage?versionid=${versionId}`
      })
    }
  },
  // 点击店铺分享后跳转的分享好友页面
  goStoreSharePage () {
    wx.showLoading({
      title: '加载中',
      icon: "loading",
    })
    var {token, uid} = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('getStoreSharePics', {token, uid}).then(res => {
      wx.hideLoading()
      if (res.data.status == '1') {
        // 跳转店铺分享页
        wx.navigateTo({
          url: '/pages/vip/storeShare/storeShare',
        })
      }
    })
  },
  // 复制文本
  copyText(e) {
    copyText(e)
  },
  /**
   * 查询体验官列表
   */
  getLeveList(){
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let formData = {
      uid,
      token
    }
    app.ajax.postApi('findLeveMemberTitleList', formData).then(({ data: res }) => {
      if (res.status == 1) {
        var res = res.data
        let newLevelList = [];
        if(res.length>0){
          res.forEach(item=>
            newLevelList.push(item.parameterName)
          )
        }
        this.setData({
          newLevelList,
          newLevelListObj:res
        })
      }else{
        wx.showToast({
          title: res.statusDetail,
          duration: 2000,
          icon: 'none'
        })
      }

    })
  },
  /**
   * 修改别名接口
   */
  updateLeveTitle(index){
    let newLevelListObj = this.data.newLevelListObj
    let levelOneTitle = newLevelListObj[index].parameterId
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let formData = {
      uid,
      token,
      levelOneTitle
    }
    app.ajax.postApi('updateMemberLeveTitle', formData).then(({ data: res }) => {
      console.log(res)
      if (res.status == 1) {
        // 回显
        let memberLevellist = this.data.memberLevellist
        memberLevellist[1] = newLevelListObj[index].parameterName+' >'
        this.setData({
          memberLevellist
        })
      }else{
        wx.showToast({
          title: res.statusDetail,
          duration: 2000,
          icon: 'none'
        })
      }

    })
  },
  /**
   * picker选择器
   */
  bindPickerChange(e){
    let index = e.detail.value
    this.updateLeveTitle(index)
  },
  // 跳转附近买家
   getPeople(){
    wx.navigateTo({
      url: '/pages/findPeople/findPeople'
    })
  },
  //IM联系人列表
  goContachList(){
    wx.navigateTo({
      url:'/pages/vip/contactList/contactList'
    })
  },
  // IM信息列表
  goImChatList(){
    wx.navigateTo({
      url:'/pages/vip/ImChatList/ImChatList'
    })
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
      wx.hideLoading()
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
    })
  },
  touchStart: function (e) {
    // Do something when page scroll
    this.setData({
      scrollTop: e.touches[0].pageY
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
        wx.showToast({
          title: res.appMesg,
          icon: 'none'
        })
      }
    }).catch( error => {
      wx.showToast({
        title:'请求失败',
        mask: true
      })
    })

  }
})