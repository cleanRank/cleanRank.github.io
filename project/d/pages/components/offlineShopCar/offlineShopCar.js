const app = getApp()
import {buttonClicked} from '../../../utils/util'
Component({
  data: {
    count: 0,
    selectedAllStatus: false,
    edit: true,
    discountList: ['特价','折扣','满减'],
    allShopList:[],
    totalPrice: 0,
    shopListId:[],
    goodsList: [],
    shopName: '',
    ctrlStock: '',
    buttonClicked: false
  },
  methods: {
    edit () {
      this.setData({
        edit: !this.data.edit
      })
      let allShopList = this.data.allShopList
      if (this.data.edit) {
        for (var i = 0; i < allShopList.length; i++) {
            if (!allShopList[i].itemStatus||(allShopList[i].stockNum<1&&this.data.ctrlStock==1&&allShopList[i].materialType!=2&&!allShopList[i].packageFlag)) {
              allShopList[i].selected = false;
            }
        }
        this.setData({
          allShopList
        })
      }
    },
    //清空购物车
    clear () {
      if (this.data.allShopList.length&&app.globalData.shopInfo.shopId) {
        app.$http.deleteShopCarGoods({shopId:app.globalData.shopInfo.shopId,cflag:0}).then(res=>{
          this.setData({
            totalPrice: 0,
            allShopList: []
          })
        })
      }
    },
    //删除商品
    deleteGoods () {
      this.data.shopListId = []
      var allShopList = this.data.allShopList;
      allShopList.forEach(item =>{
        if(item.selected){
          let type;
          item.shopCartSource==1?type=1:type=0
          this.data.shopListId.push({shopCartId:item.shopcartId,shopCartFlag:type})
        }
      });
      // this.data.shopListId = this.data.shopListId.join(',')
      if (this.data.shopListId.length>=1) {
        app.$http.deleteMulShopCarGoods(this.data.shopListId).then(res=>{
        allShopList =  allShopList.filter(item =>{
            if (item.selected&&item.itemStatus) {
              if (item.stockNum||(item.stockNum<1&&this.data.ctrlStock!=1)||item.packageFlag||item.materialType==2) {
                this.data.totalPrice= (this.data.totalPrice-(item.salesQty*item.salesPrice).toFixed(2)).toFixed(2)
              }
            }
            return !item.selected
          });
          this.setData({
            totalPrice: this.data.totalPrice,
            allShopList
          })
        })
      } else {
        wx.showToast({
          title: '请选择商品',
          mask: true,
          icon: "none"
        })
      }
    },
    // 商品全选
    bindSelectAll: function () {
      this.data.totalPrice = 0
      var selectedAllStatus = this.data.selectedAllStatus;
      selectedAllStatus = !selectedAllStatus
      this.setData({
        selectedAllStatus
      });
      var allShopList = this.data.allShopList;
      for (var i = 0; i < allShopList.length; i++) {
        if (allShopList[i].itemStatus) {
          if (allShopList[i].stockNum||(allShopList[i].stockNum<1&&this.data.ctrlStock!=1)||allShopList[i].packageFlag||allShopList[i].materialType==2||!this.data.edit) {
            allShopList[i].selected = selectedAllStatus;
          }
        }else if (!allShopList[i].itemStatus) {
          if (!this.data.edit) {
            allShopList[i].selected = selectedAllStatus;
          }
        }
        if (!selectedAllStatus) {
          this.setData({
            totalPrice: 0
          });
        } else {
          if (allShopList[i].itemStatus) {
          if (allShopList[i].stockNum||(allShopList[i].stockNum<1&&this.data.ctrlStock!=1)||allShopList[i].packageFlag||allShopList[i].materialType==2) {
            this.data.totalPrice=(Number(this.data.totalPrice)+(allShopList[i].salesPrice * allShopList[i].salesQty)).toFixed(2)
          }
          }
          this.setData({
            totalPrice: this.data.totalPrice
          });
        }
      }
      this.setData({
        allShopList
      });
    },
    // 商品单选
    bindCheckbox: function (e) {
      var index = parseInt(e.currentTarget.dataset.index);
      var selected = this.data.allShopList[index].selected;
      var allShopList = this.data.allShopList;
      if (!selected) {
        allShopList[index].selected = true
        if (allShopList[index].itemStatus) {
          if (allShopList[index].stockNum||(allShopList[index].stockNum<1&&this.data.ctrlStock!=1)||allShopList[index].packageFlag||allShopList[index].materialType==2) {
          this.data.totalPrice=(Number(this.data.totalPrice)+(allShopList[index].salesPrice * allShopList[index].salesQty)).toFixed(2);
          }
        }
      } else {
        allShopList[index].selected = !selected
        if (allShopList[index].itemStatus) {
          if (allShopList[index].stockNum||(allShopList[index].stockNum<1&&this.data.ctrlStock!=1)||allShopList[index].packageFlag||allShopList[index].materialType==2) {
            this.data.totalPrice=(Number(this.data.totalPrice)-(allShopList[index].salesPrice * allShopList[index].salesQty)).toFixed(2);
              if (this.data.totalPrice< 0) {
                this.data.totalPrice=0
              }
          }
        }
        this.setData({
          selectedAllStatus: false
        })
      }
      this.setData({
        allShopList,
        totalPrice: this.data.totalPrice
      });
    },
    cut(e) {
      this.addToShopCar('cut',e)
    },
    //加数量
    add(e) {
      this.addToShopCar('add',e)
    }, 
    addToShopCar (type,e) {
      let flag = 0
      var index = parseInt(e.currentTarget.dataset.index);
      var price = this.data.allShopList[index].salesPrice;
      var allShopList = this.data.allShopList
      var selected = this.data.allShopList[index].selected;
      if (type =='add') {
        // if (!allShopList[index].salesQty) {
        //   allShopList[index].salesQty = 1
        // } else {
          allShopList[index].salesQty++
        // }
        if (allShopList[index].selected) {
         this.data.totalPrice = (Number(price) +Number(this.data.totalPrice)).toFixed(2) 
        }
        } else {
          allShopList[index].salesQty--
          if (allShopList[index].salesQty<1) {
            flag = 1
            allShopList[index].salesQty=1
          } else {
            if (allShopList[index].selected) {
              this.data.totalPrice=(this.data.totalPrice-price).toFixed(2)
            }
            if (this.data.totalPrice<0) {
              this.data.totalPrice = 0
            }
          }
        }
        var params = {
          salesQty: allShopList[index].salesQty,
          shopId: app.globalData.shopInfo.shopId,
          skuId: allShopList[index].skuId
        }
        if (!flag) {
          if (allShopList[index].salesQty > allShopList[index].stockNum && app.globalData.shopInfo.ctrlStock == 1&&allShopList[index].materialType!=2&&!allShopList[index].packageFlag) {
            wx.showToast({
              title: '库存不足',
              mask: true,
              icon: "none"
            })
          } else  {
            if (allShopList[index].shopCartSource==1&&allShopList[index].selected) {
              app.$http.addItemToCart(params).then(res=>{
            this.setData({  
              allShopList,
              totalPrice: this.data.totalPrice,
              goodsList:  this.data.goodsList
            })
              })
            } else {
              app.$http.addItemToHistoryCart(params).then(res=>{
            this.setData({  
              allShopList,
              totalPrice: this.data.totalPrice,
              goodsList:  this.data.goodsList
            })
              })
            }
          }
        }
    },
    toSettle () {
      if (!this.data.buttonClicked) {
        buttonClicked(this)
        this.data.goodsList = []
        let arr = this.data.allShopList
        for (let i in arr) {
          if (arr[i].selected) {
            this.data.goodsList.push({saleQty: arr[i].salesQty, shopCartSource: arr[i].shopCartSource, skuId:arr[i].skuId})
          }
        }
        app.globalData.actionInfo['activityIdList'] = []
      app.globalData.actionInfo['takeActivityFlag'] = 1
        app.globalData.goodList = this.data.goodsList
        if (this.data.goodsList.length>0) {
          app.$http.createConfirmOrderPage(Object.assign({}, {
            goodsList: this.data.goodsList,
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
    getShopCartList () {
      this.data.totalPrice = 0
      if (app.globalData.shopInfo.shopId) {
        app.$http.getShopCartList({
          shopId: app.globalData.shopInfo.shopId
        }).then(res=>{
          // if (res.result.length>=1) {
            let  arr = res.result.map(e => Object.assign({}, e));
            arr.forEach(e => {
              e.shopCartSource = 1
            if (e.itemStatus) {
              if (e.stockNum||(e.stockNum<1&&this.data.ctrlStock!=1)||e.packageFlag||e.materialType==2) {
              e.selected = true
              this.data.totalPrice = (Number(this.data.totalPrice) + (e.salesQty * e.salesPrice)).toFixed(2)
              }
            }
          })
            for (let i in arr) {
              for(let j in this.data.allShopList) {
                if (this.data.allShopList[j].skuId==arr[i].skuId) {
                  this.data.allShopList.splice(j,1)
                }
              }
            }
            this.data.allShopList = [...arr,...this.data.allShopList]
          // }
          this.getHistoryShopCartList()
        }).catch(res=>{
        })
      }
    },
    getHistoryShopCartList () {
      if (app.globalData.shopInfo.shopId) {
        app.$http.getHistoryShopCartList({
          shopId: app.globalData.shopInfo.shopId
        }).then(res=>{
          // if (res.result.length>=1) {
            let  preArr = res.result.map(e => Object.assign({}, e));
            preArr.forEach(e => {
              e.shopCartSource = 2
              e.selected = false
            })
            for (let j in  this.data.allShopList) {
              for(let i in preArr) {
                if (this.data.allShopList[j].skuId==preArr[i].skuId) {
                  preArr.splice(i,1)
                }
              }
            }
            this.data.allShopList = [...preArr,...this.data.allShopList]
            this.setData({
              allShopList: this.data.allShopList,
            totalPrice: this.data.totalPrice
            })
          // }
        }).catch(res=>{
        })
      }
    },
   init () {
     if (app.globalData.shopInfo) {
      this.getShopCartList();
      // this.getHistoryShopCartList();
     }
    },
  },
  // 组件生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {},
  moved: function () {},
  detached: function () {},
  // 组件生命周期
  lifetimes:{
    // created () {
    //   this.init()
    // },
    
  },
  pageLifetimes: {
    show () {
      this.setData({
        edit: true,
        allShopList: [],
        totalPrice: 0,
        shopName: app.globalData.shopInfo ? app.globalData.shopInfo.shopName : '',
        selectedAllStatus: false,
        ctrlStock: app.globalData.shopInfo.ctrlStock || '',
        buttonClicked: false
      })
      this.init()
    },
    hide:function(){
      this.setData({
        allShopList: []
      })
  }
  },

})