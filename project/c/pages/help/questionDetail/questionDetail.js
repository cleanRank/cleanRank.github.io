var WxParse = require('../../detail/wxParse/wxParse.js')
const app = getApp()
Page({
  data: {
    questionDetail: {}
  },
  onLoad: function (options) {
    console.log('222')
    console.log(options)
    var questionId = options.questionId
    this.setData({
      questionId
    })
    this.checkQuestion()
  },
  onShow: function () {
  },
  checkQuestion() {
    var that = this
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    let id = this.data.questionId
    let formData = {
      uid,
      token,
      id
    }
    app.ajax.postApi('checkquestion',formData).then(res => {
      wx.hideLoading()
      if(res.data.status == '1') {
        let questionDetail = res.data
        that.setData({
          questionDetail
        })
        if(questionDetail.question){  //title
          WxParse.wxParse('title','html',res.data.question,that,0)
        }
        if(questionDetail.answer) {
          WxParse.wxParse('answer', 'html', res.data.answer, that, 0);
        }
        if(questionDetail.relativeQuestionList){
          let relativeList = questionDetail.relativeQuestionList
          let relativeArr = []
          for(let i=0; i<relativeList.length; i++) {
            relativeArr.push(relativeList[i].question)
          }
          for(let a=0; a<relativeArr.length;a++) {
            WxParse.wxParse('reply'+a,'html',relativeArr[a],that);
            if(a === relativeArr.length - 1) {
              WxParse.wxParseTemArray('replyTemArray','reply',relativeArr.length,that)
            }
          }
        }
      }else {
        wx.showToast({
          title: res.statusDetail,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  goQuestionDetail(e) {
    var questionDetail = e.currentTarget.dataset.item
    let answer = questionDetail.answer
    let questionId = questionDetail.id
    if(answer) {
      wx.navigateTo({
        url:'/pages/help/questionDetail/questionDetail?questionId='+ questionId
      })
    }
  },
})