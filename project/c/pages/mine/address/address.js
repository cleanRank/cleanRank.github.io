var app = getApp()
Page({
  data: {
    pageNo: 1,
    pageCount: 1,
    countLen: 0,
    isEnbleClick: '0',
    addressList: [],
    nodataList: {
      imgSrc: '/images/noData/blank_adress_icon.png',
      text: '暂时还没有收货地址哦~',
      isShowbtn: 0,
      jumpUrl: '',
      btnTxt: ''
    },
    isLoding: false
  },
  //上拉加载更多
  onReachBottom() {
    let pageNo = this.data.pageNo
    pageNo += 1
    this.setData({
      pageNo: pageNo
    })
    // pageNo += 1
    this.getAddressList()
  },
  addAddressItem(e) {
    let datisEnbleClicka = this.data.isEnbleClick
    var address = e.currentTarget.dataset.index
    //console.log(address)
    wx.setStorageSync('selectedAddress', address)
    if (datisEnbleClicka == '1') {
      //console.log('返回')
      wx.navigateBack({
        delta: 1
      })
    }
  },
  onPullDownRefresh() {
    this.setData({
      pageNo: 1,
      pageCount: 1,
      addressList: [],
      isLoding: false
    })
    this.getAddressList(1)
  },
  //调用接口修改默认地址
  updateadddefault(addressNo) {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.getUserToken.getToken().then(res => {
      var res = res
      wx.hideLoading()
      if (res.status == 1) {
        var requestData = {
          addressNo: addressNo
        }
        app.ajax.postApi('addressSetDefault', requestData).then(res => {
          var res = res.data
          if (res.status == 1) {
            // 成功
            // 处理数据
            this.setData({
              pageNo: 1,
              pageCount: 1,
              addressList: []
            })
            if (getCurrentPages().length != 0) {
              //刷新当前页面的数据
              getCurrentPages()[getCurrentPages().length - 1].onShow()
            }
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
  },
  //修改默认地址
  selected: function(e) {
    let that = this
    var select = e.currentTarget.dataset.index.addDefault
    var addressNo = e.currentTarget.dataset.index.addressNo
    if (select != 1) {
      wx.showModal({
        title: '提示',
        content: '确认修改默认地址吗？',
        success: function(res) {
          if (res.confirm) {
            that.updateadddefault(addressNo)
          }
        }
      })
    }
    this.setData({
      isselect: select
    })
  },
  //删除地址
  deleteAddress(addressno,index) {
    let that = this
    let addressList = this.data.addressList
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    app.getUserToken.getToken().then(res => {
      var res = res
      wx.hideLoading()
      if (res.status == 1) {
        var requestData = {
          addressNo: addressno
        }
        app.ajax.postApi('addressDel', requestData).then(res => {
          var res = res.data
          if (res.status == 1) {
            // 成功
            addressList.splice(index, 1)
            if (addressList){
              that.setData({
                addressList: addressList
              })
            }
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
  },
  //编辑地址
  addressEditBtn(event) {
    //console.log(event)
    var address = event.currentTarget.dataset.index
    if (address == "add") {
      wx.navigateTo({
        url: 'newAddres/newAddress',
      })
    } else {
      wx.setStorageSync("addressInfo", address)
      var path = "newAddres/newAddress?isEditType=true"
      wx.navigateTo({
        url: path,
      })
    }
  },
  //删除地址
  addressDeleteBtn: function(e) {
    let that = this
    //console.log(e)
    var addressNo = e.currentTarget.dataset.item.addressNo
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确认删除地址吗？',
      success: function(res) {
        if (res.confirm) {
          that.deleteAddress(addressNo,index)
        }
      }
    })
  },
  //获取地址列表
  getAddressList(type) {
    if (this.data.pageCount && this.data.pageCount < this.data.pageNo) {
      this.setData({
        countLen: 1
      })
      return false
    }
    let pageNo = this.data.pageNo
    var requestData = {
      pageNo: pageNo
    }
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.ajax.postApi('addressqQueryList', requestData).then(res => {
      var res = res.data
      wx.hideLoading()
      that.setData({
        isLoding: true
      })
      if (res.status == 1) {
        // 成功
        // 处理数据
        //console.log(res.data)
        var data = res.data
        that.setData({
          pageCount: res.pageCount
        })
        if (type) {
          that.setData({
            addressList: res.data
          })
        } else {
          that.setData({
            addressList: that.data.addressList.concat(data)
          })
        }
      }
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    })
  },
  onLoad(options) {
    var isEnbleClick = options.isEnbleClick
    if (isEnbleClick) {
      this.setData({
        isEnbleClick: isEnbleClick
      })
    }
  },
  onShow: function() {
    this.getAddressList()
  },
  onUnload: function() {
    // 页面关闭
  },
  onHide: function () {
    this.setData({
      pageNo: 1,
      pageCount: 1,
      addressList: [],
      isLoding: false
    })
  }
})