// // pages/vip/incomeDetails/incomeDetails.js
//获取应用实例
const json = require('../nearbyStore/area')
const app = getApp()
Page({
  data: {
    json: json,
    city: '',
    dataList: {},
    toView: '',
    numberList: []
  },
  choiceWordindex: function (event) {
    let wordindex = event.currentTarget.dataset.wordindex;
    this.setData({
      toView: wordindex,
    })
    console.log(this.data.toView);
  },
  selectCity(e) {
    let index = e.currentTarget.dataset.index
    let index1 = e.currentTarget.dataset.index1
    wx.navigateBack({
      url: `/pages/assistPackage/nearbyStore/nearbyStore`
    })
    wx.setStorageSync('city', this.data.dataList[index][index1].districtName);
    wx.setStorageSync('cityCode', this.data.dataList[index][index1].districtId);
  },
  getShopCity() {
    app.$http.getShopCity().then(res => {
      // this.setData({
      //   banner: res.result
      // })
      this.data.numberList = Object.keys(res.result)
      this.data.dataList = JSON.parse(JSON.stringify(res.result))
      this.setData({
        dataList: this.data.dataList,
        numberList: this.data.numberList
      })
    }).catch(res => {})
  },
  onLoad: function (options) {
    wx.removeStorageSync('city');
    wx.removeStorageSync('cityCode');
    this.setData({
      city: options.city
    })
    this.getShopCity()
  }
})