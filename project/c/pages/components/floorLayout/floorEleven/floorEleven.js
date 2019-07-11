const app = getApp()
Component({
  properties: {
    floorData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.initFloorData(newVal)
      }
    }
  },
  attached: function () {
  },
  methods: {
    //初始化数据
    initFloorData: function (newVal, newSession) {
      this.setData({
        _item: newVal
      })
    },
    // 领取优惠券
    getCouponsRes: function (e) {
      let couponno = e.target.dataset.pon
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      var { mobile, token } = wx.getStorageSync('miniProgramUserinfo')
      app.ajax.postApi('getSubjectApp', {
        mobile,
        token,
        subjectNo: couponno,
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: res.data.statusDetail,
          duration: 1500,
          mask: true,
          icon: 'none'
        })
      })
    }
  }
})
