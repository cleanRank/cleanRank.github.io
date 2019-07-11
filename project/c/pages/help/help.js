// pages/help/help.js
const app = getApp()
Page({
  // status [1表示没有二级分类，2表示有，3表示问题列表页，4表示跳转详情页]
  data:{
    helpList:'',
    hotword:''
  },
  onLoad: function() {
     this.getHelpInfo()
  },
  onShow: function () {
  },
  // 查询帮助中心信息
  getHelpInfo() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    let formData = {
      uid,
      token
    }
    app.ajax.postApi('getHelpInfo',formData).then( res => {
      wx.hideLoading()
      if(res.data.status == "1") {
        let helpList ={}
        if(res.data.hotQuestionList){
          res.data.hotQuestionList[0].title = "热门问题"
          helpList[0] = res.data.hotQuestionList
        }
        if(res.data.firstClassifyList) {
          res.data.firstClassifyList[0].title = "问题分类"
          helpList[1] = res.data.firstClassifyList
        }
        this.setData({
          helpList: helpList
        })
      } else {
        wx.showToast({
          title: res.statusDetail,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  goSearchPage(){
    wx.navigateTo({
      url:'/pages/help/searchHelp/searchHelp'
    })
  },
  goQuestion(e){
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

  }
})