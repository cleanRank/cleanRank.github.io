const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardNo:'',
    showMsgBox:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 输入框事件
   */
  changeVal(e){
    console.log(e)
    let value = e.detail.value.replace(/([^\da-zA-Z]+)/g, '');//只能输入字母和数字
    value = value.toUpperCase();//将小写字母转换成大写字母

    var op='';
    for (var i = 0; i < value.length; i++) {
      if (i % 4 === 0 && i > 0) {
        op = op + "-" + value.charAt(i);
      } else {
        op = op + value.charAt(i);
      }
    }
    console.log(value);//去掉了特殊符号的
    this.setData({
      "cardNo": value
    })
    return op
  },
  /**
   * 绑卡
   */
  bindcard(){
    let cardSecret = this.data.cardNo
    if (!cardSecret){
      wx.showToast({
        title: "请输入16位卡密",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '绑卡中...',
      mask: true
    })
    let { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    let formData = {
      uid,
      token,
      cardSecret
    }
    app.ajax.postApi('bindSxtCard', formData).then(({data:res}) => {
      wx.hideLoading()
      if (res.status === 1) {
        this.setData({
          showMsgBox: true
        })
      }else{
        wx.showToast({
          title: res.statusMessage,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 关闭弹框
   */
  hideMsgBox(){
    this.setData({ showMsgBox:false})
    wx.navigateBack({
      delta:1
    })
  }

})