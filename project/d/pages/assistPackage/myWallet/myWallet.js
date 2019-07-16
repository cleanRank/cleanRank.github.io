// pages/assistPackage/myWallet/myWallet.js

import {
  formatTimeAmt
} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    walletBalance: undefined,
    banlanceList: [],
    loadFlag: 0, //分页是否到底
    params: {
      page: 1,
      size: 10,
      param: {}
    },
  },
  // 下拉分页
  onReachBottom() {
    if (!this.data.loadFlag) {
      this.getWalletBalanceList()
    }
  },
  getWalletBalanceList() { //获取余额明细列表
    let params = {
      page: this.data.params.page++,
      size: 10,
      param: {}
    }
    app.$http.WalletBalanceList(params).then(res => {
      if (res.appCode == "S0000") {
        for (let i = 0; i < res.result.datas.length; i++) {
          res.result.datas[i].gmtCreated = formatTimeAmt(res.result.datas[i].gmtCreated, "yyyy.MM.dd hh:mm")
          if (res.result.datas[i].bizType == "2") {
            let x = String(res.result.datas[i].chgBonus).split("-")[1]
            res.result.datas[i].chgBonus = Number(x)
          }
        }
        if (res.result.datas.length < this.data.params.size) {
          this.data.loadFlag = 1
        }
        this.setData({
          banlanceList: [...this.data.banlanceList, ...res.result.datas]
        })
      }
    }).catch(res => {})
  },
  getWalletBlance() {
    app.$http.getWalletBalanceInfo({}).then(res => {
      this.setData({
        walletBalance: res.result.endBonus
      })
      wx.setStorageSync('banlance', this.data.walletBalance);
    }).catch(res => {})
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWalletBlance()
    this.getWalletBalanceList()
    // app.$http.getWalletBalanceInfo({}).then(res => {
    //   this.setData({
    //     walletBalance: res.result.endBonus
    //   })
    // }).catch(res => {})


  },

})