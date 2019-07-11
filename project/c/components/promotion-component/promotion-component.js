Component({
  properties: {
    // 定义分享数据，接收传递过来的参数
    promotionData: {
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型)
      value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    productData:{
      type: Object,
      value:{}
    }
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    // 这里是一个自定义方法
    promotionClose() {
      // 触发外部事件，并传递数据
      var obj = {
        flag: false
      }
      this.triggerEvent('promotionClose', obj, {
        bubbles: false,
        composed: false
      });
    },
    // 分享到朋友圈
    shareFriendster() {
      var that = this
      wx.getSetting({
        success(res) {
          //没有权限，发起授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() { //用户允许授权，保存图片到相册
                //console.log('允许使用保存图片到相册')
                this.savePhoto()
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
            that.savePhoto()
          }
        }
      })
    },
    //保存图片到相册，提示保存成功
    savePhoto() {
      let that = this
      let str = this.properties.promotionData.shareImg
      let shareImgUrl = 'https://'+str.split("://")[1]
      wx.downloadFile({
        url: shareImgUrl,
        success: function(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '分享图已保存到手机，分享保存的图片到朋友圈即可',
                icon: "none",
                duration: 2000
              })
            }
          })
        }
      })
    },
    //分享给IM粉丝
    shareImFriend(){
      wx.removeStorageSync('ImProductDetail')
      console.log(this.data.productData)
      let productData = this.data.productData
      wx.navigateTo({
        url:'/subPages/IM/selectContact/selectContact'
      })
      wx.setStorageSync('ImProductDetail',JSON.stringify(productData))
    }
  }
})