// // pages/vip/incomeDetails/incomeDetails.js
//获取应用实例
const app = getApp()
import {buttonClicked} from '../../../utils/util'
Page({
  data: {
    searchHistory: [],
    discountList: ['特价','折扣','满减'],
    showToast: false,
    searchValue: '',
    totalPrice: 0,
    totalNum: 0,
    timeout: '',
    searchList: [],
    bindValue: '',
    // hasValue: false,
    dataHisList: [],
    buttonClicked: false,
    orderId: '',
    goodsList: [],
    ctrlStock: '',
    isPass: 1,
    animationData:{}
  },
  onMyEvent(e) {
    this.addToShopCar(e.detail)
  },
  clearShop () {
    if (this.data.goodsList&&app.globalData.shopInfo.shopId) {
      app.$http.deleteShopCarGoods({shopId:app.globalData.shopInfo.shopId,cflag:2}).then(res=>{
        this.setData({
          totalPrice: 0,
          goodsList: [],
          totalNum: 0,
          showToast: false
        })
      })
    }
  },
  deleteHistory() {
    app.$http.deleteHistory().then(res => {
      this.data.dataHisList = []
      this.setData({
        dataHisList: this.data.dataHisList
      })
    }).catch(res => {})
  },
  selectHis(e) {
    let index = e.currentTarget.dataset.index
    let dataHisList = this.data.dataHisList
    this.data.searchValue = dataHisList[index]
    this.searchGoods(dataHisList[index])
  },
  searchValue(e) {
    this.data.bindValue = e.detail.value
  },
  searchGoods(value = '') {
    if (typeof value != 'string') {
      value = this.data.bindValue
    } else {
      value = value
    }
    if (value) {
      app.$http.goodsList({
        keyword: value,
        shopId: app.globalData.shopInfo.shopId
      }).then(res => {
        let searchHistory = this.data.searchHistory
        searchHistory = res.result.map(e => Object.assign({}, e));
        for (let i in searchHistory) {
          for (let j in this.data.goodsList) {
            if (this.data.goodsList[j].skuId == searchHistory[i].skuId) {
              searchHistory[i].num = this.data.goodsList[j].saleQty
            }
          }
        }
        this.setData({
          searchHistory
        })
      }).catch(res => {})
    }
  },
  toShopCar() {
    wx.switchTab({
      url: '/pages/shopCar/shopCar'
    })
  },
  //隐藏弹框
  hideModal:function(e){
    var that = this;
    var animation = wx.createAnimation({
      duration:300,
      timingFunction:'linear'
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData:animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        showToast: false
      })
    }, 200)
  },
  showToast:function(e){
    // 用that取代this，防止不必要的情况发生
    let flag = 0;
    if (this.data.showToast) {
      flag = 1
    } 
    var that = this;
    // 创建一个动画实例
    var animation  = wx.createAnimation({
      // 动画持续时间
        duration:500,
        // 定义动画效果，当前是匀速
        timingFunction:'ease'
      })
      // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(500).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
    })
    if (!flag) {
      that.setData({
        showToast:true
      })
    }
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function(){
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
      if (flag) {
        that.setData({
          showToast:false
        })
      }
    },30)
  },
  toFreeBuy (e) {
    if (!this.data.buttonClicked) {
      buttonClicked(this)
      let item = e.currentTarget.dataset.list;
        app.$http.getParent({childId :item.categoryId}).then(res=>{
          let list = {
            firstId: res.result[0].categoryId,
            secondId: res.result[1]?res.result[1].categoryId:0,
            skuId: item.skuId?item.skuId:0
          }
          wx.navigateTo({
            url: '/pages/assistPackage/freeBuy/freeBuy?list='+JSON.stringify(list)
          })
        })
    }
  },
  // addToShopCar(e) {
  //   if (this.data.isPass) {
  //     this.data.isPass = 0 
  //     let item = e.item
  //     let type = e.type
  //     let index = e.index
  //     let num = item.salesQty || 0
  //     if (type == 1) {
  //       num = num -1
  //     } else {
  //       num = num + 1
  //       if((item.stock||item.stock===0)&& app.globalData.shopInfo.ctrlStock == 1&&item.materialType!=2&&!item.packageFlag) {
  //         if (num>item.stock) {
  //           wx.showToast({
  //             title: '库存不足',
  //             mask: true,
  //             icon: "none"
  //           })
  //           this.data.isPass = 1
  //           return false
  //         }
  //       }
  //       if((item.stockNum||item.stockNum===0)&& app.globalData.shopInfo.ctrlStock == 1&&item.materialType!=2&&!item.packageFlag) {
  //         if (num>item.stockNum) {
  //           wx.showToast({
  //             title: '库存不足',
  //             mask: true,
  //             icon: "none"
  //           })
  //           this.data.isPass = 1
  //           return false
  //         }
  //       }
  //     }
  //     if (app.globalData.shopInfo.shopId) {
  //       app.$http.addItemToCart({
  //         salesQty: num,
  //         shopId: app.globalData.shopInfo.shopId,
  //         skuId: item.skuId
  //       }).then(res => {
  //         let _this = this
  //         if(type == 1) {
  //           this.data.totalNum--
  //           this.data.totalPrice = (this.data.totalPrice - item.retailPrice).toFixed(2)
  //         } else {
  //           this.data.totalNum++
  //           this.data.totalPrice = (Number(item.retailPrice) + Number(this.data.totalPrice)).toFixed(2)
  //         }
  //         if (num) {  
  //           this.setData({
  //             [`goodsList[${index}].salesQty`]: num
  //           },function(){
  //             _this.data.isPass = 1;
  //           })
  //         } else {
  //         this.data.goodsList.splice(index,1)
  //         this.setData({
  //           goodsList: this.data.goodsList,
  //         },function(){
  //           _this.data.isPass = 1;
  //         })
  //         if (this.data.goodsList.length==0) {
  //           this.setData({
  //             showToast: false
  //           })
  //         }
  //         }
  //         this.setData ({
  //           totalNum: this.data.totalNum||0,
  //           totalPrice: this.data.totalPrice||0
  //         },function(){
  //           _this.data.isPass = 1;
  //         })
  //         }).catch(res => {
  //           this.data.isPass = 1
  //         })
  //     }
  //   }
  // },
  toSettle() {
    if (!this.data.buttonClicked) {
      buttonClicked(this)
      if (this.data.goodsList.length>0) {
        let goodList = []
        this.data.goodsList.forEach(v => {
          goodList.push({
            saleQty: v.salesQty || 1,
            shopCartSource: 1,
            skuId: v.skuId,
            goodActivityBo: {
              activityIdList: [],
              takeActivityFlag: 0
            },
          })
        })
        app.globalData.actionInfo['activityIdList'] = []
      app.globalData.actionInfo['takeActivityFlag'] = 1
      app.globalData.goodList = goodList
        app.$http.createConfirmOrderPage(Object.assign({}, {
          goodsList: goodList,
          orderActivityBo: {
            takeActivityFlag: 1,
            activityIdList: [],
          },
          orderTicketBo: {
            usedActionTicketId: undefined,
            usedCashTicketId: undefined,
            usedDiscountTicketId: undefined
          },
          shopId: app.globalData.shopInfo.shopId,
          sourceFrom: 3
        })).then(res => {
          app.globalData.couponInfo = {
            usedActionTicketId: null,
            usedCashTicketId: null,
            usedDiscountTicketId: null
          }
          wx.navigateTo({
            url: '/pages/assistPackage/confirmOrder/confirmOrder?orderList=' + JSON.stringify(res.result)
          })
        }).catch(res => {})
      }
    }
  },
  // 获取购物车列表
  getShopCartList() {
    if (app.globalData.shopInfo.shopId) {
      app.$http.getShopCartList({
        shopId: app.globalData.shopInfo.shopId
      }).then(res => {
        this.data.goodsList = res.result.map(e => Object.assign({}, e));
        this.data.goodsList.forEach((e,h,arr) => {
          this.data.totalNum = Number(this.data.totalNum) + Number(e.salesQty)
          this.data.totalPrice = (Number(this.data.totalPrice) + (e.salesQty * e.salesPrice)).toFixed(2)
        });
        this.setData({
          totalNum: this.data.totalNum,
          totalPrice: this.data.totalPrice,
          goodsList: this.data.goodsList
        })
      }).catch(res => {})
    }
  },
  getHistoryGoodsList() {
    this.data.dataHisList = []
    app.$http.historyGoodsList().then(res => {
      res.result.forEach(e => {
        this.data.dataHisList.push(e.goodsWords)
      })
      this.setData({
        dataHisList: this.data.dataHisList
      })
    }).catch(res => {})
  },
  onShow: function () {
    this.setData({
      totalNum: 0,
      goodsList: [],
      totalPrice: 0,
      searchHistory: [],
      dataHisList: [],
      ctrlStock: app.globalData.shopInfo.ctrlStock,
      buttonClicked: false
    })
    this.getHistoryGoodsList()
    this.getShopCartList()
  },
  onLoad () {
    app.globalData.goodList = []
  }
})