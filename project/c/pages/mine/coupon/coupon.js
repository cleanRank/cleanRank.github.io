var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    pageNo: 1,
    pageCount: 1,
    countLen: 0,
    isshowRuleDesc: true,
    isEnbleClick: '0',
    type: 0, // 可使用红包
    couponList: [],
    nodataList: {
      imgSrc: '/images/noData/blank_adress_icon.png',
      text: '暂时还没有优惠券哦~',
      isShowbtn: 0,
      jumpUrl: '',
      btnTxt: ''
    },
    isLoding: false,
    datisEnbleClicka: 0,
    outstock: {
      type: 2,  
      modalTitle1: '您确定要删除吗？',
      confirmBtnTxt: '确定',
      cancelBtnTxt:'取消'
    },
    nolist:false
  },
  needCoupon(e) {
    let datisEnbleClicka = this.data.isEnbleClick
    var coupon = e.currentTarget.dataset.item || {}
    if (datisEnbleClicka == '1') {
      this.setData({
        datisEnbleClicka: 1
      })
      wx.setStorageSync('selectedRads', coupon)
      wx.navigateBack({
        delta: 1
      })
    }
  },
  //上拉加载更多
  onReachBottom() {
    // 可使用红包页面没有上拉加载
    if (this.data.type != 1) {
      let pageNo = this.data.pageNo
      pageNo += 1
      this.setData({
        pageNo: pageNo
      })
      this.getCouponList(1)
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      pageNo: 1
    })
    this.getCouponList()
  },
  //获取优惠券列表
  getCouponList(type) {
    if (this.data.pageCount && this.data.pageCount < this.data.pageNo) {
      this.setData({
        countLen: 1
      })
      return false
    }
    let pageNo = this.data.pageNo
    var { uid, token, mobile} = wx.getStorageSync('miniProgramUserinfo')
    var requestData = {
      uid: uid,
      token: token,
      mobile: mobile,
      pageNo: pageNo
    }
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    let couponList = this.data.couponList
    if (this.data.type == 1) {
      var redData = {
        uid,
        token,
        mobile,
        productData: this.data.productData
      }
    }
    app.ajax.postApi(this.data.type != 1 ? 'MyCouponShow' : 'QueryNotUseRedBag', this.data.type != 1 ? requestData : redData).then(res => {
      var res = res.data
      that.setData({
        isLoding: true
      })
      wx.hideLoading()
      if (res.status == 1) {
        this.setData({
          pageCount: res.pageCount
        })
        var data = res.data
        data.forEach((item) => {
          item.isshowRuleDesc = false
        })
        if (type == '1') {
          that.setData({
            couponList: this.data.couponList.concat(data)
          })
        } else {
          that.setData({
            couponList: data
          })
        }
        that.setData({
          isshowRuleDesc: true
        })
        // if(data.o){}
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        if(that.data.couponList.length==0){
          that.setData({
            nolist:true
          })
        }
      } else {
        
        // 失败提示
        //console.log(res.statusDetail)
  
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  cancelModal (){
    this.selectComponent("#modalBox").hideModal()
    wx.removeStorageSync('couponId')
  },
  //去使用
  goDetail (e){
    let linkType = e.target.dataset.linktype
    let linkUrl = e.target.dataset.linkurl
    let that = this
    setTimeout(function(){
      if (linkType == 1 && linkUrl) {
        //跳转商品详情
        wx.navigateTo({
          url: '/pages/detail/detail?productNo=' + linkUrl
        })
      } else if (linkType == 2 && linkUrl) {
        //跳转活动
        wx.navigateTo({
          url: '/pages/index/activityPage/activityPage?versionid=' + linkUrl,
        })
      }
    },140)
  },
  //删除优惠券
  handleDeleteProduct (e) {
    let couponId = e.target.dataset.id
    let index = e.target.dataset.eq
    wx.setStorageSync('couponId', couponId)
    this.selectComponent("#modalBox").showModal()
  },
  //删除优惠券方法
  deleteCoupon(){
    let dedata = wx.getStorageSync('couponId')
    var {
      uid,
      token
    } = wx.getStorageSync('miniProgramUserinfo')
    let deleData={
      couponId:dedata,
      uid,
      token
    }
    wx.showLoading({
      title: '删除中...',
      mask: true
    })
    app.ajax.postApi('DeleteCoupon',deleData).then(res => {
      if(res.data.status==1){
        wx.hideLoading()
        this.setData({
          pageNo:1
        })
        this.selectComponent("#modalBox").hideModal()
        wx.removeStorageSync('couponId')
        setTimeout(function(){
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000
          })
        },50)
        this.getCouponList()
      }
    })
  },
  // 查看优惠券使用规则
  rulesShow (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    console.log(this.data.couponList[index])
    this.data.couponList[index].isshowRuleDesc = !this.data.couponList[index].isshowRuleDesc
    this.setData({
      couponList: this.data.couponList
    })
  },
  onLoad: function(options) {
    var isEnbleClick = options.isEnbleClick
    var type = options.type || 0
    var productData = options.product
    if (isEnbleClick) {
      this.setData({
        isEnbleClick: isEnbleClick,
        type: type,
        productData: productData
      })
    }
  },
  onShow: function() {
    this.getCouponList()
  },
  /**
  * 处理touchstart事件
  */
  handleTouchStart(e) {
    if (this.data.isEnbleClick=='1'){
    return false
    }else{
      this.startX = e.touches[0].pageX
    }
  },
  /**
 * 处理touchend事件
 */
  handleTouchEnd(e) {
    if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -36) {
      this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
  },
  /**
 * 处理movable-view移动事件
 */
  handleMovableChange: function (e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x <= -36) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x > -72) {
      this.hideDeleteButton(e)
    }
  },
  /**
 * 显示删除按钮
 */
  showDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    let productList = this.data.couponList
    let that = this
    //所有归位，保持当前滑动
    productList.forEach(function(val,ind){
      if(ind!=productIndex){
        productList[ind].xmove=0
      }else{
        productList[productIndex].xmove = -74
      }
    })
    that.setData({
      couponList: productList
    })
  },
  /**
 * 隐藏删除按钮
 */
  hideDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    this.setXmove(productIndex, 0)
  },
  /**
 * 设置movable-view位移
 */
  setXmove: function (productIndex, xmove) {
    let productList = this.data.couponList
    productList[productIndex].xmove = xmove
    this.setData({
      couponList: productList
    })
  },
})