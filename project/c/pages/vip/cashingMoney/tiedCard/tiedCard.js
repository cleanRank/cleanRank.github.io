const app = getApp()
Page({
  data: {
    miniProgramUserinfo: {}, // 用户信息
    timeDown: 0, // 倒计时
    name: '',
    idCardNo: '', // 身份证号
    cardNo: '', //银行卡号
    uniqueCode: '' // 绑卡唯一码（预绑卡接口返回）
  },
  onShow(options) {
    this.setData({
      miniProgramUserinfo: wx.getStorageSync('miniProgramUserinfo')
    })
  },
  getVal (e) {
    // 获取input值
    let item = e.currentTarget.dataset.model
    this.setData({
      [item]: e.detail.value
    })
  },
  // 倒计时
  timeDwon() {
    this.setData({
      timeDown: 59
    })
    var interval = setInterval(() => {
      if (this.data.timeDown <= 0) {
        clearInterval(interval)
        return false
      }
      var second = parseInt(this.data.timeDown) - 1
      this.setData({
        timeDown: second
      })
    }, 1000)
  },
  checkVal: function (val, type, warning) {
    // warning 提示语
    // [1]预绑卡[2]绑卡
    var {
      name,
      idCardNo,
      cardNo,
      smsCode
    } = val
    if (!name) {
      warning = "请输入姓名"
    } else if (!(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(name))) {
      warning = "请输入正确的姓名"
    } else if (!idCardNo) {
      warning = "请输入身份证号"
    } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCardNo))) {
      warning = "请输入有效的身份证号"
    } else if (!cardNo) {
      warning = "请输入银行卡号"
    } else if (!smsCode && type != 1) {
      warning = "请输入短信验证码"
    } else {
      // 成功
      warning = 1
    }
    return warning
  },
  // 绑定银行卡
  bindBankCcard(e) {
    var {
      name,
      idCardNo,
      cardNo,
      smsCode
    } = e.detail.value
    if (this.checkVal(e.detail.value, 2) == 1) {
      app.getUserToken.getToken().then(res => {
        var res = res
        if (res.status == 1) {
          var { token, uid, mobile } = wx.getStorageSync('miniProgramUserinfo')
          // 绑卡
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          app.ajax.postApi('sureBindCard', {
            uid,
            token,
            phoneNo: mobile,
            name,
            idCardNo,
            cardNo,
            smsCode,
            uniqueCode: this.data.uniqueCode
          }).then(res => {
            wx.hideLoading()
            var res = res.data
            wx.showToast({
              title: res.status == 1 ? '绑卡成功': res.statusMessage,
              icon: 'none',
              duration: 2000
            })
            setTimeout(() => {
              if (res.status == 1) {
                //返回上一级关闭当前页面
                wx.navigateBack({
                  delta: 1
                })
              }
            }, 2000)
          })
        } else {
          wx.showToast({
            title: this.checkVal(e.detail.value, 2),
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: this.checkVal(e.detail.value, 2),
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 获取短信验证码
  getmobileCode() {
    if (this.data.timeDown>0) return false
    if (this.checkVal(this.data, 1) == 1) {
      app.getUserToken.getToken().then(res => {
        var res = res
        if (res.status == 1) {
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          var { token, uid, mobile } = wx.getStorageSync('miniProgramUserinfo')
          var { name, idCardNo, cardNo } = this.data
          app.ajax.postApi('readyBindCard', {
            uid,
            token,
            phoneNo: mobile,
            name,
            idCardNo,
            cardNo
          }).then(res => {
            wx.hideLoading()
            var res = res.data
            if (res.status == 1) {
              wx.showToast({
                title: '验证码发送成功',
                icon: 'none',
                duration: 2000
              })
              this.setData({
                uniqueCode: res.data.uniqueCode
              })
              // 倒计时
              this.timeDwon()
            } else {
              wx.showToast({
                title: res.statusMessage,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: this.checkVal(this.data, 1),
        icon: 'none',
        duration: 2000
      })
    }
  }
})