// pages/components/downloadBtn/downloadBtn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    downloadTxt: {
      type: String,
      value: '保存图片'
    },
    downloadUrl: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirmAuthorization() {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      let that = this
      wx.getSetting({
        success(res) {
          //没有权限，发起授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() { //用户允许授权，保存图片到相册
                wx.hideLoading()
                that.downloadFn()
              },
              fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
                wx.showToast({
                  title: '您好，请手动开启水象优品 小程序设置中的相册授权',
                  icon: "none",
                  duration: 2000
                })
              }
            })
          } else { //用户已授权，保存到相册
            wx.hideLoading()
            that.downloadFn()
          }
        }
      })
    },
    downloadFn() {
      let that = this
      if (!this.data.downloadUrl) {
        wx.showToast({
          title: '请传递正确文件下载地址',
          icon: "none",
          duration: 2000
        })
        return
      }
      wx.downloadFile({
        url: that.data.downloadUrl,
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              if (res.errMsg == "saveImageToPhotosAlbum:ok") {
                that.triggerEvent('downloadFn')
              } else {
                wx.showToast({
                  title: '保存文件失败',
                  icon: "none",
                  duration: 2000
                })
              }
            },
            fail(err) {
              wx.showToast({
                title: err,
                icon: "none",
                duration: 2000
              })
            }
          })
        },
        fail(err) {
          wx.showToast({
            title: err,
            icon: "none",
            duration: 2000
          })
        }
      })
    }
  }
})
