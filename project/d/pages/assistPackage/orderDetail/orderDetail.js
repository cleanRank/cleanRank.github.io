// // pages/vip/incomeDetails/incomeDetails.js
//获取应用实例
const app = getApp()
import {
  formatTimeAmt
} from '../../../utils/util.js'
Page({
  data: {
    payStatus:'',
    orderDetail:'',
    orderInfo: '',
    orderId: '',
    clock:'',
    detail:{}
  },
  cancelPay () {
    app.$http.cancelOrder({
      orderId: this.data.orderId
    }).then(res => {
      this.init()
      clearInterval(this.data.intervarID)
    }).catch(res => {
    })
  },
  toPay () {
    wx.navigateTo({
      url: `/pages/assistPackage/pay/pay?orderId=${this.data.orderId}&amt=${this.data.orderDetail.realAmt}&type=1`
    })
  },
   checkTime(i) { //将0-9的数字前面加上0，例1变为01 
    if (i < 10)  {
     i = "0" + i;
    }
    return i;
   },
  init () {
    if(this.data.orderId){
      app.$http.getOrderDetailByOrderId({
        orderId: this.data.orderId
      }).then(res => {
        let detail = this.data.detail
        detail.gmtCreated = formatTimeAmt(res.result.gmtCreated, 'yyyy-MM-dd hh:mm:ss')
        detail.payTime = formatTimeAmt(res.result.payTime, 'yyyy-MM-dd hh:mm:ss')
        this.setData({
          payStatus: res.result.payStatus,
          orderInfo: res.result.orderDetailList,
          orderDetail: res.result,
          detail
        })
  
        let that=this;
        if (res.result.payStatus == 2) {
          let leftTime = 900000 - (that.data.orderDetail.currentTime - that.data.orderDetail.gmtCreated); //计算剩余的毫秒数 
          this.data.intervarID = setInterval(function () {
            leftTime = leftTime - 1000;
            let seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数 
            let minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟 
            minutes = that.checkTime(minutes);
            seconds = that.checkTime(seconds);
            that.setData({
              clock: minutes + ":" + seconds
            })
            if (minutes == '00' && seconds == '00') {
              clearInterval(that.data.intervarID);
              that.cancelPay()
            }
          }, 1000)
        }
      }).catch(res => {
      })
    }
  },
  onLoad: function (options) {
    
    this.setData({
      orderId: options.orderId
    })
    this.init()
  },
  onUnload () {
    clearInterval(this.data.intervarID)
  },
  onHide () {
    clearInterval(this.data.intervarID)
  }
})
