var app = getApp()
Page({
  data: {
    receiveaddressList: [],
    addressList: {
      addProvince: '',
      addProvinceCode: '',
      addCity: '',
      addCityCode: '',
      addCounty: '',
      addCountyCode: '',
      addTown: '',
      addTownCode: '',
      consignee: '',
      consigneeMobile: ''
    },
    receivFlag: 0
  },
  getaddressList(e) {
    var index = e.currentTarget.dataset.index
    var areaId = this.data.receiveaddressList[index].areaId
    var items = this.data.receiveaddressList[index]
    wx.setStorageSync('ifChooseAdd', 1)
    this.data.receivFlag++
    switch (this.data.receivFlag) {
      case 1:
        this.data.addressList.addProvince = items.areaName
        this.data.addressList.addProvinceCode = items.areaId
        this.data.addressList.addCity = ""
        this.data.addressList.addCityCode = ""
        this.data.addressList.addCounty = ""
        this.data.addressList.addCountyCode = ""
        this.data.addressList.addTown = ""
        this.data.addressList.addTownCode = ""
        break
      case 2:
        this.data.addressList.addCity = items.areaName
        this.data.addressList.addCityCode = items.areaId
        this.data.addressList.addCounty = ""
        this.data.addressList.addCountyCode = ""
        this.data.addressList.addTown = ""
        this.data.addressList.addTownCode = ""
        break
      case 3:
        this.data.addressList.addCounty = items.areaName
        this.data.addressList.addCountyCode = items.areaId
        this.data.addressList.addTown = ""
        this.data.addressList.addTownCode = ""
        break
      case 4:
        this.data.addressList.addTown = items.areaName
        this.data.addressList.addTownCode = items.areaId
        break
      case 5:
        break
    }
    // 保存选择的地区
    wx.setStorageSync('addressInfo', this.data.addressList)
    this.getCicyData(areaId)
  },
  getCicyData(areaId) {
    let that = this
    var { token, uid } = wx.getStorageSync('miniProgramUserinfo')
    var requestData = {
      "superareaId": areaId || 0
    }
    app.ajax.postApi('findListBySuperareaId', requestData).then(res => {
      var res = res.data
      if (res.status == 1) {
        // 成功
        // 处理数据
        that.setData({
          receiveaddressList: res.data
        })
      } else {
        let addressList = this.data.addressList
        var pages = getCurrentPages()
        var page = pages[pages.length - 2]
        page.setData({
          addressList: addressList
        })
        if (res.status == 11) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  onLoad: function(options) {
    //请求省市区
    // this.getCicyData(0)
  },
  onShow: function () {
    var addressInfo = wx.getStorageSync("addressInfo")
    this.setData({
      addressList: {
        consignee: addressInfo.consignee,
        consigneeMobile: addressInfo.consigneeMobile,
        addDetail: addressInfo.addDetail,
        addDefault: addressInfo.addDefault,
        addressNo: addressInfo.addressNo
      }
    })
    this.getCicyData()
  }
})