//pay.js
//活动详情js
const app = getApp()
Page({
  data: {
    pic: "",
    showUrlAdv: ''
  },
  onLoad: function (options) {
    this.setData({
      pic: options.pic,
      showUrlAdv: options.showUrlAdv
    })
  },
  goFreeBuy() {
    if (this.data.showUrlAdv) {
      if (this.data.showUrlAdv == '/pages/shopCar/shopCar' || this.data.showUrlAdv == '/pages/main/main' || this.data.showUrlAdv == '/pages/offlineVip/offlineVip' || this.data.showUrlAdv == '/pages/my/my') {
        wx.switchTab({
          url: this.data.showUrlAdv
        });
      } else {
        wx.navigateTo({
          url: this.data.showUrlAdv
        });
      }
    }
  }

})