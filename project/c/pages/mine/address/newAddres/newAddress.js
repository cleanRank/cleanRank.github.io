var userinfo = wx.getStorageSync('miniProgramUserinfo')
var app = getApp();
Page({
  data: {
    isShowDelBtn: false,
    address: {
      addressNo: '', // 收货地址Id
      consignee: '', // 收货人姓名
      consigneeMobile: '', // 收货人手机号
      addProvinceCode: '', // 收货地址-省编码
      addProvince: '', // 收货地址-省
      addCityCode: '', // 收货地址-市编码
      addCity: '', // 收货地址-市
      addCountyCode: '', // 收货地址-县编码
      addCounty: '', // 收货地址-县
      addTownCode: '', // 收货地址-镇编码
      addTown: '', // 收货地址-镇
      addAreaCode: '', // 收货地址-区域编码
      addArea: '', // 收货地址-区域
      addDetail: '', // 收货地址详情
      addDefault: '', // 默认收货地址
      addresslabel: ' ' // 收货人关系标签
    }
  },
  //选择省市区
  bindRegionChange: function() {
    // 保存信息
    console.log("2222")
    wx.setStorageSync('addressInfo', this.data.address)
    //保存新增地址来源，1是新增地址页面，2是商品详情页
    wx.setStorageSync('addressFrom', 1)
    wx.navigateTo({
      url: 'receivingaddress/receivingaddress',
    })
  },
  //获取input手机号
  bindinputMobile(event) {
    let address = this.data.address;
    address.consigneeMobile = event.detail.value;
    this.setData({
      address: address
    })
  },
  //获取input名字
  bindinputName(event) {
    let address = this.data.address;
    address.consignee = event.detail.value;
    this.setData({
      address: address
    })
  },
  //获取input省市区
  bindinputCity(event) {
    let address = this.data.address;
    address.address = event.detail.value;
    this.setData({
      address: address
    });
  },
  //获取input详细地址
  bindinputAddress(event) {
    let address = this.data.address;
    address.addDetail = event.detail.value;
    this.setData({
      address: address
    })
  },
  onShow: function () {
    // 页面显示
    var pages = getCurrentPages()
    var page = pages[pages.length - 1]
    if (page.data.addressList) {
      this.setData({
        address: page.data.addressList
      })
    }
  },
  onLoad: function(options) {
    //获取上个页面的地址信息
    var addressInfo = wx.getStorageSync("addressInfo")
    let address = this.data.address;
    //获取是否编辑跳过来的
    var isedittype = options.isEditType
    if (isedittype) {
      wx.setNavigationBarTitle({
        title: "编辑地址"
      })
      for(let i in addressInfo) {
        let name = i;
        let un = undefined
        let val = addressInfo[i]
        if (this.data.address[name] != un) {
          this.data.address[name] = addressInfo[i]
        }
      }
      this.setData({
        address: this.data.address,
        isShowDelBtn: true
      })
    }
    console.log(this.data.address)
  },
  //保存地址
  saveAddress() {
    let address = this.data.address;
    let reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
    if (!address.consignee) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (address.consignee.match(reg)) {
      wx.showToast({
        title: '姓名不能输入表情符',
        icon: 'none',
        duration: 2000
      })　　
      return
    }
    if (!address.consigneeMobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!(/^0?(13|15|18|14|17|16|19)[0-9]{9}$/.test(address.consigneeMobile))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!address.addProvince) {
      wx.showToast({
        title: '请选择省市区',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!address.addDetail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (address.addDetail.match(reg)) {
      wx.showToast({
        title: '不能输入表情符哦~',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (address.addDetail.length < 5 || address.addDetail.length > 100) {
      wx.showToast({
        title: '详细地址请输入5~100个字',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.saveAddress2net()
  },
  //调用接口保存地址
  saveAddress2net() {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.getUserToken.getToken().then(res => {
      var res = res
      wx.hideLoading()
      if (res.status == 1) {
        var userinfo = wx.getStorageSync('miniProgramUserinfo')
        let address = that.data.address
        var requestData = {
          channel: 'miniprogram'
        }
        requestData = Object.assign({}, requestData, address)
        //console.log(requestData)
        app.ajax.postApi('addressAddOrUpdate', requestData).then(res => {
          var res = res.data
          if (res.status == 1) {
            // 成功
            // 处理数据
            wx.navigateBack({})
          } else {
            // 失败提示
            wx.showToast({
              title: res.statusDetail,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  }
})