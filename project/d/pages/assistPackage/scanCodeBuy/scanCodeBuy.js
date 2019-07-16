//scancodebuy.js
//扫码购模块js
const app = getApp()
import {buttonClicked} from '../../../utils/util'
Page({
  data: {
    cartList: [], // 购物车商品列表
    showSort: 0, // 分类弹层
    currentIndex: 0, // 分类商品指针
    num: 0,
    isPass: 1,
    discountList: ['特价','折扣','满减'],
    showToast: false,
    totalAmt: 0,
    buttonClicked: false,
    goodsInfo: [],
    btnStyle: '', //选好了按钮样式
    canBuy: 0
  },
  onShow: function () {
    this.setData({
      buttonClicked: false
    })
    if (!this.data.canBuy) {
      this.getShopCartList()
    }
  },
  onLoad: function (options) {
    this.setData({
      shopInfo: app.globalData.shopInfo,
      canBuy : 0
    })
    app.globalData.goodList = []
  },
  // 提示方法上海职场默认2秒
  toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
    return false
  },
  // 关闭弹层
  close(e) {
    this.setData({
      showSort: 0,
      currentIndex: 0,
      btnStyle: ''
    })
  },
  stopEvent(e) {
    return false
  },
  //子组件触发增添商品
  onMyEvent(e) {
    this.addToShopCar(e.detail)
  },
  clearShop() {
    if (this.data.cartList && app.globalData.shopInfo.shopId) {
      app.$http.deleteShopCarGoods({
        shopId: app.globalData.shopInfo.shopId,
        cflag: 2
      }).then(res => {
        this.setData({
          totalAmt: 0,
          cartList: [],
          num: 0,
          showToast: false
        })
      })
    }
  },
  //隐藏弹框
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        showToast: false
      })
    }, 200)
  },
  showToast: function (e) {
    // 用that取代this，防止不必要的情况发生
    let flag = 0;
    if (this.data.showToast) {
      flag = 1
    }
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'ease'
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
        showToast: true
      })
    }
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
      if (flag) {
        that.setData({
          showToast: false
        })
      }
    }, 30)
  },
  // 分类商品确认选好事件
  confirm(e) {
      let x = this.data.goodsInfo[this.data.currentIndex]
      if (x.itemStatus == 1 && x.stock > 0 || x.itemStatus == 1 && x.stock < 1 && app.globalData.shopInfo.ctrlStock != 1 || x.materialType == 2) {
        this.addCart(x)
        this.setData({
          showSort: 0,
          currentIndex: 0
        })
      } else if (x.itemStatus != 1) {
        // wx.showToast({
        //   title: '该商品已下架',
        //   icon: 'none',
        //   duration: 2000
        // })
        this.setData({
          showSort: 1
        })
  
  
      } else if (x.stock < 1 && app.globalData.shopInfo.ctrlStock == 1 && x.materialType != 2) {
        // wx.showToast({
        //   title: '该商品无库存',
        //   icon: 'none',
        //   duration: 2000
        // })
        this.setData({
          showSort: 1
        })
      }
  },
  // 选好了创建订单
  navigatorTo(e) {
    if (!this.data.buttonClicked) {
      buttonClicked(this)
      this.data.cartList.length ? this.createOrder() : this.toast('请先选择商品')
    }
  },
  // 创建订单
  createOrder() {
    let goodList = []
    this.data.cartList.forEach(v => {
      goodList.push({
        saleQty: v.salesQty || 1,
        shopCartSource: 1,
        skuId: v.skuId,
        goodActivityBo: {
          activityIdList: [],
          takeActivityFlag: 0
        }
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
      this.setData({
        num: 0,
        totalAmt: 0,
        cartList: [],
        currentIndex: 0,
        canBuy: 0
      })
      wx.navigateTo({
        url: '/pages/assistPackage/confirmOrder/confirmOrder?orderList=' + JSON.stringify(res.result)
      })
    }).catch(res => {})
  },
  // 选择分类商品
  changeItem(e) {
    let idx = e.currentTarget.dataset.index
    if (idx == this.data.currentIndex) {
      return false
    }
    this.setData({
      currentIndex: idx
    })
    let nowItem = this.data.goodsInfo[idx] //获取当前选择的商品信息
    if (nowItem.stock < 1 && app.globalData.shopInfo.ctrlStock == 1 && nowItem.materialType != 2 || nowItem.itemStatus != 1) { //如果无库存不能超卖，已下架
      this.setData({ //设置选好了按钮不为灰色
        btnStyle: 'activeGray'
      })
      return false;
    }
    this.setData({ //设置选好了按钮不为灰色
      btnStyle: ''
    })

  },
  // 跳转至购物车页面
  navigatorToCart(e) {
    wx.switchTab({
      url: '/pages/shopCar/shopCar'
    })
  },
  // 添加商品至购物车
  addCart(goodsInfo) {
    goodsInfo.salesQty = goodsInfo.salesQty || 1
    let index = -1
    let arr = this.data.cartList
    for (let i in arr) {
      if (arr[i].skuId == goodsInfo.skuId) {
        goodsInfo.salesQty = arr[i].salesQty + 1
        index = Number(i)
      }
    }
    app.$http.addItemToCart({
      salesQty: goodsInfo.salesQty,
      shopId: this.data.shopInfo.shopId,
      skuId: goodsInfo.skuId
    }).then(res => {
      let amt = parseFloat(this.data.totalAmt)
      this.setData({
        num: this.data.num + 1,
        totalAmt: (parseFloat(amt) + parseFloat(goodsInfo.retailPrice)).toFixed(2)
      })
      if (index > -1) {
        this.setData({
          ['cartList[' + index + '].salesQty']: goodsInfo.salesQty
        })
      } else {
        this.data.cartList.push(goodsInfo)
        this.setData({
          cartList: this.data.cartList
        })
      }
    }).catch(res => {})
  },
  addToShopCar(e) {
    if (this.data.isPass) {
      this.data.isPass = 0
      let item = e.item
      let type = e.type
      let index = e.index
      let num = item.salesQty || 0
      if (type == 1) {
        num = num - 1
      } else {
        num = num + 1
        if ((item.stock || item.stock === 0) && app.globalData.shopInfo.ctrlStock == 1 && item.materialType != 2 && !item.packageFlag) {
          if (num > item.stock) {
            wx.showToast({
              title: '库存不足',
              mask: true,
              icon: "none"
            })
            this.data.isPass = 1
            return false
          }
        }
        if ((item.stockNum || item.stockNum === 0) && app.globalData.shopInfo.ctrlStock == 1 && item.materialType != 2 && !item.packageFlag) {
          if (num > item.stockNum) {
            wx.showToast({
              title: '库存不足',
              mask: true,
              icon: "none"
            })
            this.data.isPass = 1
            return false
          }
        }
      }
      if (app.globalData.shopInfo.shopId) {
        app.$http.addItemToCart({
          salesQty: num,
          shopId: app.globalData.shopInfo.shopId,
          skuId: item.skuId
        }).then(res => {
          let _this = this
          if (type == 1) {
            this.data.num--
            this.data.totalAmt = (this.data.totalAmt - item.retailPrice).toFixed(2)
          } else {
            this.data.num++
            this.data.totalAmt = (Number(item.retailPrice) + Number(this.data.totalAmt)).toFixed(2)
          }
          if (num <= 0) {
            this.data.cartList.splice(index, 1)
            this.setData({
              cartList: this.data.cartList
            })
            if (this.data.cartList.length == 0) {
              this.setData({
                showToast: false
              })
            }
          } else {
            this.setData({
              [`cartList[${index}].salesQty`]: num
            })
          }
          this.setData({
            num: this.data.num || 0,
            totalAmt: this.data.totalAmt || 0
          }, function () {
            _this.data.isPass = 1;
          })
        }).catch(res => {
          this.data.isPass = 1
        })
      }
    }
  },
  // 获取购物车列表
  getShopCartList() {
    if (this.data.shopInfo.shopId) {
      app.$http.getShopCartList({
        shopId: this.data.shopInfo.shopId
      }).then(res => {
        let num = 0
        let totalAmt = 0
        res.result.forEach(e => {
          num = num + e.salesQty
          totalAmt = totalAmt + e.salesQty * e.retailPrice
        });
        this.setData({
          num: num,
          totalAmt: totalAmt.toFixed(2),
          cartList: res.result
        })
      }).catch(res => {})
    }
  },
  // 扫码获取商品信息s
  scanCode(e) {
    let _this = this
    let shopId = this.data.shopInfo.shopId
    wx.scanCode({
      success: (res) => {
        if (res.scanType !== 'WX_CODE') { // 不是小程序码
          if (shopId) {
            app.$http.getGoodsInfo({
              goodsSn: res.result,
              shopId: shopId
            }).then(res => {
              _this.setData({
                btnStyle: ''
              })
              let x = res.result
              _this.setData({
                canBuy : 1
              })
              if (x.length > 1) {
                _this.setData({
                  showSort: 1,
                  goodsInfo: x
                })
                if (x[0].itemStatus != 1 || x[0].stock < 1 && app.globalData.shopInfo.ctrlStock == 1 && x[0].materialType != 2 && !x[0].packageFlag) { //商品无库存且已下架时将选好了按钮制成灰色
                  this.setData({
                    btnStyle: 'activeGray'
                  })
                }
              } else if (x.length === 1) {
                if (!x[0].packageFlag) {
                  if (x[0].itemStatus == 1 && x[0].stock > 0 || x[0].itemStatus == 1 && x[0].stock < 1 && app.globalData.shopInfo.ctrlStock != 1 || x[0].materialType == 2) {
                    _this.addCart(x[0])

                  } else if (x[0].itemStatus != 1) {
                    wx.showToast({
                      title: '该商品已下架',
                      icon: 'none',
                      duration: 2000
                    })

                  } else if (x[0].stock < 1 && app.globalData.shopInfo.ctrlStock == 1 && x[0].materialType != 2 && !x[0].packageFlag) {
                    wx.showToast({
                      title: '该商品无库存',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                } else {
                  _this.addCart(x[0])
                }
              }
            }).catch(res => {
              _this.setData({
                canBuy : 1 
              })
            })
          } else {
            _this.toast('请先定位店铺')
          }
        }
      },
      fail: () => {}
    })
  }
})