// 复制文本
const copyText = (e) => {
  wx.setClipboardData({
    data: e.currentTarget.dataset.text,
    success: function (res) {
      wx.getClipboardData({
        success: function (res) {
          wx.showToast({
            title: '复制成功',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  })
}

module.exports = {
  copyText
}