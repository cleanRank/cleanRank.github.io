const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    miniProgramUserinfo: {},
    bEdit: false,
    userInfo: {}, // 用户信息
    nickName: '请输入昵称'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      miniProgramUserinfo: wx.getStorageSync('miniProgramUserinfo')
    })
    this.getUserInfo()
  },
  // 回显头像昵称
  getUserInfo(type = 0, nickName, img) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    /*
      type
        0-回显
        1-修改
    */
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let data = {
      uid,
      token,
      userInfoFlag: type
    }
    if (nickName) {
      data.nickName = nickName
    } else if (img) {
      data.img = img
    }
    app.ajax.postApi('userInfo', {
      ...data
    }).then(({ data: res }) => {
      wx.hideLoading()
      if (res.status == '1') {
        this.setData({
          userInfo: res,
          nickName: res.nickName
        })
        if (type == '1' && nickName) {
          wx.showToast({
            title: '昵称修改成功',
            icon: 'none',
            duration: 2000
          })
        } else if (type == '1' && img) {
          wx.showToast({
            title: '头像更换成功',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: res.statusDetail,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 上传头像
  fileImg () {
    var that = this
    wx.chooseImage({
      count: 1, // 最多可选择的图片张数
      sizeType: ['compressed'], // 压缩图
      success: res => {
        // 图片路径
        const tempFilePaths = res.tempFilePaths[0]
        // 获取全局唯一的文件管理器
        wx.getFileSystemManager().readFile({// 读取本地文件内容
          filePath: tempFilePaths, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            let base64ImgUrl = res.data
            that.getUserInfo(1, '', base64ImgUrl)
          },
          fail: res => {
            wx.showToast({
              title: '图片转码失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  inputNickName(e) {
    let val = e.detail.value.replace(/(^\s+)|(\s+$)/g, "")
    this.setData({ 'nickName': val })
  },
  confirmUserName () {
    if (this.data.nickName == '') {
      wx.showToast({
        title: '请输入新的昵称',
        icon: 'none',
        duration: 2000
      })
    } else if ((/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g.test(this.data.nickName))) {
      wx.showToast({
        title: '昵称不能包含表情哦~',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (this.data.nickName != this.data.userInfo.nickName) {
        this.getUserInfo(1, this.data.nickName)
      }
      this.closeMask()
    }
  },
  // 打开修改昵称弹窗
  editUserName() {
    this.setData({
      bEdit: true,
      nickName: this.data.userInfo.nickName // 将用户名复制给输入框
    })
  },
  // 关闭修改昵称弹窗
  closeMask() {
    this.setData({
      bEdit: false,
      nickName: '' // 清空输入框值
    })
  }
})