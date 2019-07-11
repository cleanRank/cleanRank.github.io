// pages/help/helpList/helpList.js
var WxParse = require('../../detail/wxParse/wxParse.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyNo:'',
    helpList:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let classifyNo = options.classifyNo
    let classifyName = decodeURI(options.classifyName)
    let status = options.status
    this.setData({
      classifyNo,
      classifyName,
      status
    })
    wx.setNavigationBarTitle({
      title: this.data.classifyName 
    })
    this.getQuestions()
  },

  getQuestions(){
    var that = this
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    let classifyNo = this.data.classifyNo
    
    if(this.data.status == 2) {
      let formData = {
        uid,
        token,
        classifyNo,
        firstClassifyNo:'',
        secondClassifyNo:''
      }
      app.ajax.postApi('subclassify',formData).then(res => {
        wx.hideLoading()
        if(res.data.status == '1') {
          let questionList = res.data.classifyList
          questionList.map((item,index) => {
            item.question = item.classifyName
          })
          that.setData({
            questionList,
            helpList:false
          })
          if(questionList && questionList.length > 0){
            let quesList = []
            for(let i=0;i<questionList.length;i++){
              quesList.push(questionList[i].question)
            }
            for(let a=0;a<quesList.length;a++){
              WxParse.wxParse('reply'+a,'html',quesList[a],that)
              if(a === quesList.length - 1){
                WxParse.wxParseTemArray('replyTemArray','reply',quesList.length,that)
              }
            }
          }
          
        }else{
          wx.showToast({
            title: res.statusDetail,
            duration: 2000,
            icon: 'none'
          })
        }
      })
    } else if(this.data.status == 3){
      let formData = {
        uid,
        token,
        classifyNo:'',
        firstClassifyNo:'',
        secondClassifyNo: classifyNo
      }
      app.ajax.postApi('getquestions',formData).then(res => {
        wx.hideLoading()
        if(res.data.status == '1') {
          let questionList = res.data.questionList
          that.setData({
            questionList,
            helpList:true
          })
          if(questionList && questionList.length > 0){
            let quesList = []
            for(let i=0;i<questionList.length;i++){
              quesList.push(questionList[i].question)
            }
            for(let a=0;a<quesList.length;a++){
              WxParse.wxParse('reply'+a,'html',quesList[a],that)
              if(a === quesList.length - 1){
                WxParse.wxParseTemArray('replyTemArray','reply',quesList.length,that)
              }
            }
          }
          
        }else{
          wx.showToast({
            title: res.statusDetail,
            duration: 2000,
            icon: 'none'
          })
        }
      })
    } else{
      let formData = {
        uid,
        token,
        classifyNo,
        firstClassifyNo:classifyNo,
        secondClassifyNo:''
      }
      app.ajax.postApi('getquestions',formData).then(res => {
        wx.hideLoading()
        if(res.data.status == '1') {
          let questionList = res.data.questionList
          that.setData({
            questionList,
            helpList:true
          })
          if(questionList && questionList.length > 0){
            let quesList = []
            for(let i=0;i<questionList.length;i++){
              quesList.push(questionList[i].question)
            }
            for(let a=0;a<quesList.length;a++){
              WxParse.wxParse('reply'+a,'html',quesList[a],that)
              if(a === quesList.length - 1){
                WxParse.wxParseTemArray('replyTemArray','reply',quesList.length,that)
              }
            }
          }
          
        }else{
          wx.showToast({
            title: res.statusDetail,
            duration: 2000,
            icon: 'none'
          })
        }
      })
    }
    
  },
  goQuestionDetail(e){
    let questionDetail = e.currentTarget.dataset.item
    let status = questionDetail.status
    let questionId = questionDetail.id
    let classifyNo = questionDetail.classifyNo
    if(status == 4){
      wx.navigateTo({
        url: '/pages/help/questionDetail/questionDetail?questionId='+ questionId
      })
    } else {
      let classifyName = encodeURI(questionDetail.classifyName)
      wx.navigateTo({
        url: '/pages/help/helpList/helpList?classifyNo=' +classifyNo+ '&classifyName=' +classifyName+'&status=' + status
      })

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})