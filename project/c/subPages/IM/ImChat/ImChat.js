// pages/vip/ImChat/ImChat.js
import { imFormatTime} from '../../../utils/util.js'
const uploadImage = require('../../../utils/IM/upload.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendHead: String,
    selfHead: String,
    groupId: null,
    beforeMessageId: null,
    chatType: null,
    username: null,
    toView: '',
    imgList: [],
    emotionsObj: {
      "emotion_biezui": "[撇嘴]",
      "emotion_deyi": "[得意]",
      "emotion_haixiu": "[害羞]",
      "emotion_bizui": "[闭嘴]",
      "emotion_shui": "[睡]",
      "emotion_daku": "[大哭]",
      "emotion_ciya": "[呲牙]",
      "emotion_ku": "[酷]",
      "emotion_lenghan": "[冷汗]",
      "emotion_tu": "[吐]",
      "emotion_touxiao": "[偷笑]",
      "emotion_keai": "[可爱]",
      "emotion_baiyan": "[白眼]",
      "emotion_jie": "[饥饿]",
      "emotion_kun": "[困]",
      "emotion_liuhan": "[流汗]",
      "emotion_hanxiao": "[憨笑]",
      "emotion_dabing": "[大兵]",
      "emotion_cahan": "[擦汗]",
      "emotion_koubi": "[抠鼻]",
    },
    messageList: [],
    emjoiKey: [],
    showEmotion: false,
    inputvalue: '',
    headMap:{},
    nameMap: {},
    waitNum: 0,
    showMore: false,
    adSwiper:{
      indicatordots:true,
      autoplay:false,
      beforeColor:"#dbdbdb",
      afterColor:"#999"
    },
    imChat:true,
    sendEmotion:false, //发送按钮
    friendInfoList:[],
    infocus:false,
    pageNum:1,
    pageSize: 10,
    textFocus:false,
    arr_len:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let res = wx.getSystemInfoSync()
    let boxHeight = res.windowHeight - 100 // 获取滚动区域的高度
    console.log('onload...............')
    this.setData({
      groupId: options.groupId || '',
      chatType: options.chatType || '',
      username: options.username || '',
      scrollHeight: boxHeight
    })
    //页面初始化判断是否是客服聊天
    if(this.data.chatType == 'service'){
      this.chatWithCustomerService()
    } else {
      this.getUserInfoByGroup()
    }
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
    // 设置页面title
    wx.setNavigationBarTitle({
      title: this.data.username || '客服'
    })
    // 页面初始化判断是否是客服聊天
    // if (this.data.chatType == 'service') {
    //   // this.chatWithCustomerService()
    //   return
    // } else {
    //   this.getUserInfoByGroup()  //获取群用户信息
    //   this.getUserIdByGroupIds()
    // }
    let num = this.randomString()
    this.setData({
      num
    })

    // 表情图片文字转换
    this.data.emjoiKey = Object.keys(this.data.emotionsObj)
    let imglist = this.data.emjoiKey.map(item => {
      return `../../../images/im/face/${item}.png`
    })
    imglist = this.cutData(imglist)
    let del = `../../../images/im/face/shanchu.png`
    imglist.map(function(item,index) {
      item.push(del)
    })
    
    this.pageScrollToBottom()
    // 获取个人头像  
    this.data.selfHead = app.globalData.myInfo.avatarUrl || 'https://waterelephant.oss-cn-shanghai.aliyuncs.com/webim/2019-3-16/1555378535675.jpg'
    this.setData({
      imgList: imglist,
      emjoiKey: this.data.emjoiKey,
      selfHead: this.data.selfHead,
      sendEmotion:false
    })
    app.sdk.DataObserver.getInstance().notify_observers.length = 0
    app.sdk.DataObserver.getInstance().Register(this.init)
  },
  // 处理消息体
  messageHandle(item,type) {
    // console.log('112233'+type)
    // let val = {}
    // val.id = item.id
    // val.createTime = item.createTime
    // val.message = item.content 
    // // todo 判断返回的contenttype:1文字 2图片 6自定义
    // if (item.contentType == 2) {
    //   val.isphoto = true
    // } else if(item.contentType == 6){
    //   val.isproduct = true
    //   val.message = item.ext ? item.ext[0] : null
    // }
    // // 判断是否是用户自己
    // let {imUserId} = wx.getStorageSync('miniProgramUserinfo')
    // if (item.fromUserId == imUserId) {
    //   val.type = 1
    // } else {
    //   val.type = 0
    //   val.imUserId = item.fromUserId
    //   // val.headphoto = this.data.headMap[item.fromUserId]
    //   // val.personname = this.data.nameMap[item.fromUserId]
    // }
    // val.isWarn = (item.type != 1 && item.type != 3) ? true : false
    if(type == 1){
      console.log('11111'+type)
      let val = {}
      val.id = item.id
      val.createTime = item.createTime
      val.message = item.content 
      // todo 判断返回的contenttype:1文字 2图片 6自定义
      if (item.contentType == 2) {
        val.isphoto = true
      } else if(item.contentType == 6){
        // return
        val.isproduct = true
        val.message = item.ext ? item.ext[0] : null
      }
      // 判断是否是用户自己
      let {imUserId} = wx.getStorageSync('miniProgramUserinfo')
      if (item.fromUserId == imUserId) {
        val.type = 1
      } else {
        val.type = 0
        val.imUserId = item.fromUserId
        // val.headphoto = this.data.headMap[item.fromUserId]
        // val.personname = this.data.nameMap[item.fromUserId]
      }
      val.isWarn = (item.type != 1 && item.type != 3) ? true : false
      console.log(val)
      this.data.messageList.push(val)
    }else if(type == '2'){
      console.log('112233'+type)
      let val = {}
      val.id = item.id
      val.createTime = item.createTime
      val.message = item.content 
      // todo 判断返回的contenttype:1文字 2图片 6自定义
      if (item.contentType == 2) {
        val.isphoto = true
      } else if(item.contentType == 6){
        val.isproduct = true
        val.message = item.ext ? item.ext[0] : null
      }
      // 判断是否是用户自己
      let {imUserId} = wx.getStorageSync('miniProgramUserinfo')
      if (item.fromUserId == imUserId) {
        val.type = 1
      } else {
        val.type = 0
        val.imUserId = item.fromUserId
        // val.headphoto = this.data.headMap[item.fromUserId]
        // val.personname = this.data.nameMap[item.fromUserId]
      }
      val.isWarn = (item.type != 1 && item.type != 3) ? true : false
      console.log(val)
      this.data.messageList.unshift(val)
      console.log(this.data.messageList)
    }
    
    let len = this.data.messageList.length - 1
    this.computedMessage(this.data.messageList)
    this.setData({
      messageList: this.data.messageList,
    })
    if(type == 1){
      let len = this.data.messageList.length -1
      this.setData({
        toView: 'massage_' + this.data.messageList[len].id
      })

      // 条数少时 加padding
      if(this.data.messageList.length ==1){
        this.setData({
          padTop1:true
        })
      }
      if(this.data.messageList.length ==2){
        this.setData({
          padTop2:true
        })
      }
      if(this.data.messageList.length ==3){
        this.setData({
          padTop2:true
        })
      }
    }
    
  },

  /**
   * 组件的方法列表
   */
  init(param1, param2, param3) {
    console.log('params2'+param1)
    if(!param2 || !param2.body) return false
    let socketMessage = JSON.parse(param2.body)
    if (param1 === app.sdk.DataConst.NOTIFY_ONOPEN) { // sock连接成功回调
        console.log("sock connect success ==> webInfo")
    } else if (param1 === app.sdk.DataConst.NOTIFY_RECEIVE_CHAT_MESSAGE || param1 === app.sdk.DataConst.NOTIFY_RECEIVE_SERVICE_MESSAGE) {
      // this.getUserInfoByGroup()
      // 如果等待消息时长超过10分钟增加时间=记录
      if (socketMessage.groupId !=this.data.groupId) return
      let meslen = this.data.messageList.length
      let nowtime = new Date().getTime()
      if (meslen.length >=2 && ((nowtime -  this.data.messageList[meslen-1].createTime)/60000 >= 10)) {
        let timeobj = {
          istime: true,
          time: imFormatTime(new Date(nowtime))
        }
        this.data.messageList.push(timeobj)
        this.setData({
          messageList: this.data.messageList
        })
      }
      // -----------已读消息回执 ---------------
      this.sendMessageAck({ 
        groupId: this.data.groupId,
        lastMsgId: socketMessage.id
      })
      // ----------------------------处理消息体-----------------------------
      this.messageHandle(socketMessage,1)
        console.log('这里是接收到聊天消息通知处理事件111',JSON.parse(param2.body))
    }
  },

  //按照指定个数分割数组
  cutData (e){
    let proportion = 20; //按照比例切割
    let num = 0;
    let _data =[];
    for(let i=0;i<e.length;i++){
        if(i % proportion == 0 && i != 0){
            _data.push(e.slice(num,i));
            num = i;
        }
        if((i+1)==e.length){
            _data.push(e.slice(num,(i+1)));
        }
    }
    return _data;
  },
  // 消息已读回执
  sendMessageAck(params){
    app.sdk.sendMessageAck(params).then(res => {
      console.log(res, '已读')
    })
  },
  // groupSetting() { // 群聊设置
  //   wx.navigateTo({
  //     url: '/groupPages/groupSetting/groupSetting?groupId='+this.data.groupId
  //   })
  // },
   //--------------- 获取群用户信息---------------------
  getUserInfoByGroup() {
    // if (this.data.groupId == 'null') return
    app.sdk.getUserInfoByGroup({ groupId: this.data.groupId}).then(res => {
      if (res.appCode == 'S0000') {
        // res.result.usersInGroup.forEach(item => {
        //   this.data.headMap[item.userId] = item.userHeadPic
        //   this.data.nameMap[item.userId] = item.userNameInGroup
        // })
        // this.setData({
        //   headMap: this.data.headMap,
        //   nameMap: this.data.nameMap
        // })
        this.getUserIdByGroupIds()
        console.log('history2')
        this.getHistoryMessage()   // 获取历史消息记录
      } else {
        wx.showToast({
          title: res.appMesg,
          icon: 'none'
        })
      }
    }).catch(error => {
      wx.showToast({
        title: '请求失败',
        icon: 'none'
      })
    })
  },
  // ------------------ 与客服聊天------------------
  chatWithCustomerService(){
    app.sdk.chatWithCustomerService().then(res => {
      if (res.appCode == 'S0000') {
        this.setData({
          groupId: res.result
        })
        this.getUserInfoByGroup()
      } else if (res.appCode == 'E800048') {
        let waitNum = res.appMesg && res.appMesg.split(':')[1]
        this.setData({
          waitNum: waitNum,
          groupId: res.result
        })
        this.getUserInfoByGroup()
      } else {
        wx.showToast({
          title: res.appMesg,
          icon: 'none'
        })
      }
    }).catch(error => {
      wx.showToast({
        title: '与客服建立连接失败',
        icon: 'none'
      })
    })
  },
  // -------------------获取聊天消息记录---------------------
  getHistoryMessage() {
    var that = this
    let params = {
      'page': this.data.pageNum,
      'size': this.data.pageSize,
      'param': {
        'beforeMessageId': this.data.beforeMessageId,
        'groupId': this.data.groupId
      }
    }
    app.sdk.getHistoryMessage(params).then(res => {
      if (res.appCode == 'S0000') {
        wx.hideLoading()
        // this.data.messageList.length = 0
        let arr_len=res.result.length-1
        
        this.setData({
          messageList: this.data.messageList,
          // messageList: this.data.messageList.concat(res.result),
          beforeMessageId: res.result[arr_len].id,
          lastMsgId:res.result[0].id
        })
        if (res.result && !res.result.length) return
        // -----------已读消息回执 ---------------
        // this.sendMessageAck({ 
        //   groupId: this.data.groupId,
        //   lastMsgId: res.result[0].id+''
        // })
        //-----------处理消息列表---------------
        // res.result.reverse()
        res.result.forEach((item,index) => {
          this.messageHandle(item,2)
        })
        // ---------添加聊天时间(聊天间隔超过10分钟添加一条）-----------
        let arr = this.data.messageList
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i]
          if (i >= 1 && item.createTime) {
            if ((item.createTime -  arr[i-1].createTime)/60000 >= 10) {
              let timeobj = {
                istime: true,
                time: imFormatTime(new Date(item.createTime))
              }
              arr.splice(i,0,timeobj)
              i++
            }
          }
          
        }

       arr.unshift({
          istime: true,
          time: imFormatTime(new Date(arr[0].createTime))
        })

        let len = arr.length - 1
        this.setData({
          messageList: arr
        })
        if(this.data.pageNum == 1){
          // -----------已读消息回执 ---------------
          this.sendMessageAck({ 
            groupId: this.data.groupId,
            lastMsgId: res.result[0].id+''
          })
          this.setData({
            toView: 'massage_' + this.data.messageList[len].id
          })
          // 条数少时 加padding
          if(res.result.length ==1){
            this.setData({
              padTop1:true
            })
          }
          if(res.result.length ==2){
            this.setData({
              padTop2:true
            })
          }
          if(res.result.length ==3){
            this.setData({
              padTop2:true
            })
          }
        }else {
          this.setData({
            toView:'massage_' + this.data.lastMsgId
          })
        }
        
      } else {
        wx.showToast({
          title: res.appMesg,
        })
      }
    }).catch( error => {
      console.log(error)
      // wx.showToast({
      //   title: '没有更多内容',
      //   icon: 'none'
      // })
    })

    
  },
  computedMessage(arr){ // -------------消息文字图片转换----------------
    let reg = /\[[\u4e00-\u9fa5]+\]/g
    let that = this
   arr.forEach(item => {
      if (item.isphoto || item.istime || item.isproduct) return;
      let mes = item.message
      if(mes){
        // mes = mes.replace(/\n/g,"&")
        mes = mes.replace(reg, (val, index) => {
          for (var key in that.data.emotionsObj) {
            if (val == that.data.emotionsObj[key]) {
            return `&${key}.png&`
            }
          }
        })
      }
      
      if(mes){
        var arr1 = mes.split('&')
      }
      let arr2 = []
      if(arr1){
        arr1 = arr1.filter(item => {
          return item
        })
      }
      if(arr1){
        arr1.forEach(ite => {
          if(ite.indexOf('.png') > -1) {
            arr2.push({
              type: 1,
              value: '/images/im/face/' + ite
            })
          } else {
            arr2.push({
              type: 2,
              value: ite
            })
          }
        })
      }
      
    item.mesArr = arr2
    })

   
  },
 
  checkEmotion() { // 弹出表情图片列表
    this.data.showEmotion = !this.data.showEmotion
    this.setData({
      showEmotion: this.data.showEmotion
    })
    if(this.data.showEmotion) {

      this.setData({
        showMore: false,
        toView: 'massage_'+this.data.messageList[this.data.messageList.length-1].id
      })
      console.log(this.data.messageList)
    }
  },
  focusEvent() {
    let that = this
    this.setData({
      infocus: true,
      sendEmotion:true,
      padJp:true
      // showEmotion:false
    })
  },
  blurEvent(){
    let that =this
    this.setData({
      showMore: false,
      showEmotion:false,
      infocus:false,
      sendEmotion:false,
      padJp:false
    })
    // setTimeout(function() {
    //   that.setData({
    //     inputvalue: ' '
    //   })
    // },100)
  },
  cleanHistoryMessage() { // 清空聊天历史记录
    let param1 = {
      "page": 1,
      "param": {
        "beforeMessageId": '',
        "groupId": this.data.groupId
      },
      "size": 1
    }
    app.sdk.getHistoryMessage(param1).then(res => {
      if(res.appCode == 'S0000'){
        let params = {
          groupId:this.data.groupId,
          messageId: res.result[0].id
        }
        app.sdk.cleanHistoryMessage(params).then(res => {
          if (res.appCode == 'S0000'){
            this.getUserInfoByGroup()
          } else {
            wx.showToast({
              title: res.appMesg,
              icon: 'none'
            })
          }
        })
      } else {
        wx.showToast({
          title: res.appMesg,
          icon: 'none'
        })
      }
    }).catch(error => {
      wx.showToast({
        title: '接口请求失败',
      })
    })
  },
  // deleteHandle() { // 删除消息
  //   let that = this
  //   wx.showModal({
  //     title: '',
  //     content: '确定清除全部历史记录？',
  //     success(res) {
  //       if (res.confirm) {
  //         that.cleanHistoryMessage()
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
  inputEvent(e) { // 输入文字消息
    this.data.inputvalue = e.detail.value
    this.setData({
      inputvalue: this.data.inputvalue
    })
  },
  //--------------------选择表情图片------------------------
  chooseEmotion(e) {
    let info = e.currentTarget.dataset.info
    let arr = info.split('/')
    let value = arr[arr.length-1].replace(/.png/g,'')
    if(value == "shanchu"){
      console.log('1111')
      let inputvalue = this.data.inputvalue
      if(inputvalue[inputvalue.length-1] ==']') {
        let n =inputvalue.lastIndexOf('[')
        inputvalue = inputvalue.substring(0,n)
        this.setData({
          inputvalue: inputvalue
        })
        return
      } else {
        inputvalue = inputvalue.substr(0,inputvalue.length -1)
        this.setData({
          inputvalue: inputvalue
        })
        return
      }
    }
    this.data.inputvalue += this.data.emotionsObj[value]
    this.setData({
      inputvalue: this.data.inputvalue,
      sendEmotion:true
    })
  },
  // -------------------------发送图片消息-----------------------
  chooseImage(type) {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success(res) {
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths[0]
      //tempFilePaths为要上传的本地文件的路径
        //----上传图片到oss  images/为oss目录
        let imgsrc = null
        uploadImage(tempFilePaths, "images/",
        function (data) {
          console.log("上传成功",data)
          //todo 做任何你想做的事
          imgsrc = 'https://waterelephant.oss-cn-shanghai.aliyuncs.com/' + data
          let params = {
            fromUserId: app.globalData.myInfo.id,
            groupId: that.data.groupId,
            content: imgsrc,
            contentType: 2,
            type: '1',
            signature: new Date().getTime()
          }
          if (that.data.chatType == 'service') {
            app.sdk.sendMessageToService(params).then(res => {
              that.afterSendMessage(imgsrc, true,false)
            })
          } else {
            console.log(params)
            app.sdk.sendMessage(params).then(res => {
              that.afterSendMessage(imgsrc,true,false)
            })
          }
          
        }, function (data) {
          console.log("上传失败",data)
          //todo 做任何你想做的事
          wx.showToast({
            title:data.statusCode,
            icon: 'none',
            duration: 2000
          })

        })

     }
    })
  },
  // 相册  拍照选择框
  chooseimage() {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: '#444444',
      cancleColor:'red',
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseImage('camera')
          }
        }
      }
    })
  },
  // 图片预览
  previewImg(e) {
    var imgUrl = e.currentTarget.dataset.item.message
    let message = []
    this.data.messageList.forEach((item,index) => {
      if(item.isphoto){
        message.push(item.message)
      }
    })
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls:message
    })
  },
    
  pageScrollToBottom() {
    wx.createSelectorQuery().select('.page-chat').boundingClientRect(function(rect){
      console.log(rect)
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
  // -------------------------------发送文字消息-------------------------
  postMessage() {
    let that = this
    if (!this.data.inputvalue) return
    let params = {
      fromUserId: app.globalData.myInfo.id,
      groupId: this.data.groupId,
      content: this.data.inputvalue,
      contentType: 1,
      type: '1',
      signature: new Date().getTime(),
    }
    if (this.data.chatType == 'service') {
      app.sdk.sendMessageToService(params).then(res => {
        this.afterSendMessage(params, false,false)
      })
    } else {
      console.log('发送消息：' + that.data.inputvalue)
      if (that.data.inputvalue == null || that.data.inputvalue == '' || that.data.inputvalue == ' ' || that.data.inputvalue == undefined) {
        console.log("发送空值")
      } else {
        app.sdk.sendMessage(params).then(res => {
          this.afterSendMessage(params, false, false)
          // 发送的消息添加到messageList里面

          setTimeout(function() {
            that.setData({
              inputvalue: ' '
            })
          },100)
        })
      }
      // app.sdk.sendMessage(params).then(res => {
      //   this.afterSendMessage(params,false,false)
      //   // 发送的消息添加到messageList里面

      //   setTimeout(function() {
      //     that.setData({
      //       inputvalue: ' '
      //     })
      //   },100)
      // })
    }
   
  },
  //--------------- 消息发送成功后页面相应变化----------------
  afterSendMessage(params,isphoto,isproduct){
      this.data.inputvalue = ''
    //   this.computedMessage(this.data.messageList)
    // }
    // let l = this.data.messageList.length - 1;
    this.setData({
      messageList: this.data.messageList,
      inputvalue: this.data.inputvalue,
      showEmotion: false,
      sendEmotion:false
    })
    // this.setData({
    //   toView: 'massage_' + l
    // })
    console.log(this.data.toView,'toview--------------------------------')
  },

  // },
  // 根据群组获取群中所有用户
  getUserIdByGroupIds: function() {
    let params = {
      groupIds: [this.data.groupId]
    }
    app.sdk.getUserIdByGroupIds(params).then(res => {
      if(res.appCode == "S0000"){
        let ImUserInfo = res.result[0].userIds
        let friendImUserId = []
        ImUserInfo.forEach((item,index) => {
          let {imUserId} = wx.getStorageSync('miniProgramUserinfo')
          for(let i=0;i<ImUserInfo.length;i++){
            if(ImUserInfo[i] != imUserId){
              friendImUserId.push(ImUserInfo[i])
            }
          }
        })
        this.getUserInfo(friendImUserId)
      }
    })
  },
  //根据群组里面imUserId获取用户头像 昵称
  getUserInfo:function(friendImUserId) {
    let userInfo = wx.getStorageSync('miniProgramUserinfo')
    let{uid,token} = userInfo
    app.ajax.postApi('getUsersByImUserIds',{
      uid,
      token,
      imUserIds:friendImUserId
    }).then( res => {
      var res = res.data
      if(res.status == '1') {
        let userInfo = res.data[0]
        this.setData({
          userInfo
        })
      }
    })
  },
  //点击商品去详情页
  goProductDetail(e){
    let info = e.currentTarget.dataset.info.message
    let {productNo,isActivity,activityNo} = info
    let url = '/pages/detail/detail?productNo=' + productNo + '&isActivity=' + isActivity + '&activityNo=' + activityNo
    wx.navigateTo({
      url
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(this.data.chatType == 'service') {
      let params = {
        initiativeUserId: app.globalData.myInfo.id,
        passiveUserId: ''
      }
      app.sdk.outLine(params).then(res => {
        if (res.appCode == 'S0000') {
          wx.switchTab({
            url: '/pages/massageList/massageList'
          })
        } else {
          wx.showToast({
            title: res.appMesg,
            icon: 'none'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    } else {
      // 分享之后后退到详情页
      // let entryNum = wx.getStorageSync('entryNum')
      // if(entryNum == '联系人'){
      //   wx.navigateTo({
      //     url:'/subPages/IM/ImInfoList/ImInfoList?entryNum=1'
      //   })
      // }
      // if(entryNum == '消息'){
      //   wx.navigateTo({
      //     url:'/subPages/IM/ImInfoList/ImInfoList?entryNum=2'
      //   })
      // }
      // if(entryNum == 'detail'){
      //   let info = JSON.parse(wx.getStorageSync('ImProductDetail'))
      //   let productNo = info.productNo
      //   let isActivity = info.isActivity || ''
      //   let activityNo = info.activityNo || ''
      //   if(productNo){
      //     wx.navigateTo({
      //       url:'/pages/detail/detail?productNo=' + productNo + '&isActivity=' + isActivity + '&activityNo=' + activityNo,
      //     })
      //   }
      // } 
      // if(entryNum.entryNum == 'fans'){
      //   let type = entryNum.invitationType
      //   wx.navigateTo({
      //     url:'/pages/vip/fans/fansIndex?type='+type
      //   })
      // }

      
    }
  },
  //选择图片 商品
  toggleEvent() {
    this.setData({
      showMore: !this.data.showMore,
      toView: 'massage_'+this.data.messageList[this.data.messageList.length-1].id
    })
    console.log(this.data.messageList[this.data.messageList.length-1].id)
    if(this.data.showMore){
      this.setData({
        showEmotion:false,
      })
    }
    
  },
  toProductlistEvent() {
    wx.navigateTo({
      url: `/subPages/IM/ImProductList/productList?username=${this.data.username}&groupId=${this.data.groupId}&chatType=${this.data.chatType}`
    })
  },
  // 分页
  refresh: function (e) {
    var self = this;
    let that=this
    this.data.pageNum++
    this.setData({
      pageNum:this.data.pageNum
    })
    setTimeout(function () {
    wx.showLoading({
      title: 'loading...',
    })
    that.getHistoryMessage()
    }, 300);
  },
  backEvent() {
    wx.switchTab({
        url: '/pages/massageList/massageList'
      })
  },
  // 随机字符串
  randomString(len) {
  　　len = len || 32;
  　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  　　var maxPos = $chars.length;
  　　var pwd = '';
  　　for (let i = 0; i < len; i++) {
  　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  　　}
  　　return pwd;
    }
  })
