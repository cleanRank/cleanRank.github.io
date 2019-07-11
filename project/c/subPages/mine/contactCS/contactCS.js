Page({
  data: {
    vipcn: 'sxyp2019',
    tel: '400-678-9999'
  },
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  // 拨打电话
  phoneCall () {
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    })
  }
})