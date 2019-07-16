// pages/fpages/discountPage/discountPage.js
import {
  formatTimeAmt
} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    invoiceDetail: {},
    systemInfo: '',
    system: ''
  },
  toDetail: function () {
    // let id = e.currentTarget.dataset.id    
    wx.navigateTo({
      // url: '/pages/assistPackage/orderDetail/orderDetail?orderId=' + id
      url: '/pages/assistPackage/orderDetail/orderDetail'
    })
  },
  ViewInvoice: function (e) {
    let url = e.currentTarget.dataset.url
    console.log(e)
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res)
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            console.log('打开成功');
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  sendEmail: function () {
    // wx.showModal({
    //   title: '请输入邮箱地址',
    //   content: '<view>123</view>',
    //   showCancel: true,
    //   cancelText: '取消',
    //   cancelColor: '#000000',
    //   confirmText: '发送',
    //   confirmColor: '#3CC51F',
    //   success: (result) => {
    //     if (result.confirm) {
    //       app.$http.sendEmail({email:this.data.email,orderId: this.data.orderId}).then(res => { //查看发票接口
    //     }).catch(res => {})
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });

  },
  init() {
    app.$http.getInvoice({
      orderId: this.data.orderId
    }).then(res => { //查看发票接口
      this.setData({
        invoiceDetail: res.result
      })
    }).catch(res => {})
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res
        });
        let system = that.data.systemInfo.system.substr(0, 4)
        that.setData({
          system: system
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      })
    }
    this.init()
  }


})