//free.js
//自由购js
const app = getApp()
import {buttonClicked} from '../../../utils/util'
Page({
  data: {
    scrollTop: 0,
    canClick: false,
    discountList: ['特价','折扣','满减'],
    currentFirstIndex: 0, // 一级菜单展示时节点id
    currentSecondIndex: 0, // 二级菜单展示时节点id
    loadFlag: 0, // 分页是否到底
    currentCategoryId: 0, // 当前商品内容分类categoryID
    showToast: false,
    currentCategoryList: [], // 当前商品分内list
    params: {
      page: 1,
      size: 50,
      param: {
        categoryId: 0,
        shopId: 0
      }
    },
    buttonClicked: false,
    isPass: 1,
    shopInfo: '',
    menu: [],
    list: {},
    cartList: [],
    commodityList: {}, // 分类商品数组
    categoryParams: {}, // 分类入参 例如{page:1,loadFlag:1}
    shopId: '', // 当前店铺id
    num: 0,
    totalAmt: 0,
    currentIndex: 0, // 当前tabNav指针
  },
  onShow: function () {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    this.setData({
      scroll_height: (windowHeight - 110) + 'px',
      shopInfo: app.globalData.shopInfo,
      ['params.param.shopId']: app.globalData.shopInfo.shopId,
      buttonClicked: false
    })
    this.getCategoryMenu()
    this.getShopCartList()
  },
  onLoad: function (options) {
    app.globalData.goodList = []
    if (options.list) {
      this.data.list = JSON.parse(options.list)
    }
  },
  onHide: function () {},
  onMyEvent(e) {
    this.addToShopCar(e.detail)
  },
  clearShop() {
    if (this.data.cartList.length && app.globalData.shopInfo.shopId) {
      app.$http.deleteShopCarGoods({
        shopId: app.globalData.shopInfo.shopId,
        cflag: 2
      }).then(res => {
        this.data.currentCategoryList.forEach((v, h, arr) => {
          v.num = 0
          v.retailPrice = Number(v.retailPrice).toFixed(2)
        })
        for (let i in this.data.commodityList) {
          this.data.commodityList[i].forEach((v, h, arr) => {
            v.num = 0
          })
        }
        this.setData({
          totalAmt: 0,
          cartList: [],
          num: 0,
          currentCategoryList: this.data.currentCategoryList,
          showToast: false
        })
      })
    }
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
        if ((item.stock || item.stock === 0 || item.stockNum || item.stockNum === 0) && app.globalData.shopInfo.ctrlStock == 1 && item.materialType != 2 && !item.packageFlag) {
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
          if (num) {
            this.setData({
              [`cartList[${index}].salesQty`]: num
            })
          } else {
            this.data.cartList.splice(index, 1)
            this.setData({
              cartList: this.data.cartList,
            })
            if (this.data.cartList.length == 0) {
              this.setData({
                showToast: false
              })
            }
          }
          this.polymericData(this.data.currentCategoryList)
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
  // 重置分页参数
  reSetReloadParam() {
    this.data.params.page = 1
    // this.data.commodityList = []
    this.data.loadFlag = 0
  },
  // 下拉分页
  scrollBottomLoad() {
    if (!this.data.categoryParams[this.data.currentCategoryId].loadFlag) {
      this.getCategoryCommodity(this.data.currentCategoryId)
    }
  },
  // 跳转搜索页面
  goSearch() {
    wx.navigateTo({
      url: '/pages/assistPackage/searchGoods/searchGoods'
    })
  },
  // 选好了创建订单
  navigatorTo() {
    if (!this.data.buttonClicked) {
      buttonClicked(this)
      let goodList = []
      this.data.cartList.forEach(v => {
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
      if (goodList.length > 0) {
        app.$http.createConfirmOrderPage(Object.assign({}, {
          goodsList: app.globalData.goodList,
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
            commodityList: {},
            currentCategoryList: [],
            categoryParams: {},
            list: {}
          })
          wx.navigateTo({
            url: '/pages/assistPackage/confirmOrder/confirmOrder?orderList=' + JSON.stringify(res.result)
          })
        }).catch(res => {})
      }
    }
  },
  // toShopCar() {
  //   wx.switchTab({
  //     url: '/pages/shopCar/shopCar'
  //   })
  // },
  // 一级菜单点击事件
  selectFirstCategory(e) {
    let arr = e.currentTarget.dataset.list
    let categoryId = arr.pointer
    if (this.data.canClick) {
      if (categoryId == this.data.currentFirstIndex) {
        return false
      }
      this.reSetReloadParam()
      this.data.currentCategoryId = categoryId
      if (arr.children.length > 0) {
        if (arr.children[0].children.length == 0) {
          categoryId = arr.children[0].pointer
          this.data.currentCategoryId = categoryId
        } else {
          categoryId = arr.children[0].children[0].pointer
          this.setData({
            currentCategoryId: categoryId
          })
        }
        this.setData({
          currentSecondIndex: arr.children[0].pointer
        })
      }
      this.setData({
        currentFirstIndex: arr.pointer
      })
      this.judgeLoad(categoryId)
    }
  },
  // 二级菜单点击事件
  selectSecondCategory(e) {
    let arr = e.currentTarget.dataset.list
    let categoryId = arr.pointer
    if (this.data.canClick) {
      if (categoryId == this.data.currentFirstIndex) {
        return false
      }
      this.reSetReloadParam()
      this.data.currentCategoryId = categoryId
      if (arr.children.length > 0) {
        categoryId = arr.children[0].pointer
        this.setData({
          currentCategoryId: categoryId
        })
      }

      this.setData({
        currentSecondIndex: arr.pointer
      })
      this.judgeLoad(categoryId)
    }
  },
  // 获取分类菜单
  getCategoryMenu() {
    app.$http.getCategoryMenu({
      shopId: this.data.shopInfo.shopId
    }).then(res => {
      if (res.result) {
        res.result.forEach((v, i) => {
          if (this.data.list && v.categoryId == this.data.list.firstId) {
            this.setData({
              currentFirstIndex: `p${i}`
            })
            setTimeout(() => {
              this.setData({
                scrollTop1: 90 * (i) - 100 + 'rpx'
              })
            }, 0);
          }
          v.pointer = `p${i}`
          if (v.children && v.children.length) {
            v.children.forEach((c, idx) => {
              if (this.data.list && c.categoryId == this.data.list.secondId) {
                this.setData({
                  currentSecondIndex: `p${i}-${idx}`
                })
              }
              c.pointer = `p${i}-${idx}`
            })
          }
        })
      }
      let fId = this.data.currentFirstIndex || res.result[0].pointer
      let sId = 0
      if (res.result.length && res.result[0].children.length) {
        sId = this.data.currentSecondIndex || res.result[0].children[0].pointer
      }
      let currentId = sId ? sId : fId
      this.setData({
        menu: res.result,
        currentFirstIndex: fId,
        currentSecondIndex: sId,
        currentCategoryId: currentId
      })
      if (Object.keys(this.data.list).length > 0 && !this.data.list.secondId || (this.data.currentSecondIndex && this.data.currentFirstIndex != this.data.currentSecondIndex.substring(0, 2))) {
        this.data.currentCategoryId = this.data.currentFirstIndex
      }
      this.getCategoryCommodity(this.data.currentCategoryId)
    }).catch(res => {})
  },
  // 判断当前分类菜单是否有数据：没有则拉取，有则优先展示
  judgeLoad(id) {
    if (this.data.canClick) {
      if (!this.data.commodityList[id]) {
        this.data.canClick = false
        this.getCategoryCommodity(id)
      } else {
        this.setData({
          currentCategoryList: this.data.commodityList[id]
        })
      }
    }
  },
  // 获取树形结构categoryId入参id结构为pn-n形式
  getPointerId(obj) {
    let arr = obj.split('-');
    let s = arr[1] || 0
    let f = arr[0].substring(1, arr[0].length);
    return arr.length > 1 ? this.data.menu[f].children[s].categoryId : this.data.menu[f].categoryId
  },
  // 获取分类商品列表
  getCategoryCommodity(id) {
    let page = this.data.categoryParams[id] ? (this.data.categoryParams[id].page + 1) : 1
    this.setData({
      [`categoryParams.${id}`]: {
        page: page,
        loadFlag: 0
      }
    })
    let params = {
      page: this.data.categoryParams[id].page,
      size: 50,
      param: {
        categoryId: this.getPointerId(id),
        shopId: app.globalData.shopInfo.shopId
      }
    }
    app.$http.getCategoryCommodity(params).then(res => {
      if (this.data.list) {
        for (let i in res.result.datas) {
          if (res.result.datas[i].skuId == this.data.list.skuId) {
            setTimeout(() => {
              this.setData({
                scrollTop: 180 * (i - 1) + 'rpx'
              })
            }, 0);
          }
        }
      }
      if (res.result.datas.length < this.data.params.size) {
        this.setData({
          [`categoryParams.${id}.loadFlag`]: 1
        })
      }
      let data = this.polymericData(res.result.datas)
      this.data.commodityList[id] = this.data.commodityList[id] || []
      this.setData({
        [`commodityList.${id}`]: [...this.data.commodityList[id], ...res.result.datas],
        currentCategoryList: [...this.data.commodityList[id], ...res.result.datas]
      }, () => {
        this.setData({
          canClick: true
        })
      })
      this.data.currentCategoryList.forEach((item, index) => {
        if (item.num) {
          let animation1 = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
          })
          animation1.left(0).rotate(360).step()
          this.data.currentCategoryList[index].moves = animation1.export()
        }
      })

      this.setData({
        currentCategoryList: this.data.currentCategoryList
      })
    }).catch(res => {
      this.setData({
        canClick: true
      })
    })
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
          totalAmt = parseFloat(totalAmt) + parseFloat(e.salesQty * e.retailPrice)
        });
        this.setData({
          cartList: res.result || [],
          num: num,
          totalAmt: totalAmt.toFixed(2)
        })
      }).catch(res => {})
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
  // 操作商品至购物车type 1:减去购物车2：加入购物车
  cartOption(e) {
    if (this.data.isPass) {
      this.data.isPass = 0
      let item = e.currentTarget.dataset.list
      let type = e.currentTarget.dataset.type
      let index = e.currentTarget.dataset.index
      let num = item.num || 0
      this.setData({
        currentScal: -1
      })
      // clearTimeout(time2)
      // let time2 = setTimeout(() => {
      //   this.setData({
      //     currentScal: -1
      //   })
      // }, 1000)
      //创建动画
      this.data.currentCategoryList.forEach((item, index) => {
        if (item.moves) {
          item.moves = {}
        }
      })
      let animation1 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      if (type == 1) {
        if (num < 1) {
          num = 0
          this.data.isPass = 1
          return false
        } else {
          num = num - 1

          //当num为0是，点击减号，减号按钮平移旋转会原来位置动画
          if (num == 0) {
            this.animation = animation1
            animation1.left(40).rotate(-360).step()
            this.data.currentCategoryList[index].moves = animation1.export()
            this.setData({
              currentCategoryList: this.data.currentCategoryList
            })
          }
        }
      } else {
        num = num + 1

        //点击加号，减号按钮平移旋转动画
        this.animation = animation1
        animation1.left(0).rotate(360).step()
        this.data.currentCategoryList[index].moves = animation1.export()
      }
      if (num > item.stock && app.globalData.shopInfo.ctrlStock == 1 && item.materialType != 2 && !item.packageFlag) {
        this.data.isPass = 1
        wx.showToast({
          title: '库存不足',
          mask: true,
          icon: "none"
        })
      } else {
        app.$http.addItemToCart({
          salesQty: num,
          shopId: this.data.shopInfo.shopId,
          skuId: item.skuId
        }).then(res => {
          let _this = this
          let totalAmt = type == 1 ? (parseFloat(this.data.totalAmt) - Number(item.retailPrice)).toFixed(2) : (parseFloat(this.data.totalAmt) + Number(item.retailPrice)).toFixed(2)
          let i = -1
          this.data.cartList.forEach((v, k, arr) => {
            if (item.skuId == v.skuId) {
              arr[k].salesQty = type == 1 ? v.salesQty - 1 : v.salesQty + 1
              i = k
              num == 0 && arr.splice(k, 1)
              num != 0 && this.setData({
                ['cartList[' + i + '].salesQty']: num
              })
            }
          })
          this.data.currentCategoryList[index].num = num
          // setTimeout(() => {
          this.setData({
            currentScal: index,
            num: type == 1 ? this.data.num - 1 : this.data.num + 1,
            totalAmt: totalAmt,
            currentCategoryList: this.data.currentCategoryList,
            [`commodityList.${this.data.currentCategoryId}[${index}].num`]: num,
            cartList: this.data.cartList,
          }, function () {
            _this.data.isPass = 1
          })
          // }, 300);
          if (i > -1) {} else {
            item.salesQty = num;
            this.data.cartList.push(item)
            this.setData({
              cartList: this.data.cartList
            })
          }
        }).catch(res => {
          this.data.isPass = 1
        })
      }
    }
  },
  polymericData(item) {
    item.forEach((o, k) => {
      o.num = 0
      this.data.cartList.forEach((e, i) => {
        if (e.skuId == o.skuId) {
          o.num = e.salesQty
        }
      })
    })
    this.setData({
      currentCategoryList: item
    })
    return item
  },
  //库存不足提示
  stockNone() {
    wx.showToast({
      title: '库存不足',
      mask: true,
      icon: "none"
    })
  }
})