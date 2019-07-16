// // pages/vip/incomeDetails/incomeDetails.js
//获取应用实例
const app = getApp()
Page({
  data: {
    searchHistory:[{getTick:true,num:1,open:true},{getTick:true,num:2,open:true}],
    ticketLists:[],
    a:'/images/offlineShopCar/yhq_bg_lq_a.png',
    b:'/images/offlineShopCar/overTime_discount.png',
    getTick: true,
    selectArea: false,
    page: 1,
    size: 10,
    loadFlag: 0,
    restValue:0,
    growthValue:0,
    vipBanner:''
  },
  toRuleDes(){
    wx.navigateTo({
      url: '/pages/offlineVip/ruleDescription/ruleDescription'
    })
  },
  getCoupon (e) {
    let index = e.currentTarget.dataset.index;
    let arr = this.data.ticketLists;
    arr[index].getTick = !arr[index].getTick
    app.$http.acquireTicket({ticketgroupId: arr[index].ticketgroupId}).then(res => {
      this.getTickets()
    }).catch(res => {
    })
    this.setData({
      searchHistory: arr
    })
  },
  open (e) {
    let index = e.currentTarget.dataset.index;
    let arr = this.data.ticketLists;
    arr[index].open = !arr[index].open
    this.setData({
      ticketLists: arr
    })
  },
  getTickets () {
    app.$http.pageMyTicket().then(res => {
      this.data.ticketLists = [...res.result]
      let arr = this.data.ticketLists
      for (let i in arr) {
        arr[i].open = true
        arr[i].actionMemo = arr[i].actionMemo.split("\n")
        if (arr[i].ticketType == 9) {
          if ((arr[i].discountValue * 10).toString().length > 1) {
            arr[i].discountValue = (arr[i].discountValue * 10).toFixed(1)

          } else {
            arr[i].discountValue = (arr[i].discountValue * 10)
          }
        }
      }
      this.setData({
        ticketLists: arr
      })
      // console.log(this.data.ticketLists)
    }).catch(res => {
    })
  },
  init () {
    app.$http.getMeminfo().then(res => {
      let growValue  =res.result.growthValue/res.result.growthValueList[res.result.growthValueList.length-1]*100 +'%'
      let restValue  = (1- (Number(res.result.growthValue)+40)/res.result.growthValueList[res.result.growthValueList.length-1]) *100 +'%'
      this.setData({
        vipInfo: res.result,
        growthValue: growValue,
        restValue: restValue
      })
    }).catch(res => {
    })
    let that=this
    wx.getSetting({ //获取用户信息，可以使用open-data组件方式
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              // console.log(res.userInfo)
              that.data.userInfo=res.userInfo
              that.setData({
                userInfo:res.userInfo
              })
            }
          })
        }
      }
    })
  },
  getPic(type) {
    app.$http.selectBannerListByType({
      advtypeId: type
    }).then(res => {
        this.setData({
          vipBanner: res.result[0].showUrl || ''
        })
    }).catch(res => {})
  },
  onShow: function (options) {
    this.init()
    this.getPic(4)
    // this.getTickets()
  }
})