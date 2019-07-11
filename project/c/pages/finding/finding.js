
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageCount:20,
    pageNo:1,
    pageNum:1,
    articleList:[],
    ifHaveData:false,
    nodataList: {
      imgSrc: '../../images/noData/noCon.png',
      isShowbtn: 0,
      jumpUrl: '',
      btnTxt: '还没有内容哦~',
      btnTxtTwo: ''
    },
    flag:true
  },
  onLoad(option) {
    wx.setTabBarStyle({
      "selectedColor": "#FD455F"
    })
  },
  onShow(){
    wx.setTabBarStyle({
      "selectedColor": "#FD455F"
    })
  },
  onHide() {
  },
  // 点击tabbar 刷新当前页信息
  onTabItemTap: function (e) {
    let that = this
    if(this.data.flag){
      that.setData({
        articleList: [],
        pageNo: 1,
        pageNum: 1,
        ifHaveData: false,
        flag:false
      })
      that.getArticleList()
      app.onTabIndex = e.index
      //用户级别埋点
      app.getMemberLevel()
    }  
    setTimeout(function(){
      that.setData({
        flag:true
      })
    },500)
  },
  //上拉加载更多
  onReachBottom() {
    let pageNo = this.data.pageNo
    pageNo += 1
    this.setData({
      pageNo: pageNo
    })
    this.getArticleList()
  },
  //获取内容列表
  getArticleList(){
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    if (this.data.pageNum && this.data.pageNum < this.data.pageNo) {
      return false
    }
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    app.ajax.postApi('GetArticleList', {
      uid,
      token,
      pageCount: this.data.pageCount,
      pageNo:this.data.pageNo
    }).then(res => {
      wx.hideLoading()
      if (res.data.status==1){
        this.setData({
          articleList: this.data.articleList.concat(res.data.data),
          pageNum:res.data.pageCount,
          ifHaveData: false
        })
      }else{
        if (this.data.articleList.length==0){
          this.setData({
            ifHaveData: true
          })
        }
        wx.showToast({
          title: res.data.statusMessage,
          icon:'none',
          duration:2000
        })
      }
    })
  },
  toDetail(e){
    let id = e.currentTarget.dataset.id
    let resource = e.currentTarget.dataset.resource
    wx.navigateTo({
      url: '/pages/finding/detail/detail?id=' + id + "&resource=" + resource,
    })
  },
  productDetail(e){
    let info = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '/pages/detail/detail?productNo=' + info.productNo + '&isActivity=' + (info.isActivity ? info.isActivity : 0) + '&activityNo=' + (info.activityNo ? info.activityNo : '')
    })
  }
})