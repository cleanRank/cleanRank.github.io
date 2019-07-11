// pages/order/order.js
const app = getApp()
const pay = require('../../utils/pay.js')
const token = require('../../utils/getToken.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0, //tab 索引
    currentInd:0,    //tab选择 orderstatus
    pageNo: 1,
    token: '',
    uid: '',
    dataSource: [],
    isLoding: false,
    orderStatusString: {
      1: "待支付",
      2: "待发货",
      3: "待收货",
      4: "待评价",
      5: "已取消",
      7: "已支付",
      8: "已完成"
    },
    navItems: ['全部订单', '待支付', '待发货', '待收货', '待评价', '已完成'],
    nodataList: {
      imgSrc: '../../images/noData/blank_flow_icon.png',
      text: '您还没有相关订单哦~',
      isShowbtn: 0,
      jumpUrl: '',
      btnTxt: ''
    },
    promotionFlag:false,// 是否显示晒单按钮
    pageName:'订单列表',
    modalTitle: '您确认收到货了吗？',
    outstock:{
      type: 1,  //设置弹框按钮数量  1  2
      modalTitle1: '商品已售光，去逛逛别的商品吧...',
      confirmBtnTxt:'去首页'
    },
    outstock2: {
      type: 2,  //设置弹框按钮数量  1  2
      modalTitle1: '删除后,将看不到该笔订单',
      confirmBtnTxt: '确定',
      cancelBtnTxt:"取消",
      modalTop:'确认删除订单?'
    },
    index:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      currentIndex: options.selectIndx || 0,
      currentInd:options.selectIndx || 0
    })
    // 处理数据 
    this.getOrderList(true)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      pageNo: 1
    })
    // 处理数据 
    // this.getOrderList(true)
  },
  onHide: function(){
    wx.removeStorageSync("orderid")
    wx.removeStorageSync("dele_order_eq")
  },
  onUnload:function(){
    wx.removeStorageSync("orderid")
    wx.removeStorageSync("dele_order_eq")
  },
  /**
   * 获取列表请求
   */
  getOrderList: function(event) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    var { token, uid } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('QueryOrderList', {
      'pageNo': this.data.pageNo,
      "orderStatus": this.data.currentInd,
      uid,
      token
    }).then(res => {
      wx.hideLoading()
      if (event) {
        that.setData({
          dataSource: [],
          isLoding: true
        })
      }
      var res = res.data
      if (res.status == 1) {
        // 成功
        // 处理数据 
        var data = res.data
        // for (let a = 0; a < data.length; a++) {
        //   data[a].orderTime = that.dataformatTime(data[a].orderTime)
        // }
        that.setData({
          dataSource: that.data.dataSource.concat(data)
        })
      }
    })
  },
  // 标题切换事件
  tapName: function(event) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let index = event.currentTarget.dataset.index
    if(event.currentTarget.dataset.index == 5){
      index = 40
    }
    this.setData({
      currentIndex: event.currentTarget.dataset.index,
      currentInd:index,
      dataSource: [],
      pageNo: 1,
    })
    this.getOrderList(true)
  },
  // list 点击事件
  listClick: function(event) {
    var index = event.currentTarget.dataset.index
    var listData = this.data.dataSource[index]
    wx.navigateTo({
      url: "/subPages/order/orderDetail/orderDetail?orderId=" + listData.orderId
    })
  },
  /**
   * 查看物流
   */
  checkLogistics: function(event) {
    var index = event.currentTarget.dataset.index
    var listData = this.data.dataSource[index]
    //console.log(listData.orderId)
    wx.navigateTo({
      url: "/subPages/order/logistics/logistics?orderId=" + listData.orderId
    })
  },
  // 确认收货
  confirmReceipt:function(event) {
    let index = event.currentTarget.dataset.index
  },
  /**
   * 联系客服
   */
  contactService: function() {
    wx.navigateTo({
      url: "/subPages/mine/contactCS/contactCS"
    })
  },
  /**
   * 订单详情跳转到到商品详情
   */
  orderDetialClick: function(event) {
    if (this.data.dataSource.length == 0) {
      return
    }
    var index = event.currentTarget.dataset.index
    var listData = this.data.dataSource[index]
    wx.navigateTo({
      url: "/pages/detail/detail" + "?productNo=" + listData.productNo + "&" + "isActivity=" + listData.isactivity + "&" + "activityNo=" + listData.activityNo
    })
  },
  /**
   * 取消订单
   */
  cancelOrder: function(event) {
    var index = event
    var listData = this.data.dataSource[index]
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.getUserToken.getToken().then(res => {
      var res = res
      wx.hideLoading()
      if (res.status == 1) {
        var { token, uid } = wx.getStorageSync('miniProgramUserinfo')
        app.ajax.postApi('CancelOrdernew', {
          'orderId': listData.orderId,
          uid,
          token
        }).then(res => {
          var res = res.data
          if (res.status == 1) {
            // 成功
            // 处理数据 
            // this.getOrderList(true)
              if(that.data.currentIndex == 0){//全部订单，只需要修改状态即可
                  listData.orderStatus = 5;
                  ////console.log(listData);
                  var datas = that.data.dataSource
                  that.setData({
                    dataSource: datas
                  })
              }else if(that.data.currentIndex == 1){//待支付，需要删除该数据
                that.data.dataSource.splice(index,1)
                var data = that.data.dataSource
                that.setData({
                  dataSource:data
                })
              }
          } else {
            // 失败提示
            wx.showToast({
              title: res.statusDetail,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  cancelOredrClick: function(event) {
    let that = this
    wx.showModal({
      title: '',
      content: '您确定要取消该订单？',
      success(res) {
        if (res.confirm) {
          var index = event.currentTarget.dataset.index
          that.cancelOrder(index)
        } else if (res.cancel) {
        }
      }
    })
  },
  /**
   * 刷新
   */
  upper: function(e) {},
  lower: function(e) {
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.getOrderList(false)
  },

  /**
   * 支付
   */
  wxpay: function(event) {
    var that = this
    token.getToken()
    var index = event.currentTarget.dataset.index
    var listData = this.data.dataSource[index]

    let senObj = this.getSenObj() //埋点
    pay.wxPayment(listData.orderId,senObj, function (e) {
      if(e.noGoods){
        that.selectComponent("#modalBox1").showModal()
        that.setData({
          orderId: e.orderId
        })
      }
    })
  },
  dataformatTime(number) {
    var n = parseInt(number)
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return (Y + M + D +' ' + h + ':'+ m + ':' + s )
  },
  // 推广弹窗隐藏 组件接受操作
  promotionClose(e) {
    var flag = e.detail.flag
    this.setData({
      promotionFlag: flag
    })
  },
  /**
   * 评论
   */
  appraise(e){
    let index = e.currentTarget.dataset.index
    let listData = JSON.stringify(this.data.dataSource[index])
    wx.navigateTo({
      url: `/subPages/order/appraise/appraise?listData=${listData}`
    })
  },
  /**
   * 提醒发货
   */
  remaind(e){
    let index = e.currentTarget.dataset.index
    let listData = this.data.dataSource[index]
    console.log(listData)
    wx.showToast({
      title:"提醒卖家发货发送消息成功",
      duration: 2000,
      icon: 'none'
    })
  },
  /**
   * 晒单
   */
  showOrder(e) {
    let index = e.currentTarget.dataset.index
    let listData = this.data.dataSource[index]
    this.setData({
      activeData: listData
    })
    console.log(listData)

    wx.showLoading({
      title: '加载晒单信息...',
      mask: true
    })
    app.getUserToken.getToken().then(res => {
      var res = res
      if (res.status == 1) {
        var { uid, token, inviteCode } = wx.getStorageSync('miniProgramUserinfo')
        let { orderId } = listData;
        app.ajax.postApi('productCommentShare', {
          page: 'pages/order/order',
          width: 300,
          uid,
          token,
          orderId
        }).then(({
          data: res
        }) => {
          wx.hideLoading()
          if (res.status == '1') {
            console.log(res.data)
            let promotionData = { shareImg: res.data.pic}
            this.setData({
              promotionData,
              promotionFlag: true
            })
          } else {
            wx.showToast({
              title: res.statusDetail,
              duration: 2000,
              icon: 'none'
            })
          }
        })
      }
    })
  },
  /**
   * 分享
   */
  onShareAppMessage(option) {
    let activeData = this.data.activeData
    let price = parseFloat(activeData.productPrice)
    let title = activeData.productName
    let path = `/pages/detail/detail?productNo=${activeData.productNo}&isActivity=${activeData.isactivity}&activityNo=${activeData.activityNo}&back=1`
    let imageUrl = this.data.promotionData.shareImg
    return {
      title:'【仅需'+price+'元】'+ title,
      path,
      imageUrl
    }
  },
  //获取预置属性
  getSenObj(){
    let memberInfo = wx.getStorageSync('miniProgramUserinfo') || ''
    let partnerOrNot = memberInfo.memberLevel && memberInfo.memberLevel > 0 ? true: false
    var partnershipLevel= ""
    if(partnerOrNot) {
      partnershipLevel =  memberInfo.memberLevel == 1 ? '初级' :'中级'
    }
    var senObj = {
      distinctId:app.sensors.store.getDistinctId(),
      properties:app.sensors.getPresetProperties()
    } //埋点
    senObj.properties.partnerOrNot = partnerOrNot
    senObj.properties.partnershipLevel = partnershipLevel
    senObj.properties.moduleSource = this.data.fromPag
    senObj.properties.platform_type = "小程序"
    return senObj;
  },
  //点击确认收货
  confirmReceipt(e) {
    let indexVal = e.currentTarget.dataset.index
    this.setData({
      indexVal
    })
    this.selectComponent("#modalBox").showModal()
  },
  //确认收货
  confirmReceive() {
    var that = this
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    let {orderId} = this.data.dataSource[this.data.indexVal]
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    app.ajax.postApi('confirmReceipt', {
      uid,
      token,
      orderId
    }).then(res => {
      wx.hideLoading()
      var res = res.data
      let index = that.data.currentIndex
      that.selectComponent("#modalBox").hideModal()
      if(res.status == 1) {
        that.setData({
          currentIndex: index,
          dataSource:[],
          pageNo:1
        })
        that.getOrderList(true)
      } else {
        wx.showToast({
          title:res.statusDetail,
          icon:'none',
          duration: 2000
        })
      }
    })

  },
  //取消确认收货弹框
  cancelReceive() {
    this.setData({
      indexVal:0
    })
    this.selectComponent("#modalBox").hideModal()
  },
  // 去首页
  goIndex(){
    this.selectComponent("#modalBox1").hideModal()
    wx.switchTab({
      url:'/pages/index/index'
    })
  },
  //删除订单
  orderDele(e){
    let orderid=e.target.dataset.orderid
    let eq = e.target.dataset.eq
    console.log("orderid:"+orderid)
    let that=this
    that.selectComponent("#modalBox2").showModal()
    wx.setStorageSync('orderid', orderid)
    wx.setStorageSync('dele_order_eq', eq)
  },
  deleteOr(e){
    let { token, uid } = wx.getStorageSync('miniProgramUserinfo')
    let orderId = wx.getStorageSync('orderid')
    let eq = wx.getStorageSync('dele_order_eq')
    let order_list = this.data.dataSource
    console.log("索引："+eq)
    app.ajax.getApi('OrderDelete', {
      uid,
      token,
      orderId
    }).then(res => {
      wx.hideLoading()
      this.selectComponent("#modalBox2").hideModal()
      if (res.data.status == 1) {
        order_list.splice(eq,1)
        this.setData({
          dataSource: order_list
        })
        setTimeout(function(){
          wx.showToast({
            title: '订单删除成功',
            icon: 'none',
            duration: 2000
          })
        },50)
      }else{
        wx.showToast({
          title: res.data.statusMessage,
          icon:'none',
          duration:2000
        })
      }
    })
  }
})