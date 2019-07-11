// pages/vip/ImChatList/ImChatList.js
import { timeFormat,imFormatTime} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // navList:['聊天','联系人'],
    // currentIndex:0,
    messageList: [],
    grouplist: [],
    delBtnWidth: 50,
    showDel:false,
    meee:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      messageList:[]
    })
    wx.showLoading()
    this.getMessageList()
    app.sdk.DataObserver.getInstance().notify_observers.length = 0
    app.sdk.DataObserver.getInstance().Register(this.initMessageList)
  },
  initMessageList(param1,param2){
    if(param1 === app.sdk.DataConst.NOTIFY_ONOPEN) {
      console.log("sock connent success ==> webInfo")
    } else if(param1 === app.sdk.DataConst.NOTIFY_RECEIVE_CHAT_MESSAGE){
      this.getMessageList()
      console.log('这里是接收到聊天信息通知处理事件',JSON.parse(param2.body))
    } else if(param1 === app.sdk.DataConst.NOTIFY_RECEIVE_SERVICE_MESSAGE){
      this.getMessageList()
      console.log('这里是接收到客服消息通知处理事件')
    }
  },
  getMessageList: function() {   //获取消息列表
    app.sdk.getRecentContact().then(res => {
      if(res.appCode == 'S0000'){
        wx.hideLoading()
        if(res.result) {
          res.result.map(item => {
            item.messageTimeLong = imFormatTime(new Date(item.messageTimeLong))
          })
          this.data.messageList = res.result
          this.setData({
            messageList: this.data.messageList
          })
          console.log('调用成功')
        } else {
          wx.showToast({
            title: '列表为空',
            duration: 2000,
            icon: 'none'
          })
        }
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.appMesg || '',
          duration: 2000,
          icon: 'none'
        })
      }
    }).catch(error => {
      wx.hideLoading()
      wx.showToast({
         title:'请求失败',
         duration: 2000,
         icon: 'none'
      })
    })
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
        this.setData({
            //设置触摸起始点水平方向位置
            startX: e.touches[0].clientX
        });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
        //手指移动时水平方向位置
          var moveX = e.touches[0].clientX;
          //手指起始点位置与移动期间的差值
          var disX = this.data.startX - moveX;
          var delBtnWidth = this.data.delBtnWidth;
          let candelete = false
          var txtStyle = "";
          if (disX == 0 || disX < 0) {//如果移动距离小于等于0，说明向右滑动，文本层位置不变
              candelete = false
          } else if(disX > 0 && disX >= delBtnWidth){//移动距离大于0，文本层left值等于手指移动距离
            candelete = true
          }
          // var list = this.data.messageList;
          // list.forEach((item,index) => {
          //   item.candelete = false
          // })
          //获取手指触摸的是哪一项
          var index = e.currentTarget.dataset.index;
          var list = this.data.messageList;
          list[index].candelete = candelete;
          //更新列表的状态
          this.setData({
              messageList:list
          });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
        //手指移动结束后水平位置
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        var disX = this.data.startX - endX;
        var delBtnWidth = this.data.delBtnWidth;
        let candelete = null
        //如果距离小于删除按钮的1/2，不显示删除按钮
        var candelete = disX > delBtnWidth / 2 ? true : false;

        // var list = this.data.messageList;
        // list.forEach((item,index) => {
        //   item.candelete = false
        // })
        //获取手指触摸的是哪一项
        var index = e.currentTarget.dataset.index;
        var list = this.data.messageList;
        list[index].candelete = candelete;
        //更新列表的状态
        this.setData({
            messageList: list
        });
    }
  },
  // 确认删除
  showDel(e){
    let index = e.currentTarget.dataset.index
    let list = this.data.messageList
    list[index].showDel = true
    this.setData({
      messageList:list
    })
  },
  delItem(e) { // 删除聊天记录
    let param = {
      groupId: e.currentTarget.dataset.groupid
    }
    app.sdk.removeRecent(param).then(res => {
      this.getMessageList()
    })
    return false
  },
  singleChat(e) {
    let info = e.currentTarget.dataset.info
    let chatType = info.userFor == 1 ? 'single' : 'group'
    wx.navigateTo({
      url: `/subPages/IM/ImChat/ImChat?username=${info.name}&groupId=${info.groupId}&chatType=${chatType}`
    })
  }
})