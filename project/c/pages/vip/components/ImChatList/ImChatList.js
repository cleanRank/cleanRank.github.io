// pages/vip/components/ImChatList/ImChatList.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageList:{
      type:Object,
      value: [],
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    delBtnWidth: 172,
    showDel:false,
  },
  lifetimes:{
    ready (){
      this.initEleWidth();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 开始滑动事件
    touchS: function (e) {
      if (e.touches.length == 1) {
        this.setData({
          //设置触摸起始点水平方向位置 
          startX: e.touches[0].clientX
        });
      }
    },
    touchM: function (e) {
      var that = this;
      // initdata(that)
      if (e.touches.length == 1) {
        //手指移动时水平方向位置 
        var moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值 
        var disX = this.data.startX - moveX;
        var delBtnWidth = this.data.delBtnWidth;
        var index = e.currentTarget.dataset.index;
        let candelete = false
        var txtStyle = "";
        if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变 
          txtStyle = "left:0px";
          candelete = false
        } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离 
          txtStyle = "left:-" + disX + "px";
          if (disX >= delBtnWidth) {
            //控制手指移动距离最大值为删除按钮的宽度 
            txtStyle = "left:-" + delBtnWidth + "px";
            candelete = true

          }
        }
        console.log('222'+candelete)
        if(disX > 0){
          let txt = "left:0px"
          this.data.messageList.forEach((item,index) => {
            item.shows = txt
          })
        }
        // 获取手指触摸的是哪一项
        var index = e.currentTarget.dataset.index;
        var list = this.data.messageList;
        list[index].shows = txtStyle;
        if(list[index].showDel){
          list[index].showDel = false
        }
        //更新列表的状态
        this.setData({
            messageList:list
        });
  
      }
    },
    // 滑动中事件
    touchE: function (e) {
      if (e.changedTouches.length == 1) {
        //手指移动结束后水平位置 
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离 
        var disX = this.data.startX - endX;
        var delBtnWidth = this.data.delBtnWidth;
        let candelete = null
        //如果距离小于删除按钮的1/2，不显示删除按钮 
        var txtStyle = "";
        txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
        var candelete = disX > delBtnWidth / 2 ? true : false;

        if(disX > delBtnWidth / 2){
          let txt = "left:0px"
          this.data.messageList.forEach((item,index) => {
            item.shows = txt
          })
        }
        //获取手指触摸的是哪一项 
        var index = e.currentTarget.dataset.index;
        var messageList = this.data.messageList;
        messageList[index].shows = txtStyle;
        messageList[index].candelete = candelete;
        if(messageList[index].showDel){
          messageList[index].showDel = false
        }
        //更新列表的状态 
        this.setData({
          messageList: messageList
        });
      } else {
        console.log("2");
      }
    },
    //获取元素自适应后的实际宽度 
    getEleWidth: function (w) {
      var real = 0;
      try {
        var res = wx.getSystemInfoSync().windowWidth;
        var scale = (750 / 2) / (w / 2); 
        // console.log(scale); 
        real = Math.floor(res / scale);
        return real;
      } catch (e) {
        return false;
        // Do something when catch error 
      }
    },
    initEleWidth: function () {
      var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
      this.setData({
        delBtnWidth: delBtnWidth
      });
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
      this.triggerEvent("delItem",param)
    },
    singleChat(e) {
      console.log(this.data.messageList)
      let info = e.currentTarget.dataset.info
      let chatType = info.userFor == 1 ? 'single' : 'group'
      wx.navigateTo({
        url: `/subPages/IM/ImChat/ImChat?username=${info.name}&groupId=${info.groupId}&chatType=${chatType}`
      })
    },
  }
})
