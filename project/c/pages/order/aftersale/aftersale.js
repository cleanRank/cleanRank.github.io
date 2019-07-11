const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aIndex:0,
    list1:[],
    list2:[],
    searchWord:'',// 搜索的文字
    pageNo1:1,// 售后服务列表
    pageNo2:1,// 售后进度列表
    pageSize: 10,
    hasmoredata1:false,
    hasmoredata2:false,
    cancelModel:true,
    nodataList: {
      imgSrc: '/images/noData/blank_flow_icon.png',
      text: '您还没有相关订单哦~',
      isShowbtn: 0,
      jumpUrl: '',
      btnTxt: ''
    },
    pageName:'售后'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.data.pageNo1 = this.data.pageNo2 = 1
    this.data.hasmoredata1 = this.data.hasmoredata2 = true
    let aftersaleIndex = wx.getStorageSync('aftersaleIndex')
    this.setData({
      list1:[],
      list2:[]
    })

    if(aftersaleIndex==1){
      wx.removeStorageSync('aftersaleIndex')
      this.setData({
        aIndex:1
      })
      this.afterSaleProgressList(1)
    }else{
      let aIndex = this.data.aIndex
      if(aIndex==1){
        this.afterSaleProgressList(1)
      }else{
        this.afterSaleList(1)
      }
    }
    
    
    
    // 删除缓存在本地的地址信息
    try {
      wx.removeStorageSync('selectedAddress')
    } catch (e) {}

  },
  onUnload(){
    
  },
  /**
   * 去售后详情页
   */
  goToDetail(e){
    let serviceOrderId = e.currentTarget.dataset.serviceorderid
    wx.navigateTo({
      url: "/pages/order/aftersale/aftersaleDetail/aftersaleDetail?serviceOrderId=" + serviceOrderId
    })
  },
  /**
   * 去商品详情
   */
  detail(e){
    let productNo = e.currentTarget.dataset.productno
    let isActivity = e.currentTarget.dataset.isactivity
    let activityNo = e.currentTarget.dataset.activityno
    wx.navigateTo({
      url: `/pages/detail/detail?productNo=${productNo}&isActivity=${isActivity}&activityNo=${activityNo}`
    })
  },
  /**
   * tab栏切换
   */
  changeTab(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      aIndex:index
    })
    this.data.pageNo1 = this.data.pageNo2 = 1
    this.data.hasmoredata1 = this.data.hasmoredata2 = true
    if(index==0){
      this.setData({
        list1:[]
      })
      this.afterSaleList(1)
    }else{
      this.setData({
        searchWord:'',
        list2:[]
      })
      this.afterSaleProgressList(1)
    }
  },
  /**
   * 搜索输入
   */
  getSearchWord(e){
    this.setData({
      searchWord:e.detail
    })
  },
  /**
   * 搜索按钮
   */
  searchFn(e){
    if(e.detail==''){
      this.setData({
        searchWord:''
      })
    }
    this.data.pageNo1 = 1
    this.data.hasmoredata1 = true
    this.setData({
      list1:[]
    })
    this.afterSaleList(1)
  },
  /**
   * 售后服务列表
   */
  afterSaleList(pageNo) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let { searchWord,pageSize } = this.data
    let formData = {
      uid,
      token,
      searchWord,
      pageNo,
      pageSize
    }
    app.ajax.postApi('afterSaleList', formData).then(({ data: res }) => {
        wx.hideLoading()
        if (res.status == 1) {
          var res = res.data
          let hasmoredata1 = res.length<pageSize?false:true
          let list1 = this.data.list1
          let newList1=list1.concat(res)
          this.setData({
            list1:newList1,
            hasmoredata1
          })
        }else{
          let list1 = this.data.list1
          let newList1=list1.concat([])
          this.setData({
            list1:newList1,
            hasmoredata1:false
          })
          wx.showToast({
            title: res.statusMessage,
            duration: 2000,
            icon: 'none'
          })
        }
    })
  },
  /**
  * 售后进度列表
  */
 afterSaleProgressList(pageNo){
   wx.showLoading({
     title: '加载中...',
     mask: true
   })
   let { uid, token } = wx.getStorageSync('miniProgramUserinfo')   
   let { pageSize } = this.data
   let formData = {
     uid,
     token,
     pageNo,
     pageSize
   }
   app.ajax.postApi('afterSaleProgressList', formData).then(({ data: res }) => {
       wx.hideLoading()
       if (res.status == 1) {
          var res = res.data
          let hasmoredata2 = res.length<pageSize?false:true
          let list2 = this.data.list2
          let newList2=list2.concat(res)
          this.setData({
            list2:newList2,
            hasmoredata2
          })
       }else{
        let list2 = this.data.list2
        let newList2=list2.concat([])
        this.setData({
          list2:newList2,
          hasmoredata2:false
        })
         wx.showToast({
           title: res.statusMessage,
           duration: 2000,
           icon: 'none'
         })
       }
   })
 },
  /**
   * 申请售后服务
   */
  afterSaleApply(e){
    let orderId = e.currentTarget.dataset.orderid
    let canAfterSale = e.currentTarget.dataset.canaftersale
    if (!canAfterSale || canAfterSale == 0){
      return;
    }
    wx.navigateTo({
      url: "/pages/order/aftersale/applyAftersale/applyAftersale?orderId=" + orderId
    })
  },
  /**
   * 售后服务列表触底事件
   */
  lower1(e){
    let { pageNo1,hasmoredata1 } = this.data
    
    // 有更多数据才去请求
    if(hasmoredata1){
      this.data.pageNo1 = pageNo1 += 1
      this.afterSaleList(pageNo1)
    }
  },
  /**
   * 售后进度列表触底事件
   */
  lower2(){
    let { pageNo2,hasmoredata2 } = this.data
    // 有更多数据才去请求
    if(hasmoredata2){
      this.data.pageNo2 = pageNo2 += 1
      this.afterSaleProgressList(pageNo2)
    }
  },
  /**
   * 寄送商品
   */
  handelSend(e){
    let serviceOrderId = e.currentTarget.dataset.serviceorderid
    let url = '/pages/order/aftersale/sendMsg/sendMsg?serviceOrderId='+serviceOrderId
    wx.navigateTo({
      url
    })
  },
  /**
   * 取消申请按钮
   */
  handelCancel(e){
    let serviceOrderId = e.currentTarget.dataset.serviceorderid
    this.setData({
      cancelModel:false,
      serviceOrderId
    })
  },
  /**
   * 弹框取消
   */
  cancel(){
    this.setData({
      cancelModel:true
    })
  },
  /**
   * 弹框确定
   */
  confirm(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let { serviceOrderId } = this.data
    let formData = {
      uid,
      token,
      serviceOrderId
    }
    app.ajax.postApi('afterSaleProgressCancel', formData).then(({ data: res }) => {
      wx.hideLoading()
      if (res.status == 1) {
        this.setData({
          cancelModel:true
        })
        this.setData({
          list2:[]
        })
        this.afterSaleProgressList(1)
      }else{
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      }

    })
  }




})