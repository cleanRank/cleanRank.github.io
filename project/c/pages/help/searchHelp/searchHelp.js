// pages/help/searchHelp/searchHelp.js
var WxParse = require('../../detail/wxParse/wxParse.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchHisList:[], //搜索历史
    completeList:[],  //刷出的补充列表
    searchWord:'' ,    //预备搜索文案
    notYetSearch: true,
    noMorePage: false,
    pageReady: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调取搜索历史
    let searchHisList = wx.getStorageSync('historyQuestions') || []
    // if(searchHisList.length > 0){
    //   searchHisList.forEach((item) => {
    //     if(item.text && item.text.length > 6){
    //       item.text = item.text.slice(0,6) +'...'
    //     }
    //   })
    // }  
    this.setData({
      searchHisList: searchHisList
    })
  },

  //获取输入框中的文字
  getSearchWord(e){
    // 将回传的文字赋值给预搜索文案
    this.setData({
      searchWord: e.detail
    })
    // 如果文字非空，将文字传送给补全接口
    if(this.data.searchWord) {
      this.callCompleteApi(this.data.searchWord)
    } else {
      // 清空补全列表
      // 清空问题列表
      // 将未搜索改为true
      this.setData({
        'completeList':[],
        'questionList':[],
        'notYetSearch': true
      })
    }
  },
  //调用文字补全接口
  callCompleteApi(e){
    var that = this
    app.ajax.postApi('searchquestion',{
        'keyword': e
    }).then(res => {
      if(res.data.status == 1){
        let comData = res.data.questionList
        this.setData({
          questionList:comData,
          'notYetSearch': false,
          'formData.keyword':e
        })
        if(comData && comData.length > 0){
          let quesList = []
          for(let i=0;i<comData.length;i++){
            quesList.push(comData[i].question)
          }
          for(let a=0;a<quesList.length;a++){
            WxParse.wxParse('reply'+a,'html',quesList[a],that)
            if(a === quesList.length - 1){
              WxParse.wxParseTemArray('replyTemArray','reply',quesList.length,that)
            }
          }
        }
      }
      
    })
  },
  //点击搜索历史的标签
  skipSearchHis(e){
    let item = null 
    //判断是否WXML标签data传过来的，还是用组件trigger传过来的
    if(e.currentTarget.dataset.hasOwnProperty('item')) {
      item = e.currentTarget.dataset.item
    } else {
      item = e.detail
      this.setData({
        searchWord: item.text
      })
    }
    this.sendSearchFn(item.text)
    // 给子组件输入框赋值
    this.selectComponent("#searchCom").importVal(item.text)
    // var questionDetail = e.currentTarget.dataset.item
    // let answer = questionDetail.answer
    // let questionId = questionDetail.id
    // if(answer) {
    //   wx.navigateTo({
    //     url:'/pages/help/questionDetail/questionDetail?questionId='+ questionId
    //   })
    // }

  },
  //点击搜索按钮的方法
  searchFn() {
    if(this.data.searchWord) {
      this.sendSearchFn(this.data.searchWord)
    } else {
      wx.showToast({
        title:'请输入搜索内容',
        duration:2000,
        icon:'none'
      })
    }
  },
  // 发送搜索请求word需要搜索的关键字 needRecord
  sendSearchFn(word){
    //收起软键盘
    this.selectComponent("#searchCom").cancelFocus()
    //关闭待补全列表且清空内容
    this.setData({
      'completeList':[]
    })

    //发送搜词请求
    //此次是点击搜索按钮发起的请求，所以页码是1
    this.setData({
      'formData.pageNo': 1,
      'formData.keyword':word
    })
    this.searchWordReq()
  },

  //发送搜索关键字的请求
  searchWordReq(){
    //如果没有更多翻页数据了，则不用再发送请求
    if(this.data.noMorePage) {
      return
    }
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    const _this = this
    let formData = this.data.formData
    app.ajax.postApi('searchquestion',formData).then(res => {
      var that = this
      let questionList = res.data.questionList
      // 如果页码大于1，说明是翻页，数据再紧接着上一条记录
      if(formData.pageNo > 1) {
        wx.hideLoading()
        if(res.data.status == 1) {
          let temGoodsList = _this.data.questionList
          _this.setData({ questionList: temGoodsList.concat(questionList) })
        }else {
          _this.setData({
            'formData.pageNo': 0,
            'noMorePage': true
          })
          // 无记录
          wx.showToast({
            title: '没有更多商品了！',
            duration: 2000,
            icon: 'none'
          })
        }
        return
      }
      // 搜索商品列表第一页
      if (res.data.status == 1) {
        let comData = res.data.questionList
        // 搜索成功，给商品列表赋值，且表示已搜索过
        _this.setData({
          'questionList': res.data.questionList,
          'notYetSearch': false
        })

        console.log(comData)
        if(comData && comData.length > 0){
          let quesList = []
          for(let i=0;i<comData.length;i++){
            quesList.push(comData[i].question)
          }
          for(let a=0;a<quesList.length;a++){
            WxParse.wxParse('reply'+a,'html',quesList[a],that)
            if(a === quesList.length - 1){
              WxParse.wxParseTemArray('replyTemArray','reply',quesList.length,that)
            }
          }
        }

        // scroll回到顶部
        _this.backToTop()
      } else {
        // 搜索失败
        _this.setData({
          'questionList': [],
          'notYetSearch': false
        })

      }
      // 增加本地缓存记录
      _this.addHistoryStorage()
      wx.hideLoading()
    })
  },
  /**
   * 增加本地缓存
  */
  addHistoryStorage () {
    let historyStack = wx.getStorageSync('historyQuestions') || []
    if (historyStack.length >= 9) {
      historyStack.pop()
    }

    // 如果历史纪录栈中有数据，则遍历查找将其过滤掉
    if (historyStack.length) {
      historyStack = historyStack.filter(obj => {
        return obj.text != this.data.formData.keyword
      })
    }

    // 在历史记录栈中添加记录
    historyStack.unshift({ 'text': this.data.formData.keyword })
    // 将新搜索的字段存入本地且加到data中
    wx.setStorageSync('historyQuestions', [...new Set(historyStack)])
    this.setData({
      searchHisList: wx.getStorageSync('historyQuestions') || []
    })
  },
  /**
   * 点击了清空历史按钮
  */
  clearHisTips () {
    wx.setStorageSync('historyQuestions', [])
    this.setData({
      searchHisList: wx.getStorageSync('historyQuestions') || []
    })
  },
  /**
   * 滑动到底启动翻页
  */
  scrolltolower () {
    let formData = JSON.parse(JSON.stringify(this.data.formData))
    formData.pageNo += 1
    this.setData({ formData })
    this.searchWordReq()
  },
  backToTop () {
    this.setData({ 'topDistance': 0 })
  },
  goQuestionDetail(e){
    var questionDetail = e.currentTarget.dataset.item
    let answer = questionDetail.answer
    let questionId = questionDetail.id
    this.addHistoryStorage()
    if(answer) {
      wx.navigateTo({
        url:'/pages/help/questionDetail/questionDetail?questionId='+ questionId
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