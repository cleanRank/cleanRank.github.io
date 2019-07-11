const app = getApp()
const pay = require('../../../utils/pay.js')

Page({
  data: {
    totalPrice: 0,
    // 用户信息
    userInfo: {},
    addresslist: [],
    selectedRads: {},
    selectedAddress: {},
    addressNo: "", //地址编号
    totalPrice: 0,
    totalQuantity: 0,
    totalRebate: 0,
    settleIncome:0,
    discountAmount: 0,
    bCoupon: false, //控制优惠券显示
    rendarrTemp: {
      fromPage: '',
      rebateStatus: 0,
      userChooseGoods: [],
      redBagId: '',
      redBagValue: '',
      isCrossBorder: 0
    },
    iCouponNum: 0,
    errorlist: [],
    errorlistFlag: false,
    orderId: '',
    isLoading: false,
    getCouponData: '', //跳转优惠券页面传参
    iSxtNum: 0,
    deduction: 0,
    keyboardFlag: false,
    bPay: true,
    curCard: {
      cardNo: '',
      leftAmount: ''
    },
    curCardList: [],
    overseas: {  //海外购
      bIdNumber:false,
      idNumber:''
    },
    mainSwitch: null,
    notSupport: false,
    noSupportInfo:'',
    noSupportModel:false,
    cartPrice:0 //活动优惠金额
  },
  onLoad(option) {
    var mainSwitch = app.mainSwitch
    var userInfo = wx.getStorageSync('miniProgramUserinfo')
    this.setData({
      userInfo,
      mainSwitch,
    })
    // 区分购物车还是详情页面
    var fromPage = option.fromPage
    let cartPrice = option.discountPrice || 0
    this.setData({
      "rendarrTemp.fromPage": fromPage,
      cartPrice
    })

    // fromPage页
    let pages = getCurrentPages();
    let prevPage = pages[pages.length -2]
    let info = prevPage.data
    this.setData({
      fromPag: info.pageName || ''
    })
  },
  onReady() {},
  onShow() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.pageLoaded()
  },
  onHide() {},
  onUnload() {
    // 删除缓存在本地的商品信息
    wx.removeStorage({
      key: 'userChooseGoods',
      success(res) {}
    })

    // 删除缓存在本地的地址信息
    try {
      wx.removeStorageSync('selectedAddress')
      wx.removeStorageSync('selectedRads')
      wx.removeStorageSync('curCard')
      wx.removeStorageSync('curCardList')
    } catch (e) {
      // Do something when catch error
    }
  },
  bindTextAreaBlur(e) {
    var index = e.currentTarget.dataset.index
    var val = e.detail.value
    const thisGood = this.data.rendarrTemp.userChooseGoods[index]
    thisGood.remark = val
    this.data.rendarrTemp.userChooseGoods.splice(index, 1, thisGood)
  },
  // init
  initOrder() {
    var totalPrice = 0 // 总金额
    var totalQuantity = 0 // 总数量
    var totalRebate = 0 // 返利
    var discountAmount = 0 // 总优惠金额
    this.data.rendarrTemp.userChooseGoods.map((_item, idx) => {
      totalRebate = totalRebate + (+_item.rebates * _item.quantity)
      totalPrice = totalPrice + (+_item.qualityProduct.price * _item.quantity)
      totalQuantity = totalQuantity + Number(_item.quantity)
      discountAmount = discountAmount + (+((_item.virtualPrice || _item.qualityProduct.price) - _item.qualityProduct.price) * _item.quantity)
    })
    this.setData({
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      iTotalPrice: parseFloat(totalPrice.toFixed(2)),
      totalQuantity,
      totalRebate: parseFloat(totalRebate.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2))
    })
  },
  pageLoaded() {
    // 从缓存内取出数据然后渲染
    this.rendArrTemp()
    // 回显优惠券
    this.myCouponShow()
    if (this.data.mainSwitch.sxtInstalment == '1') {
      // 查询可用水象通数量
      this.mySxtNum()
    }
    this.getSxtNo()
    // 收货地址
    if (!this.data.overseas.idNumber) {
      this.queryReceiptAddress()
    }
  },
  // 从缓存的信息回显到页面
  rendArrTemp() {
    // 获取缓存里面的订单信息
    var userChooseGoods = wx.getStorageSync('userChooseGoods')
    this.setData({
      "rendarrTemp.rebateStatus": userChooseGoods[0].rebateStatus || userChooseGoods[0].showRebates || 0,
      "rendarrTemp.userChooseGoods": userChooseGoods,
      "rendarrTemp.isCrossBorder": userChooseGoods[0].isCrossBorder
    })
    this.initOrder()
  },
  // 查询收货地址
  queryReceiptAddress() {
    var { uid, token} = wx.getStorageSync('miniProgramUserinfo')
    var selectedAddress = wx.getStorageSync('selectedAddress') || ''
    app.ajax.postApi('addressqQueryList', {
      pageNo: 1 // 当前页数
    }).then(({data:res}) => {
      wx.hideLoading()
      var res = res
      console.log(res)
      if (res.status == "1") {
        let addressObj = {}
        res.data.forEach((item, idx) => {
          if (selectedAddress.addressNo && item.addressNo == selectedAddress.addressNo) {
            addressObj = item
          } else {
            addressObj = res.data[0]
          }
        })
        if (selectedAddress.addressNo) {
          res.data.forEach((item, idx) => {
            if (item.addressNo == selectedAddress.addressNo) {
              addressObj = item
            }
          })
        } else {
          addressObj = res.data[0]
        }
        this.setData({
          addresslist: addressObj,
          "overseas.idNumber": addressObj.idNumber || '',
          "overseas.bIdNumber": addressObj.idNumber? true: false,
          addressNo: addressObj.addressNo
        })
        //判断是否在配送范围
        this.checkArea()
      } else if (res.status === "11") {
        wx.removeStorageSync('selectedAddress')
        this.setData({
          addresslist: [],
          addressNo: ''
        })
        wx.showModal({
          title: '',
          content: '请先添加收货地址',
          confirmText: '马上添加',
          confirmColor: '#ff3030',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../../mine/address/newAddres/newAddress'
              })
            }
          }
        })
      }
      this.setData({
        isLoading: true
      })
    })

  },
  //预估返利
  getSettleIncome(){
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let productData = this.initProductData(1)
    app.ajax.postApi('GetSettleIncome', {
      uid,
      token,
      productData,
      redBagId: this.data.rendarrTemp.redBagId
    }).then(({ data: res }) => {
      wx.hideLoading()
      if(res.status==1){
        this.setData({
          settleIncome:res.data
        })
      }
    })
  },
  // 查询可使用优惠券
  myCouponShow () {
    var selectedRads = wx.getStorageSync('selectedRads') || ''
    if (selectedRads) {
      if (Object.keys(selectedRads).length >0) {
        this.setData({
          "rendarrTemp.redBagId": selectedRads.id,
          "rendarrTemp.redBagValue": (+selectedRads.parValue)
        })
        this.setData({
          iCouponNum: 1
        })
      } else {
        this.setData({
          "rendarrTemp.redBagId": '',
          "rendarrTemp.redBagValue": ''
        })
      }
      console.log("选择优惠券：" + this.data.rendarrTemp.redBagId)
      this.getSettleIncome()
      return
    }
    var { uid, token, mobile } = wx.getStorageSync('miniProgramUserinfo')
    const productData = this.initProductData(0) // 初始化查询可使用红包的商品信息
    app.ajax.postApi('QueryNotUseRedBag', {
      uid,
      token,
      mobile,
      productData
    }).then(({data: res}) => {
      wx.hideLoading()
      if (res.status == '1' && res.data.length>0) {
        this.setData({
          "rendarrTemp.redBagId": res.data[0].id,
          "rendarrTemp.redBagValue": (+res.data[0].parValue)
        })
        this.setData({
          iCouponNum: res.data.length
        })
      }
      this.getSettleIncome()
    })
  },
  // 查询水象通可用卡数量
  mySxtNum() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    var { token, uid } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('querySxtCount', {
      uid,
      token,
      usableStatus: 1
    }).then(({ data: res }) => {
      wx.hideLoading()
      if (res.status == 1) {
        this.setData({
          iSxtNum: res.data.usableSxtCount
        })
      }
    })
  },
  // 查询
  getSxtNo () {
    var curCardList = wx.getStorageSync('curCardList') || []
    this.setData({
      curCardList: curCardList
    })
    let sxtAmount = 0
    if (this.data.curCardList.length>0) {
      this.data.curCardList.forEach((item) => {
        sxtAmount += item.leftAmount
      })
    }
    console.log('sxtAmount:' + sxtAmount)
    if ((this.data.totalPrice - this.data.rendarrTemp.redBagValue - this.data.cartPrice) < sxtAmount) {
      this.setData({
        deduction: this.data.totalPrice - this.data.rendarrTemp.redBagValue - this.data.cartPrice,
        totalPriceNew: this.data.totalPrice,
        totalPrice: 0
      })
    } else if ((this.data.totalPrice - this.data.rendarrTemp.redBagValue - this.data.cartPrice) >= sxtAmount) {
      this.setData({
        deduction: sxtAmount,
        totalPriceNew: this.data.totalPrice,
        totalPrice: this.data.totalPrice - sxtAmount
      })
    }
    
  },
  // 查询是否在配送范围
  checkArea() {
    let that = this
    var userChooseGoods = wx.getStorageSync('userChooseGoods')
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    let productData = this.initProductData(1)
    let notSupportArr = []
    let param = {
      uid,
      addressNo: this.data.addressNo,
      productData
    }
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    app.ajax.postApi('checkAreaCanOrder',param).then(res=> {
      wx.hideLoading()
      if(res.data.status == 1) {
        this.setData({
          notSupport:false
        })
        return
      } else if(res.data.status == 27){  //商品不支持配送
        let noSupportInfo = res.data.statusMessage
        let productArr = []  // 不支持配送产品
        res.data.data.forEach((item,index) => {
          if(item.errorCode && item.errorCode == 9000) {
            productArr.push(item)
          }
        })
        this.setData({
          productArr
        })
        // 商品列表不支持提示
        productArr.forEach((item,index) => {
          userChooseGoods.forEach((item1,idx) => {
            if(item.productNo ==item1.qualityProduct.productNo){
              item1.errorCode = item.errorCode
            }
          })
        })
        this.setData({
          "rendarrTemp.userChooseGoods": userChooseGoods
        })

        //点击付款不支持收货列表
        productArr.forEach((item,index) => {
           userChooseGoods.forEach((item1,idx) => {
             if(item.productNo == item1.qualityProduct.productNo){
              notSupportArr.push(item1)
             }
           })
        })
        this.setData({
          notSupport: true,
          noSupportInfo,
          notSupportArr
        })
       
        
      } else {
        wx.showToast({
          title:res.data.statusDetail,
          mask: true,
          icon:'none'
        })
      }
    })

  },
  // 支付第一步确认订单
  confirmorder () {
    /*
      1.判断是否有收货地址
        y-是否海外购
          y-验证身份信息
        n-新增售后地址
      2.判断是否含有水象通支付
      3A使用水象通支付
        1.请求水象通预支付接口（接口会发送验证码到手机）
        2.请求水象通支付接口
            订单金额是否全部支付，如水象通余额小于订单金额，则继续调起微信支付，进行尾款支付，尾款支付成功跳转支付结果页
      3B未使用水象通支付
        1.请求生成新订单接口
        2.调起微信支付，支付成功失败都跳转支付结果页
    */
    if (!this.data.bPay) {
      return
    }
    this.setData({
      bPay: false
    })
    // 收货地址
    if (this.data.addressNo == '') {
      this.setData({
        bPay: true
      })
      wx.showModal({
        title: '',
        content: '请先添加收货地址',
        confirmText: '马上添加',
        confirmColor: '#ff3030',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../mine/address/newAddres/newAddress'
            })
          }
        }
      })
      return
    }
    //判断是否在配送范围
    if(this.data.notSupport){
      if(this.data.notSupportArr.length == this.data.rendarrTemp.userChooseGoods.length){
        // this.setData({
        //   anima:1
        // })
        // setTimeout(()=> {
        //   this.setData({
        //     anima:0
        //   })
        // },3000)
        this.setData({
          bPay: true
        })
        wx.showToast({
          title: this.data.noSupportInfo,
          mask: true,
          icon: 'none'
        })
        return
      } else {
        this.setData({
          noSupportModel:true,
          bPay: true
        })
      }
      return
    }
    //海外购商品就去判断身份证号
    if (this.data.rendarrTemp.isCrossBorder == 1) {
      if (this.data.overseas.idNumber =='') {
        wx.showToast({
          title: '因海关需要，请填写收货人身份证号',
          duration: 2000,
          icon: 'none'
        })
        this.setData({
          bPay: true
        })
        return
      } else if (this.data.overseas.idNumber.length<18) {
        wx.showToast({
          title: '身份证号应为数字或字母X组成的18位字符',
          duration: 2000,
          icon: 'none'
        })
        this.setData({
          bPay: true
        })
        return
      }
      this.verifyID().then( res => {
        if (res.status == 1) {
          this.submitOrder()
        }
      }, error => {
        wx.showToast({
          title: error.statusMessage,
          duration: 2000,
          icon: 'none'
        })
        this.setData({
          bPay: true
        })
        return
      })
    } else {
      this.submitOrder()
    }
  },
  submitOrder () {
    app.getUserToken.getToken().then(res => {
      var res = res
      if (res.status == 1) {
        
        if (this.data.iSxtNum > 0 && this.data.curCardList.length>0) {
          // 水象通预支付
          this.sxtAdvancePay()
        } else {
          // 没有使用水象通支付则走正常生成新订单接口
          this.newOrderAdd()
        }
      } else {
        this.setData({
          bPay: true
        })
      }
    })
   },
  // 初始化商品信息
  initProductData (type) {
    /*
      type
        0-查询可使用优惠券使用的商品信息
        1-下单使用的商品
    */
    const productData = []
    this.data.rendarrTemp.userChooseGoods.map(({
      quantity,
      qualityProduct,
      remark,
      fromNo
    }, index) => {
      var obj = {
        quantity,
        price: qualityProduct.price,
        productNo: qualityProduct.productNo,
        fromNo: fromNo // formNo = activityNo商品活动编号
      }
      if (type) {
        obj.leaveMessage = remark // 商品留言
      } else {
        obj.fromType = qualityProduct.isActivity == 1 ? 2 : 1 // 1-普通商品 2-活动商品
      }
      productData.push(obj)
    })
    if (!type) {// 跳转优惠券页面使用传参
      this.setData({
        getCouponData: JSON.stringify(productData)
      })
    }
    return JSON.stringify(productData)
  },
  // 去优惠券页
  goCouponsPage (e) {
    if (this.data.iCouponNum > 0) {
      wx.navigateTo({
        url: '/pages/mine/coupon/coupon?isEnbleClick=1&type=1&product=' + this.data.getCouponData
      })
    }
  },
  // 去水象通
  goSxtPage (e) {
    if (this.data.iSxtNum>0) {
      let iTotalPrice = Math.round(parseFloat(this.data.iTotalPrice-this.data.rendarrTemp.redBagValue) * 100) / 100
      wx.navigateTo({
        url: `/pages/order/useWaterelephant/useWaterelephant?curCardList=${JSON.stringify(this.data.curCardList)}&totalPrice=${iTotalPrice}`
      })
    }
  },
  // 水象通预支付接口
  sxtAdvancePay() {
    /*
      uid         用户id
      token       token
      productData 商品信息
      addressNo   地址编号
      cardNo      水象通卡号 多张以逗号分隔
      redBagId    红包id
      orderChannel:'miniprogram'  订单渠道
    */
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let productData = this.initProductData(1)
    let { redBagId } = this.data.rendarrTemp // 红包id
    let cardNo = ''
    this.data.curCardList.forEach((item, index) => {
      cardNo += item.cardNo + ','
    })
    this.setData({
      cardNo: cardNo.substring(0, cardNo.length - 1)
    })
    let redBag = this.data.rendarrTemp.redBagValue ? this.data.rendarrTemp.redBagValue:0
    let cartP = this.data.cartPrice ? this.data.cartPrice:0
    let totalPrice = (this.data.totalPriceNew - redBag - cartP) > 0 ? (this.data.totalPriceNew - redBag - cartP) : 0
    let discount = Number(cartP) + Number(redBag)
    console.log('当前支付使用的水象通卡:'+this.data.cardNo)
    console.log("合计金额："+totalPrice)
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.ajax.postApi('sxtPrePay', {
      uid,
      token,
      productData,
      addressNo: this.data.addressNo,
      cardNo: this.data.cardNo,
      redBagId,
      orderChannel: "miniprogram",
      discountAmount: discount.toFixed(2),
      totalAmount: totalPrice.toFixed(2),
    }).then(({ data: res }) => {
      wx.hideLoading()
      if (res.status == 1) {
        // 水象通预支付接口成功后，后向手机号发送一条短信，这个时候打开数字键盘
        if (this.data.keyboardFlag) {
          this.selectComponent('#keyboard').timeDwon()
          return
        }
        this.setData({
          keyboardFlag: true
        })
      } else if (res.status == '24') {
        // 商品信息变动
        this.productChanges(res.data)
      } else {
        this.setData({
          bPay: true
        })
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      }
    })
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
    senObj.properties.receiverIdcard = this.data.overseas.idNumber
    senObj.properties.platform_type = "小程序"
    return senObj;
  },
  // 水象通支付接口
  sxtPay(mobileValidCode) {
    /*
      uid             用户id
      token           token
      productData     商品信息
      addressNo       地址编号
      cardNo          水象通卡号
      redBagId        红包id
      orderChannel:'miniprogram'  订单渠道
      frompage        来源  1-立即购买  2-购物车
      mobileValidCode  短信验证码
    */ 
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let productData = this.initProductData(1)
    let { redBagId, fromPage } = this.data.rendarrTemp // 红包id 订单来源
    let sensorsObj = this.getSenObj();  //埋点
    let redBag = this.data.rendarrTemp.redBagValue ? this.data.rendarrTemp.redBagValue : 0
    let cartP = this.data.cartPrice ? this.data.cartPrice : 0
    let totalPrice = (this.data.totalPriceNew - redBag - cartP) > 0 ? (this.data.totalPriceNew - redBag - cartP) : 0
    let discount = Number(cartP) + Number(redBag)
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.ajax.postApi('sxtPay', {
      uid,
      token,
      productData,
      addressNo: this.data.addressNo,
      cardNo: this.data.cardNo,
      redBagId,
      orderChannel: "miniprogram",
      frompage: fromPage == "ShopCart" ? 2 : 1,
      mobileValidCode,
      distinctId: sensorsObj.distinctId,
      properties:JSON.stringify(sensorsObj.properties),
      discountAmount: discount.toFixed(2),
      totalAmount: totalPrice.toFixed(2)
    }).then(({ data: res }) => {
      wx.hideLoading()
      if (res.status == 1) {
        // 判断是否全部支付完成
        this.setData({
          orderId: res.data.orderId,
          keyboardFlag: false
        })
        if (res.data.payComplete == '1') {
          
          // 全部支付完成跳转支付结果页
          wx.redirectTo({
            url: "/pages/order/payResult/payResult?status=1&orderid=" + this.data.orderId
          })
        } else {

          let senObj = this.getSenObj()
          // 继续调取微信支付去支付尾款
          pay.wxPayment(this.data.orderId,senObj)
          
        }
      } else if (res.status == '24') {
        this.setData({
          keyboardFlag: false
        })
        // 商品信息变动
        this.productChanges(res.data)
      } else {
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  // 接收键盘组件输入的短信验证码，然后去请求水象通支付接口
  getVerification(e) {
    let verificationCode = e.detail
    this.sxtPay(verificationCode)
  },
  // 隐藏键盘组件
  closeKeyboard() {
    this.setData({
      keyboardFlag: false,
      bPay: true
    })
  },
  // 生成新订单
  newOrderAdd () {
    /*
      uid             用户id
      token           token
      productData     商品信息
      addressNo       地址编号
      cardNo          水象通卡号
      redBagId        红包id
      orderChannel:'miniprogram'  订单渠道
      frompage        来源  1-立即购买  2-购物车
    */
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let productData = this.initProductData(1)
    let { redBagId, fromPage } = this.data.rendarrTemp // 红包id 订单来源
    let senObj = this.getSenObj();  //埋点
    // sensorsObj.properties.moduleSource = this.data.fromPag
    // sensorsObj.properties.receiverIdcard = this.data.overseas.idNumber
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let redBag = this.data.rendarrTemp.redBagValue ? this.data.rendarrTemp.redBagValue : 0
    let cartP = this.data.cartPrice ? this.data.cartPrice : 0
    let totalPrice = (this.data.totalPriceNew - redBag - cartP) > 0 ? (this.data.totalPriceNew - redBag - cartP) : 0
    let discount = Number(cartP) + Number(redBag) 
    console.log("合计金额："+totalPrice)
    app.ajax.postApi('newOrderAdd', {
      uid,
      token,
      productData,
      addressNo: this.data.addressNo,
      redBagId,
      orderChannel: "miniprogram",
      frompage: fromPage == "ShopCart" ? 2 : 1,
      distinctId: senObj.distinctId,
      properties: JSON.stringify(senObj.properties),
      discountAmount: discount.toFixed(2),
      totalAmount: totalPrice.toFixed(2),
    }).then(({data:res}) => {
      wx.hideLoading()
      if (res.status == 1) {
        // 保存订单编号
        this.setData({
          orderId: res.data.orderId
        })
        let senObj = this.getSenObj()//埋点
        
        // 授权微信支付，并发起支付窗口
        pay.wxPayment(this.data.orderId,senObj)
      } else if (res.status == '24') {
        this.setData({
          bPay: true
        })
        // 商品信息变动
        this.productChanges(res.data)
      } else {
        this.setData({
          bPay: true
        })
        wx.showToast({
          title: res.statusMessage,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  // 下单时商品变动统一处理
  productChanges(errorlist) {
    let hashGoodsInfo = {}
    this.data.rendarrTemp.userChooseGoods.map((_item, index) => {
      hashGoodsInfo[_item.qualityProduct.productNo] = _item
    })
    errorlist.errorData.map((val, idx) => {
      const {
        price,
        mainImagePath,
        productName
      } = hashGoodsInfo[val.productNo]['qualityProduct']
      val = {
        ...val,
        newPrice: price,
        mainImagePath,
        productName
      }
      errorlist.errorData[idx] = val
    })
    this.setData({
      errorlist: errorlist,
      errorlistFlag: true
    })
  },
  goAddress () {
    wx.navigateTo({ 
      url: '../../mine/address/address?isEnbleClick=1',
      success: res => {
        this.setData({
          "overseas.idNumber": ''
        })
      }
    })
  },
  // 点击原地址绑定身份证号
  tabIdNumber () {
    this.setData({
      "overseas.bIdNumber": false,
      "overseas.idNumber": ''
    })
  },
  // 校验姓名和身份证号
  verifyID () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    return new Promise((resolve, reject) => {
      app.ajax.postApi('addressCheckIdNumber', {
        consignee: this.data.addresslist.consignee,
        idNumber: this.data.overseas.idNumber,
        addressNo: this.data.addressNo
      }).then(({data:res}) => {
        wx.hideLoading()
        if (res.status == 1) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    })
  },
  // 监听身份证号输入
  inputIdNumber(e) {
    let { value } = e.detail
    var reg = /^(\d|X|x)*$/
    if (!reg.test(value)) {
      wx.showToast({
        title: '身份证号应为数字或字母X组成的18位字符',
        duration: 2000,
        icon: 'none'
      })
      return value.replace(/[^\d|x]/ig, "")
    }
    this.setData({ "overseas.idNumber": value })
  },
  //取消不支持配送弹框
  beyondCancel(){
    this.setData({
      noSupportModel:false
    })
  },
  //去购物车修改
  changeBeyond(){
    wx.switchTab({
      url:'/pages/shopCart/shopCart'
    })
  }
})