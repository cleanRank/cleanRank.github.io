
//index.js
// 12.24 跳转商品详情：
// pages / detail / detail ? productNo = sxyp1540007583489 & isActivity=0 & activityNo=
//获取应用实例
const app = getApp()
Page({

  data: {
    token:"",
    uid:'',
    ishowPromotion: false,//是否隐藏推广，0.不展示
    seckillIndex:0,
    pageIndex:1,//分页用到
    currentPageData:{},
    listFloor:[],
    newList:{},
    categories: ['全部'],
    currentTab: 0,
    scrollLeftValue: 0,
    mainScrollLeftValue:0,
    isPickerShow: false,
    isBgNeed: false,
    bannerhome2:[],
    bannerhome:[],
    hotword:'',
    navigation:[],
    productfloor:[],
    topCategory:[],
    loadMoreHidden:true,
    loadMoreTitle:'加载中...',
    seckillStatus: 0,//秒杀状态,1-已开始，0-未开始
    ifhasSekill:false,//当前活动页是否有秒杀楼层
    pageName:'首页',
    adSwiper:{
      indicatorDots:false,
      autoplay:false,
      interval:4000,
      duration:500,
      circular:true,

    },
    scrollTop:0,
    closeVideo:false
  },
  goSearchPage () {
    wx.navigateTo({
      url: '/pages/search/search?form=index'
    })
  },
  onPullDownRefresh () {
    wx.stopPullDownRefresh()
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.loadActData('down') // 更新数据
  },
  navbarTap: function (e) {
    //将顶部导航栏自动移动到合适的位置
    //console.log(e) 
    var idx = e.currentTarget.dataset.idx 
    this.autoScrollTopNav(idx, e.currentTarget.offsetLeft - e.detail.x * 0.5 ) 

    //自动收回
    if (this.data.isPickerShow) {
      this.navbarBtnClick() 
    }
    this.setData({
      currentTab: idx,
      pageIndex: 1,
      listFloor: [],
    })
    this.activityItemClick() 
  },
  onLoad: function (options) {
    wx.setTabBarStyle({
      "selectedColor": "#FD455F"
    })
    this.getUserInfo()
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    // 导航栏的title的数据请求
    app.ajax.postApi('Index', {
    }).then(res => {
      wx.hideLoading()
      var res = res.data
      if (res.status == 1) {
        // 成功
        // 处理数据
        var data = res.data
        that.setData({
          hotword: res.hotWord,
          topCategory: data,
          pageIndex: 1
        })
        this.loadActData()
      } else {
        // 失败提示
        // wx.showToast({
        //   title: res.statusDetail,
        //   duration: 2000
        // })
      }
    })
    this.getAdStatus()
  },
  onTabItemTap: function (e) {
    app.onTabIndex = e.index
    console.log('111' + e.index)
    //用户级别埋点
    app.getMemberLevel()
  },
  //获取地理位置
  getLocation: function (){
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.setStorageSync("wxlocation", res)
        //弹框
        wx.showModal({
          title: '当前位置',
          content: "纬度:" + latitude + ",经度:" + longitude,
        })
      }
    })
  },
  getUserInfo: function () {
    try {
      const value = wx.getStorageSync('miniProgramUserinfo')
      if (value) {
        //console.log(value['token'])
        this.setData({
          token: value['token'],
          uid: value['uid']
        })
      }
    } catch (e) { }
  },
  // 活动页面的
  activityItemClick:function(e){
    this.setData({
      pageIndex : 1,
      loadActData:false,
    })
    this.loadActData()
  },
  loadActData:function(type){
    let that = this
    var topCategoryItem = this.data.topCategory[this.data.currentTab]
    var loadingTxt = '加载中...'
    if (type == 'down') {
      loadingTxt = '正在刷新...'
    }
    wx.showLoading({
      title: loadingTxt
    })
    app.ajax.postApi('ActiveTemplateNew', {
      // versionId: 'v1559530824931',
      versionId: topCategoryItem.versionId,
      // versionId:'v1560254032261',
      // versionId:'v1560409347501',
      uid:that.data.uid
    }).then(res => {
      if (type =='down') {
        wx.hideNavigationBarLoading() //完成停止加载
      }
      wx.hideLoading()
      var res = res.data
      if (res.status == 1) {
        // myDictionary.add(category.h5Url,res.data)
        // 成功
        // 处理数据
        let pageIndex = that.data.pageIndex
        that.setData({
          newList:res.data
        })
        if(pageIndex == 1){
          that.setData({
            currentPageData:res.data,
            listFloor: res.data.listFloor,
            ishowPromotion: res.data.rebateStatus== 0 ? true:false,
          })
          let listFloor = that.data.listFloor 
          for (let index in listFloor) {
            let data = listFloor[index]
            if (data.floorType == 6 && data.activityInfos.length>0) {//秒杀
              let activityInfos = data.activityInfos
              let status = activityInfos[0].status
              that.setData({
                seckillStatus: status,
                seckillIndex:0,
                ifhasSekill:true,
              })
            }
          }
        }else{
          let listFloor = that.data.listFloor 
          
          that.setData({
            listFloor: listFloor.concat(res.data.listFloor)
          })
        }
        
      } else {
        that.setData({
          currentPageData: null
        })
      }
    })
  },
 /**
   * 导航栏右侧箭头按钮点击事件 - 切换模糊背景开闭状态以及展开栏开闭状态
   */
  navbarBtnClick: function(e) {
    this.data.isBgNeed = !this.data.isPickerShow
    this.setData({
        isBgNeed: this.data.isBgNeed
    })

    this.data.isPickerShow = !this.data.isPickerShow
    this.setData({
      isPickerShow: this.data.isPickerShow,
    })
  },
  onSlideChangeEnd: function (e) {
    var that = this 
    that.setData({
      current : e.detail.current + 1
    })
  },
  /**
   * 页面左右滑动事件 - 构造滑动动画，若当前页面无数据，自动加载，需要完善加载函数
   */
  swiperChange: function (e) {
    var idx = e.detail.current 
    //console.log(e) 
    // var comt = 
    // this.autoScrollTopNav(idx, e.currentTarget.offsetLeft - e.detail.x) 

    this.setData({
      currentTab: e.detail.current,
    })

    //若无数据，自动加载
    if (this.data.topCategory[idx].length == 0) {
      this.downloadMoreItem() 
    }
    // this.activityItemClick() 
  },

  /**
     * 导航栏右侧箭头按钮点击事件 - 切换模糊背景开闭状态以及展开栏开闭状态
     */
  navbarBtnClick: function (e) {
    this.data.isBgNeed = !this.data.isPickerShow
    this.setData({
      isBgNeed: this.data.isBgNeed
    })

    this.data.isPickerShow = !this.data.isPickerShow
    this.setData({
      isPickerShow: this.data.isPickerShow,
    })
  },

  /**
   * 用于自动调整顶部类别滑动栏滑动距离，使滑动到用户可接受的合适位置，但自适应上还未考虑太周到
   * @param {number} idx - The index of currentTap.
   */
  autoScrollTopNav: function (idx,x) {
    ////console.log(x) 
    if (idx <= 2) {
      this.data.scrollLeftValue = 0 
    } else {
      this.data.scrollLeftValue = x //(idx - 2) * 60 
    }
    this.setData({
      scrollLeftValue: this.data.scrollLeftValue,
      // mainScrollLeftValue: this.data.currentTab * wx.getSystemInfoSync().windowWidth

    })
  },

  /**
   * 模糊背景点击事件 - 点击模糊背景取消选择
   */
  bgTap: function (e) {
    if (this.data.isPickerShow) {
      this.navbarBtnClick() 
    } else {
      return 
    }
  },
  // 商品
  productClick:function(e){
      //console.log(e.currentTarget.dataset.productno)
    let productno = e.currentTarget.dataset.productno 
    let isActivity = e.currentTarget.dataset.isactivity 
    let activityNo = e.currentTarget.dataset.activityno 
      wx.navigateTo({
        url: '../detail/detail?productNo=' + productno + '&isActivity=' + isActivity + '&activityNo=' + activityNo,
      })
  },
  // 直购或者加车
  putShopCartOrBuy: function (e) {
    //console.log(e.currentTarget.dataset) 
    let status = e.currentTarget.dataset.status 
    if(status == 0){//加车

    }
    else if(status == 1){//直购
    
    }
  },
  onShow() {
    let that=this
    wx.setTabBarStyle({
      "selectedColor": "#FD455F"
    })
    if (this.data.ifhasSekill){
      this.loadActData()
    }
    this.setData({
      closeVideo:false,
      scrollTop: 0
    })
    //tabbar切换触发事件，通知组件初始化视频
    setTimeout(function(){
      that.setData({
        closeVideo: true
      })
    })
    wx.removeStorageSync('addressFrom')
    wx.removeStorageSync("video_arr")
    wx.removeStorageSync("playIndex")
    const query = wx.createSelectorQuery().in(this);
    query.select('.navbar').boundingClientRect((res) => {
      that.setData({
        headTop:res.height
      })
    }).exec()
  },
  onHide(){
    wx.removeStorageSync("video_arr")
    wx.removeStorageSync("playIndex")
  },
  onUnload(){
    wx.removeStorageSync("video_arr")
    wx.removeStorageSync("playIndex")
  },
  // 关闭首页弹窗
  closeAdvertising: function () {
    this.setData({
      adFlag: false
    })
  },
  getAdStatus: function () {
    var { uid } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('getWindowsAdvertise', {
      uid
    }).then(res => {
      var res = res.data
      this.setData({
        adFlag: true,
        adList: res.data
      })
      if (res.status == '1') {
        this.setData({
          adFlag: true,
          adList: res.data
        })
      } else {
        this.setData({
          adFlag: false,
          adList: []
        })
      }
    })
  },
  adDetail: function (e) {
    var detail = e.currentTarget.dataset.detail
    if (detail.type == '4') {
      wx.navigateTo({
        url: `../detail/detail?productNo=${detail.address}`
      })
    } else if (detail.type == '2') {
      let url = `/pages/index/activityPage/activityPage?versionid=${detail.address}`
      // 红包特殊活动
      if (detail.address == '888') {
        url = '../../activityPages/pages/newYearRedEnvelop/newYearRedEnvelop'
      }
      wx.navigateTo({
        url
      })
      
    }
  },
  touchStart:function(e){
    this.setData({
      scrollTop: e.touches[0].pageY
    })
  }
})

