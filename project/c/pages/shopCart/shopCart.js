import { select } from "../../utils/underscore";

// pages/shopCart/shopCart.js
var bool = true;
const app = getApp()
Page({
  data: {
    isSelect: false,
    show_edit: "block",
    edit_name: "编辑",
    btn_name: "去结算",
    edit_show: "none",
    // list: [],               // 购物车列表
    // hasList: false,          // 列表是否有数据
    // 默认展示数据
    hasList: true,
    bool: true,
    // 商品列表数据
    shopInfo:[],
    list: [],
    hasInvalidList: false,
    selectList: [],
    invalidList: [],
    // 金额
    totalPrice: 0, // 总价，初始为0
    // 全选状态
    selectAllStatus: false, // 全选状态，默认非全选
    totalNum:0,    //选中商品总数量
    nodataList: {
      imgSrc: '../../images/noData/shop.png',
      text: '空空的，来挑几件好货吧～',
      isShowbtn: 0,
      jumpUrl: '',
      btnTxt: '去逛逛'
    },
    pageName:'购物车',
    promoteMask: false,
    buttonClicked: false
  },
  onLoad(){
    wx.setTabBarStyle({
      "selectedColor": "#FD455F"
    })
  },
  onShow() {
    wx.setTabBarStyle({
      "selectedColor": "#FD455F"
    })
    //刷新数据
    wx.showLoading({
      title: '加载中',
      icon: "loading",
    })
    let that = this
    let user = wx.getStorageSync('miniProgramUserinfo')
    var requestData = {
      uid: user.uid,
      token: user.token
    }
    // 购物车商品信息
    app.ajax.postApi('QueryCartListNew',requestData).then( res => {
      wx.hideLoading()
      if(res.data.status == '1'){
        var shopInfo = res.data.data
        if(shopInfo !=null && shopInfo.length >0){
          // 设置促销块默认不选中
          for(var i=0;i<shopInfo.length;i++){
            shopInfo[i].selected = false
            shopInfo[i].areaSelect = []
            shopInfo[i].areadiscountPrice = '0.00'
            // 获取失效商品
            if(shopInfo[i].columnType == 5){
              var invalidProductList = shopInfo.splice(i,i+1)
              this.setData({
                invalidList:invalidProductList,
                hasInvalidList: invalidProductList != null && invalidProductList.length >0 ? true : false
              })
            }
          }
          for(let i=0;i<shopInfo.length;i++){
            let columnType = shopInfo[i].columnType
            // 起始任选数量为0
            if(columnType == 1){
              shopInfo[i].rxNum = 0
            }
            var data = shopInfo[i].productList
            for(let a = 0; a < data.length;a++){
              data[a].selected = false
              let quantity1 = data[a].quantity
              let quantity2 = data[a].minBuyCnt
              let quantity = quantity1 > quantity2 ?quantity1 :quantity2
              let rebates = data[a].rebates
              data[a].totalRebates = (parseInt(quantity) * rebates).toFixed(2)
              //数量超过库存
              if(data[a].quantity > data[a].productStock){
                wx.showToast({
                  title:'有商品超出数量限制,请修改数据',
                  duration: 2000,
                  icon:'none'
                })
              }
            }
            
          }  
          that.setData({
            shopInfo: shopInfo,
            hasList:true,
            selectAllStatus: false,
            isSelect: false,
            selectList:[],
            
          })
          console.log('shopInfo')
          console.log(this.data.shopInfo)
          that.count_price()
        } else {
          that.setData({
            shopInfo: [],
            hasList:false,
            selectAllStatus: false,
            isSelect: false,
            selectList:[],
          })
        }
      } else {
        that.setData({
          shopInfo: [],
          hasList:false,
          selectAllStatus: false,
          isSelect: false,
          selectList:[],
        })
      }
    })
    bool = false
    // this.btn_edit()
  },
  onTabItemTap: function (e) {
    app.onTabIndex = e.index
    //用户级别埋点
    app.getMemberLevel()
  },
  /**
   * 当前商品选中事件
   */
  // num 0 单选 1 模块选中
  selectList(e) {
    // 获取选中的radio索引
    let num = e.currentTarget.dataset.num
    let shopInfoIndex = e.currentTarget.dataset.index
    let listIndex = e.currentTarget.dataset.ind

    var that = this;
    let selectList = []
    let isSelect = that.data.isSelect;
    
    // 获取到商品列表数据
    var list = that.data.shopInfo;
    list[shopInfoIndex].areaSelect=[]
    list[shopInfoIndex].rxNum = 0
    // 默认全选
    that.data.selectAllStatus = true;

    if(num == 1){  //局部全选
      let areaSelect = !list[shopInfoIndex].selected
      list[shopInfoIndex].selected = !list[shopInfoIndex].selected
      
      for(let i=0;i<list[shopInfoIndex]['productList'].length;i++){
        list[shopInfoIndex]['productList'][i].selected = areaSelect
      }
      for(var i=0;i < list.length;i++){
        for(let a=0;a<list[i]['productList'].length;a++){
          if(!list[i]['productList'][a].selected){
            that.data.selectAllStatus = false;
          } else {
            selectList.push(list[i]['productList'][a])
            list[i].areaSelect.push(list[i]['productList'][a])
            // if(list[shopInfoIndex].columnType == 1){
            //   // list[shopInfoIndex].rxNum= list[shopInfoIndex][discountRuleList][0].discountType
            //   list[shopInfoIndex].rxNum++
            // }
          }
        }
      }
    } else{  //局部单选
      // 循环数组数据，判断----选中/未选中[selected]
      let productList = list[shopInfoIndex]['productList']
      let product = productList[listIndex]
      list[shopInfoIndex]['productList'][listIndex].selected = !product.selected;
      // for (var i = 0; i < list.length; i++) {
      //   if (!list[i].selected) {
      //     that.data.selectAllStatus = false;
      //     isSelect = false
      //   }
      // }
      // 如果数组数据全部为selected[true],全选
      for(var i=0;i < list.length;i++){
        for(let a=0;a<list[i]['productList'].length;a++){
          if(!list[i]['productList'][a].selected){
            that.data.selectAllStatus = false;
            isSelect = false
          } else {
            selectList.push(list[i]['productList'][a])
            list[i].areaSelect.push(list[i]['productList'][a])
          }
        }
      }
    }
    //判断部分区域全选状态
    if(list[shopInfoIndex].areaSelect.length == list[shopInfoIndex]['productList'].length){
      list[shopInfoIndex].selected = true
    }else{
      list[shopInfoIndex].selected = false
    }

    // 局部区域数量 金额  优惠金额
    let cartIds = []
    list[shopInfoIndex].areaSelect.forEach(item => {
      cartIds.push(item.cartId)
    })
    // wx.showLoading({
    //   title:'加载中...',
    //   icon: 'loading'
    // })
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    var param = {
      uid,
      token,
      cartIds:JSON.stringify(cartIds)
    }
    app.ajax.postApi('GetCartPrice',param).then( res => {
      // wx.hideLoading()
      if(res.data.status == 1){
        let info = res.data
        list[shopInfoIndex].areaSelect.forEach(item => {
          list[shopInfoIndex].rxNum +=item.quantity
        })
        list[shopInfoIndex].areadiscountPrice = info.data.discountPrice
        list[shopInfoIndex].totalPrice = info.data.total
        if (selectList.length == 0) {
          isSelect = false
        }
        // 重新渲染数据
        that.setData({
          shopInfo: list,
          isSelect: isSelect,
          selectList: selectList,
          selectAllStatus: that.data.selectAllStatus,
        })
        // 调用计算金额方法
        that.count_price();
      }
    })

      // for(let i=0;i<list[i].areaSelect.length;i++){

      // }
    

    // for (var i = list.length - 1; i >= 0; i--) {
    //   if (!list[i].selected) {
    //     that.data.selectAllStatus = false;
    //   } else {
    //     selectList.push(list[i])
    //   }
    // }
    // if (selectList.length == 0) {
    //   isSelect = false
    // }
    // // 重新渲染数据
    // that.setData({
    //   shopInfo: list,
    //   isSelect: isSelect,
    //   selectList: selectList,
    //   selectAllStatus: that.data.selectAllStatus,
    // })
    // debugger
    // // 调用计算金额方法
    // that.count_price();
  },
  // 切换促销方式弹框
  promoteMask(e){
    let item = e.currentTarget.dataset.item
    let activityNameList = item.activityNameList
    let cartId = item.cartId
    this.setData({
      activityNameList,
      cartId,
      promoteMask: true
    })
  },
  closePromote(){
    this.setData({
      activityNameList:"",
      cartId:"",
      promoteMask: false
    })
  },
  // 去凑单
  promoteGoodsList(e){
    var activityNo=''
    let info = e.currentTarget.dataset.info
    let activityNameList = info.productList[0].activityNameList
    activityNameList.forEach(item => {
      if(item.isChecked){
        activityNo = item.activityNo
      }
    })
    let url = `/pages/detail/preferGoodsList/preferGoodsList?activityNo=${activityNo}`
    wx.navigateTo({
      url
    })
  },
  // 切换促销方式
  changePromote(e){
    let item = e.currentTarget.dataset.item
    var activityNo =''
    let activityNameList = item.activityNameList
    let cartId = item.cartId
    item.activityNameList.forEach(item =>{
      if(item.isChecked && item.isChecked == 1){
        activityNo = item.activityNo
      }
    })
    wx.showLoading({
      title:'加载中...',
      mask: true
    })
    let user = wx.getStorageSync('miniProgramUserinfo')
    let params={
      activityNo,
      cartId,
      token: user.token,
      uid: user.uid
    }
    app.ajax.postApi('ModifyActivity',params).then( res => {
      wx.hideLoading()
      if(res.data.status == 1){
        console.log('促销切换成功')
      }
    })
  },
  // cancelSelect() {
  //   var that = this;
  //   // 获取到商品列表数据
  //   var list = that.data.shopInfo;
  //   // 默认全选
  //   // 循环数组数据，判断----选中/未选中[selected]
  //   // 如果数组数据全部为selected[true],全选
  //   for (var i = list.length - 1; i >= 0; i--) {
  //     if (list[i].selected) {
  //       list[i].selected = false
  //     }
  //   }
  //   // 重新渲染数据
  //   that.setData({
  //     list: list,
  //     selectList: []
  //   })
  //   // 调用计算金额方法
  //   that.count_price();
  // },
  // 编辑
  // btn_edit: function () {
  //   var that = this;
  //   if (bool) {
  //     that.setData({
  //       edit_show: "block",
  //       edit_name: "完成",
  //       btn_name: "删除",
  //       show_edit: "none",
  //       isSelect: false,
  //       selectAllStatus: false,
  //       selectList: [],
  //       bool: false
  //     })
  //     bool = false
  //   } else {
  //     that.setData({
  //       edit_show: "none",
  //       edit_name: "编辑",
  //       btn_name: "去结算",
  //       show_edit: "block",
  //       isSelect: false,
  //       selectAllStatus: false,
  //       selectList: [],
  //       bool: true
  //     })
  //     bool = true;
  //   }
  //   this.cancelSelect();

  // },
  // 删除
  deletes(e){
    var that = this
    let shopInfoIndex = e.currentTarget.dataset.index
    let listIndex = e.currentTarget.dataset.ind
    let list = this.data.shopInfo
    list[shopInfoIndex].areaSelect =[]
    list[shopInfoIndex].rxNum = 0
    // let selectList = this.data.selectList
    wx.showModal({
      title:'删除提示',
      content: '确定要从购物车删除所选商品？',
      success: function(res) {
        wx.showLoading({
          title:'加载中...',
          icon: "loading",
        })
        if(res.confirm){
          var productItem = list[shopInfoIndex]['productList'][listIndex]
          let productId = ""
          // let productNo = productItem.product.productNo
          let productNo = productItem.product.productNo != "" && productItem.product.productNo != null ? productItem.product.productNo :""
          // let fromNo = productItem.fromNo
          let fromNo = productItem.fromNo != "" && productItem.fromNo != null ? productItem.fromNo : ""
          if (fromNo != "undefined" && fromNo != null && fromNo != "") {
            productId = productNo + "-" + fromNo
          } else {
            productId = productNo
          }
          app.getUserToken.getToken().then(res => {
            if(res.status == 1){
              let user = wx.getStorageSync('miniProgramUserinfo')
              var requestData = {
                uid: user.uid,
                token: user.token,
                productNo: productId
              }
              app.ajax.postApi('DelShoppingCart',requestData).then( res => {
                wx.hideLoading()
                if(res.data.status == 1){
                  let selectList = that.data.selectList
                  list[shopInfoIndex]['productList'].splice(listIndex,1)
                  that.data.selectAllStatus = true
                  //页面重新渲染
                  if(that.data.selectList.length > 0){
                    // for(let a=0;a<that.data.selectList.length;a++){
                    //   let selectData = selectList[a]
                    //   debugger
                    //   let productNo2 = selectData.product.productNo
                    //   if (productNo == productNo2) {
                    //     selectList.splice(a, 1)
                    //   }
                    // }
                    for(var i=0;i < list.length;i++){
                      for(let a=0;a<list[i]['productList'].length;a++){
                        if(!list[i]['productList'][a].selected){
                          that.data.selectAllStatus = false;
                        } else {
                          selectList.push(list[i]['productList'][a])
                          list[i].areaSelect.push(list[i]['productList'][a])
                        }
                      }
                    }


                    list[shopInfoIndex].areaSelect.forEach(item => {
                      list[shopInfoIndex].rxNum +=item.quantity
                    })

                    if(list[shopInfoIndex].areaSelect.length == list[shopInfoIndex]['productList'].length){
                      list[shopInfoIndex].selected = true
                    }else{
                      list[shopInfoIndex].selected = false
                    }

                    let cartIds = []
                    list[shopInfoIndex].areaSelect.forEach(item => {
                      cartIds.push(item.cartId)
                    })
                    wx.showLoading({
                      title:'加载中...',
                      icon: 'loading'
                    })
                    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
                    var param = {
                      uid,
                      token,
                      cartIds:JSON.stringify(cartIds)
                    }
                    app.ajax.postApi('GetCartPrice',param).then( res => {
                      wx.hideLoading()
                      if(res.data.status == 1){
                        let info = res.data
                        list[shopInfoIndex].areadiscountPrice = info.data.discountPrice
                        list[shopInfoIndex].totalPrice = info.data.total
                        if (selectList.length == 0) {
                          that.data.isSelect = false
                        }
                        // 重新渲染数据
                        that.setData({
                          shopInfo: list,
                          isSelect: that.data.isSelect,
                          selectList: selectList,
                          selectAllStatus: that.data.selectAllStatus,
                        })
                        // 调用计算金额方法
                        that.count_price();
                      }
                    })


                  }else{
                    that.setData({
                      shopInfo:list
                    })
                  }
                  // that.setData({
                  //   shopInfo:list,
                  //   selectList
                  // })
                  //如果数据为空
                  if(!list.length){
                    that.setData({
                      hasList: false
                    })
                  }else{
                    // 调用金额渲染数据
                    that.count_price();
                  }
                } else {
                  wx.showToast({
                    title:'删除失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            }
          })
        }
      },
      fail: function() {
        wx.hideLoading()
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  goIndex() {
    // 去首页
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    // 全选ICON默认选中
    let selectAllStatus = this.data.selectAllStatus;
    let isSelect = this.data.isSelect
    // true  -----   false
    selectAllStatus = !selectAllStatus
    isSelect = !isSelect
    // 获取商品数据
    let list = this.data.shopInfo;
    // 循环遍历判断列表中的数据是否选中
    for(let i=0;i<list.length;i++){
      list[i].selected = selectAllStatus
      for(let a=0;a<list[i]['productList'].length;a++){
        list[i]['productList'][a].selected = selectAllStatus
      }
    }
    // 页面重新渲染
    this.setData({
      selectAllStatus: selectAllStatus,
      isSelect: isSelect,
      shopInfo: list,
      selectList: selectAllStatus ? list : []
    });
    // 计算金额方法
    this.count_price();
  },
  // 去商品详情
  intentDetail(e) {
    let flag = e.currentTarget.dataset.flag || false
    let shopInfoIndex = e.currentTarget.dataset.index
    let listIndex = e.currentTarget.dataset.ind
    let list = this.data.shopInfo
    
    let productItem = list[shopInfoIndex]['productList'][listIndex]
    var productNo = productItem.product.productNo != "" && productItem.product.productNo != null ? productItem.product.productNo :""
    var activityNo = productItem.fromNo != "" && productItem.fromNo != null ? productItem.fromNo : ""
    let isActivity
    if(activityNo.length >0){
      isActivity = 1
    } else {
      isActivity = 0
    }
    wx.navigateTo({
      url:`../detail/detail?productNo=${productNo}&isActivity=${isActivity}&activityNo=${activityNo}`
    })
  },
  invalidIntentDetail(e){
    let index = e.currentTarget.dataset.index
    let flag = e.currentTarget.dataset.flag || false
    if(flag){
      var list = this.data.invalidList[0].productList
    }
    var productNo = list[index].product.productNo != "" && list[index].product.productNo != null ? list[index].product.productNo : ""
    var activityNo = list[index].fromNo != "" && list[index].fromNo != null ? list[index].fromNo : ""
    let isActivity
    if(activityNo.length >0){
      isActivity = 1
    } else {
      isActivity = 0
    }
    wx.navigateTo({
      url:`../detail/detail?productNo=${productNo}&isActivity=${isActivity}&activityNo=${activityNo}`
    })
  },
  /**
   * 绑定加数量事件
   */
  // btn_add(e) {
  //   // 获取点击的索引
  //   const index = e.currentTarget.dataset.index;
  //   // 获取商品数据
  //   let list = this.data.list;
  //   // 获取商品数量
  //   let num = parseInt(list[index].quantity);
  //   if (num >= 10) {
  //     wx.showToast({
  //       title: '不能再添加更多了哦！',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //     return false
  //   }
  //   // 点击递增
  //   num = num + 1;

  //   list[index].quantity = num;
  //   // // 重新渲染 ---显示新的数量
  //   // this.setData({
  //   //   list: list,
  //   // });
  //   this.sendNum(e)
  //   // 计算金额方法
  //   this.count_price();
  // },
  /**
   * 绑定减数量事件
   */
  // btn_minus(e) {
  //   //   // 获取点击的索引
  //   const index = e.currentTarget.dataset.index;

  //   // 获取商品数据
  //   let list = this.data.list;
  //   // 获取商品数量
  //   let num = parseInt(list[index].quantity);
  //   // 判断num小于等于1  return; 点击无效
  //   if (num <= 1) {
  //     wx.showToast({
  //       title: '商品已达最小数量，不能继续减少',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //     return false;
  //   }
  //   // else  num大于1  点击减按钮  数量--
  //   num = num - 1;
  //   list[index].quantity = num;
  //   // // 渲染页面
  //   // this.setData({
  //   //   list: list
  //   // });
  //   this.sendNum(e)
  //   // 调用计算金额方法
  //   this.count_price();
  // },
  // 提交订单
  btn_submit_order: function () {
    let that = this
    let bool = true
    if (!bool) {
      // this.deletes()
    } else {
      let selectList = []
      let iCrossBorder = 0
      let productItem = this.data.shopInfo
      for(let i=0;i<productItem.length;i++){
        for(let a=0;a<productItem[i]['productList'].length;a++){
          if(productItem[i]['productList'][a].selected){
            productItem[i]['productList'][a].qualityProduct = productItem[i]['productList'][a].product
            selectList.push(productItem[i]['productList'][a])
            // 全球购
            if(productItem[i]['productList'][a].isCrossBorder == '1'){
              iCrossBorder++
            }
          }
        }
      }
      // for (let a = 0; a < this.data.list.length; a++) {
      //   if (this.data.list[a].selected) {
      //     this.data.list[a].qualityProduct = this.data.list[a].product
      //     selectList.push(this.data.list[a])
      //     // 全球购商品
      //     if (this.data.list[a].isCrossBorder == '1') {
      //       iCrossBorder++
      //     }
      //   }
      // }
      //起售数量限制
      if(!that.checkStartSell(selectList)){
        return false
      }else if (iCrossBorder > 0 && iCrossBorder != selectList.length) {
        wx.showToast({
          title: '请分开结算水象国际商品和普通商品',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showLoading({
          title:'加载中...',
          icon: 'loading'
        })
        let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
        let cartIds = []
        selectList.forEach(item => {
          cartIds.push(item.cartId)
        })
        if(cartIds.length > 1){
          cartIds = cartIds.join(',')
        }
        var param ={
          uid,
          token,
          cartIds
        }
        app.ajax.postApi('CheckMinBuyCnt', param).then(res => {
          wx.hideLoading()
          if(res.data.status == 1){
            selectList.filter(item => {
              item.product = ''
            })
            let discountPrice = this.data.discountPrice
            wx.setStorage({
              key: 'userChooseGoods',
              data: selectList,
              success(res) {
                wx.navigateTo({
                  url: '/pages/order/confirmOrder/confirmOrder?fromPage=ShopCart&discountPrice='+discountPrice,
                })
              }
            })
          } else if(res.data.status == 8){  //???
            let notSell = res.data.data
            let list = that.data.shopInfo
            wx.showToast({
              title: res.data.statusMessage,
              duration: 2000,
              icon: 'none'
            })
            for(let i=0;i<notSell.length;i++){
                for(let m=0;m<list.length;m++){
                  for(let a=0;a<list[m]['productList'].length;a++){
                    if(list[m]['productList'][a].productNo == notSell[i].productNo){
                      list[m]['productList'][a] = notSell[i].minBuyCnt
                      that.setData({
                        shopInfo:list
                      })
                    }
                  }
                  
                }
            }
          }else {
            wx.showToast({
              title: res.data.statusMessage,
              duration: 2000,
              icon: 'none'
            })
          }
        })

      }

    }
  },
  /**
   * 计算总价  全局选中数量  优惠价格 
   */
  count_price() {
    // 获取商品列表数据
    let list = this.data.shopInfo
    let isSelect = this.data.isSelect
    let totalNum = 0

    // 声明一个变量接收数组列表price
    let total = 0;
    //循环列表得到每个数据
    for(let i=0;i<list.length;i++){
      for(let a=0;a<list[i]['productList'].length;a++){
        if(list[i]['productList'][a].selected){
          isSelect = true
          //所有价格加起来 count_money
          // total += list[i]['productList'][a].product.price * list[i]['productList'][a].quantity
        }
      }
    }
    // 全部选中的选中的商品列表
    let selectList = []
    for(let i=0;i<list.length;i++){
      for(let a=0;a<list[i]['productList'].length;a++){
        if(list[i]['productList'][a].selected){
          selectList.push(list[i]['productList'][a])
        }
      }
    }
    let cartIds = []
    selectList.forEach(item => {
      cartIds.push(item.cartId)
      totalNum += parseInt(item.quantity)
    })
    // if(cartIds.length > 1){
    //   cartIds = cartIds.join(',')
    // }
    // wx.showLoading({
    //   title:'加载中...',
    //   icon: 'loading'
    // })
    let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    var param = {
      uid,
      token,
      cartIds:JSON.stringify(cartIds)
    }
    app.ajax.postApi('GetCartPrice',param).then( res => {
      // wx.hideLoading()
      if(res.data.status == 1){
        let info = res.data
        // 最后赋值全局价格 优惠价格 全部数量
        this.setData({
          isSelect: isSelect,
          totalPrice: info.data.total,
          discountPrice: info.data.discountPrice,
          totalNum
        })
      }
    })

    // 最后赋值到data中渲染到页面
    // this.setData({
    //   // shopInfo: list,
    //   isSelect: isSelect,
    //   totalPrice: total.toFixed(2)
    // });
  },
  sendNum(e) {
    let that = this
    wx.showLoading({
      title: '加载中',
      icon: "loading",
      mask:'true'
    })
    let shopInfoIndex = e.currentTarget.dataset.index
    let listIndex = e.currentTarget.dataset.ind
    const type = e.currentTarget.dataset.type

    // 获取商品数据
    let list = this.data.shopInfo;
    let selectList = this.data.selectList
    // 获取商品数量
    var productItem = list[shopInfoIndex]['productList'][listIndex]
    list[shopInfoIndex].areaSelect =[]
    list[shopInfoIndex].rxNum = 0
    let num = parseInt(productItem.quantity)
    let minNum = parseInt(productItem.minBuyCnt)
    if (type == "2") {
      if (num <= 1) {
        wx.showToast({
          title: '商品已达最小数量，不能继续减少',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      // 小于起售数量不能减少
      if(num <= minNum) {
        wx.showToast({
          title:'亲，真的不能再减少了，商品是'+minNum+'件起售的呢~',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      // else  num大于1  点击减按钮  数量--
      num = num - 1;
    }

    if(type == "1") {
      // let all = that.getAllNumber()
      // if (all == 50) {
      //   wx.showToast({
      //     title: '您的购物车宝贝总数已满50件，建议先去结算',
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   return false
      // }
      if (num >= 100) {
        wx.showToast({
          title: '不能再添加更多了哦！',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      // 点击递增
      num = num + 1;
    }
      app.getUserToken.getToken().then(res => {
        var res = res
        if (res.status == 1) {
          let productNo = productItem.product.productNo
          let fromNo = productItem.fromNo
          let user = wx.getStorageSync('miniProgramUserinfo')
          var requestData = {
            uid: user.uid,
            token: user.token,
            num: num,
            productNo: productNo,
            activityNo: fromNo != "" && fromNo != "undefined" && fromNo != null ? fromNo : ""
          }
          app.ajax.postApi('editCartQuantity', requestData).then(res => {
            wx.hideLoading()
            if (res.data.status == "1" || (type == '2' && (res.data.status == "20" || res.data.status == "21" || res.data.status == "22"))) {
              // 获取商品数据
              productItem.quantity = num;
              let selected = productItem.selected
              let rebates = productItem.rebates
              productItem.totalRebates = (parseInt(productItem.quantity) * rebates).toFixed(2)
              productItem.minBuyCnt = res.data.data.minBuyCnt  // 更新起售数量
              that.data.selectAllStatus = true
              if (!selected) {
                productItem.selected = true
              }
  
              // let selectAllStatus = true;
              // for (let a = 0; a < list.length; a++) {
              //   if (!list[a].selected) {
              //     selectAllStatus = false
              //   }
              // }
              // list[shopInfoIndex].areaSelect.push(productItem)
              // 如果数组数据全部为selected[true],全选
              for(var i=0;i < list.length;i++){
                for(let a=0;a<list[i]['productList'].length;a++){
                  if(!list[i]['productList'][a].selected){
                    that.data.selectAllStatus = false;
                  } else {
                    selectList.push(list[i]['productList'][a])
                    list[i].areaSelect.push(list[i]['productList'][a])
                  }
                }
              }
              // 更新购买数量
              list[shopInfoIndex].rxNum = 0
              let rxNumToal = 0
              let rxNumArr = []
              list[shopInfoIndex].areaSelect.forEach(item => {
                // list[shopInfoIndex].rxNum +=parseInt(item.quantity)
                rxNumArr.push(item.quantity)
              })
              for(let i=0;i<rxNumArr.length;i++){
                rxNumToal=rxNumArr[i]
              }
              list[shopInfoIndex].rxNum = rxNumToal
              // console.log('list[shopInfoIndex].rxNum')
              // console.log(list[shopInfoIndex].rxNum)
              //局部区域是否全选
              list[shopInfoIndex].selected = true
              for(let i=0;i<list[shopInfoIndex]['productList'].length;i++){
                if(!list[shopInfoIndex]['productList'][i].selected){
                  list[shopInfoIndex].selected = false
                }
              }
              // if(list[shopInfoIndex].areaSelect.length == list[shopInfoIndex]['productList'].length){
              //   list[shopInfoIndex].selected = true
              // }else{
              //   list[shopInfoIndex].selected = false
              // }
              // for(var i=0;i < list.length;i++){
              //   for(let a=0;a<list[i]['productList'].length;a++){
              //     if(!list[i]['productList'][a].selected){
              //       selectAllStatus = false;
              //     }
              //   }
              // }
              let cartIds = []
              list[shopInfoIndex].areaSelect.forEach(item => {
                cartIds.push(item.cartId)
              })
              wx.showLoading({
                title:'加载中...',
                icon: 'loading',
                mask: 'true'
              })
              let {uid,token} = wx.getStorageSync('miniProgramUserinfo')
              var param = {
                uid,
                token,
                cartIds:JSON.stringify(cartIds)
              }
              app.ajax.postApi('GetCartPrice',param).then( res => {
                wx.hideLoading()
                if(res.data.status == 1){
                  let info = res.data
                  list[shopInfoIndex].areadiscountPrice = info.data.discountPrice
                  list[shopInfoIndex].totalPrice = info.data.total
                  if (selectList.length == 0) {
                    that.data.isSelect = false
                    that.data.selectAllStatus = false
                  }
                  // 重新渲染数据
                  that.setData({
                    shopInfo: list,
                    isSelect: that.data.isSelect,
                    selectList: selectList,
                    selectAllStatus: that.data.selectAllStatus,
                  })
                  // 调用计算金额方法
                  that.count_price();
                }
              })
            } else {
              wx.showToast({
                title: res.data.statusMessage,
                duration: 2000,
                icon: 'none'
              })
            }
  
          })
        }
      })
    
  },
  deleteInvalid() {
    let that = this
    var invalidList = this.data.invalidList[0].productList
    wx.showModal({
      title: '清空失效宝贝',
      content: '确定清空失效宝贝',
      success: function (res) {
        wx.showLoading({
          title: '加载中',
          icon: "loading",
        })
        if (res.confirm) {
          var productId = ""
          if (invalidList.length > 1) {
            for (let c = 0; c < invalidList.length; c++) {
              let productNo = invalidList[c].product.productNo
              let fromNo = invalidList[c].fromNo
              if (productNo.length > 0) {
                if (fromNo != null && fromNo != "" && fromNo != "undefined") {
                  productId += productNo + "-" + fromNo + ","
                } else {
                  productId += productNo + ","
                }
              } else {
                productId += productNo
              }
            }
            if (productId.length > 0) {
              productId = productId.substr(0, productId.length - 1);
            }
          } else {
            let productNo = invalidList[0][0].product.productNo
            let fromNo = invalidList[0].fromNo
            if (fromNo != null && fromNo != "" && fromNo != "undefined") {
              productId += productNo + "-" + fromNo + ","
            } else {
              productId += productNo
            }
          }
          app.getUserToken.getToken().then(res => {
            var res = res
            if (res.status == 1) {
              let user = wx.getStorageSync('miniProgramUserinfo')
              var requestData = {
                uid: user.uid,
                token: user.token,
                productNo: productId
              }
              app.ajax.postApi('DelShoppingCart', requestData).then(res => {
                if (res.data.status == "1") {
                  // 页面渲染数据
                  that.setData({
                    invalidList: [],
                    hasInvalidList: false
                  });
                  wx.hideLoading()
                } else {
                  wx.showToast({
                    title: '清空失败',
                    icon: 'none',
                    duration: '2000'
                  })
                }
              })
            }
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  getAllNumber() {
    let list = this.data.shopInfo
    let invalidList = this.data.invalidList
    let all = 0
    for(let i =0;i<list.length;i++){
      for(let a=0;a<list[i]['productList'].length;a++){
        all += parseInt(list[i]['productList'][a].quantity)
      }
    }
    if(invalidList.length > 0){
      for(let a=0;a<invalidList.length;a++){
         all += parseInt(invalidList[a].quantity)
      }
    }
    return all
  },
  checkStartSell(arr) {
    let notStartSell=[]
    for(let i=0;i<arr.length;i++){
      if(arr[i].quantity < arr[i].minBuyCnt){
        notStartSell.push(arr[i])
      }
    }
    if(notStartSell && notStartSell.length > 0){
        if(notStartSell.length < arr.length){
          wx.showToast({
            title:'抱歉，您购物车部分商品不符合起售条件',
            duration: 2000,
            icon: 'none'
          })
          //滚动到第一个限购商品
          let list = this.data.shopInfo
          for(let i=0;i<list.length;i++){
            
            if(list[i].productNo == notStartSell[0].productNo){
              // wx.pageScrollTo({
              //   scrollTop: i * 100,
              //   duration: 300
              // })
            }
          }
          return false
        }

        if(arr.length == 1){
          let minBuyCntNum = arr[0].minBuyCnt
          wx.showToast({
            title:'抱歉，此商品'+minBuyCntNum+'件起售',
            duration: 2000,
            icon: 'none'
          })
        }
    } else {
      return true
    }
  },
})