// pages/vip/incomeDetails/incomeDetails.js
//获取应用实例
const json = require('./area.js')
const app = getApp()
Page({
  data: {
    shopInfo: app.globalData.shopInfo,
    nearbyCity: [],
    json: json,
    searchValue: '',
    city: '',
    cityCode: '',
    distance: 0,
    size: 0,
    isPower: 1
  },
  toSearchCity() {
    wx.navigateTo({
      url: `/pages/assistPackage/selectCity/selectCity?city=${this.data.city}`
    })
  },
  //选择附近门店
  selectNearby(e) {
    let index = e.currentTarget.dataset.index;
    let cityList = this.data.nearbyCity;
    app.globalData.shopInfo = cityList[index]
    this.setData({
      shopInfo: app.globalData.shopInfo
    })
    wx.switchTab({
      url: `/pages/main/main`
    })
  },
  searchValue(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  onUnload: function () {},
  $Toast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  sanCode(e) {
    let _this = this
    wx.scanCode({
      success: (res) => {
        if (res.scanType == 'WX_CODE') { // 小程序码
          if (res.path) {
            let arr = res.path.split('=')
            if (arr.length > 1) {
              _this.getStoreInfoByCode(arr[1])
            }
          } else {
            _this.$Toast('请扫描门店二维码')
            return false
          }
        }
      },
      fail: () => {}
    })
  },
  getStoreInfoByCode(code) {
    app.globalData.shopCode = code
    app.$http.getStoreInfoByCode({
      shopCode: code
    }).then(res => {
      app.globalData.shopInfo = res.result
      this.setData({
        city: json[app.globalData.shopInfo.district],
        cityCode: app.globalData.shopInfo.district
      })
      wx.switchTab({
        url: `/pages/main/main`
      })
    }).catch(res => {})
  },
  searchAddres() {
    if (this.data.searchValue) {
      // this.data.cityCode = 0
      this.getMinimumListByDistance(this.data.searchValue)
    } else {
      this.getMinimumListByDistance(this.data.city)
    }
  },
  // 判断是否授权位置信息
  scopeUserLocation() {
    let flag = 0
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          flag = 1
        }
      }
    })
    return flag
  },
  getShopListByParams(data, cityName) {
    let that = this
    // if (cityName) {
    app.$http.getMinimumListByDistance({
      latitude: data.latitude,
      longitude: data.longitude,
      distance: that.data.distance,
      size: that.data.size,
      type: 1,
      cityCode: that.data.cityCode,
      cityName: cityName
    }).then(res => {
      that.data.nearbyCity = res.result.map(e => Object.assign({}, e));
      for (let i in that.data.nearbyCity) {
        if (that.data.nearbyCity[i].sort < 1000) {
          that.data.nearbyCity[i].sort = parseInt(that.data.nearbyCity[i].sort) + 'm'
        } else {
          that.data.nearbyCity[i].sort = (that.data.nearbyCity[i].sort / 1000).toFixed(1) + 'km'
        }
      }
      that.setData({
        nearbyCity: that.data.nearbyCity
      })
      if (!that.data.isPower) {
        that.data.nearbyCity.forEach(v => {
          v.shopNo = parseFloat(v.shopName.split("-")[0].split("No")[1])
          if (!v.shopNo) {
            v.shopNo = 0
          }

        })
        that.setData({
          nearbyCity: that.data.nearbyCity.sort(that.compare('shopNo'))
        })
      }
    }).catch(res => {
      that.setData({
        nearbyCity: []
      })
    })
    // }
  },
  //排序
  compare(property) {
    return function (a, b) {
      let value1 = a[property];
      let value2 = b[property];
      return value1 - value2;
    }
  },
  openSetting() {
    wx.showModal({
      title: '温馨提示',
      content: '获取定位失败，请前往设置打开定位权限',
      success(res) {
        if (res.confirm) {
          wx.openSetting({
            fail: function () {
              console.log('openSetting.failed')
            }
          })
        }
      }
    })
  },
  //定位搜索附近店铺
  getMinimumListByDistance(cityName = '') {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //参数type：当我们需要使用第三方地图服务时就需要正确配置这个参数了。先来看这个参数的可选值：wgs84和gcj02
      success(res) {
        let x = {
          latitude: res.latitude,
          longitude: res.longitude,
        }
        if (!app.globalData.shopInfo.shopId && !cityName && x.latitude && x.latitude) {
          app.$http.selectCityNameAndCityCode({
            latitude: x.latitude,
            longitude: x.longitude,
          }).then(res => {
            that.setData({
              city: res.result.cityName,
              cityCode: res.result.cityCode
            })
            that.getShopListByParams(x, that.data.city) //res结果为获取到的经纬度信息，cityName 为城市名
          }).catch(res => {})
        } else {
          that.getShopListByParams(x, cityName) //res结果为获取到的经纬度信息，cityName 为城市名
        }
      },
      fail(res) {
        // that.openSetting()
        that.getShopListByParams({
          latitude: 0,
          longitude: 0
        }, cityName)

        that.setData({
          isPower: 0
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({ //通过main中获取传过来的参数
      shopInfo: app.globalData.shopInfo,
      cityCode: app.globalData.shopInfo.city || options.cityCode || 0,
      distance: options.distance,
      size: options.size,
      city: json[app.globalData.shopInfo.city] || options.city || ''
    })
    wx.removeStorageSync('city');
    wx.removeStorageSync('cityCode');
  },
  onShow: function () {
    if (wx.getStorageSync('cityCode')) {
      this.setData({
        cityCode: wx.getStorageSync('cityCode'),
        city: wx.getStorageSync('city'),
        distance: 0,
        size: 100
      })
    }
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation'] && !app.globalData.shopCode) { //scope.userLocation地理位置，如果res.authSetting['scope.userLocation'])值为false表示没有授权，为true表示已经授权 
          this.getShopListByParams({
            latitude: 0,
            longitude: 0
          }, this.data.city)
          this.setData({
            isPower: 0
          })
        } else {
          this.getMinimumListByDistance(this.data.city)
          this.setData({
            isPower: 1
          })
        }
      }
    })
  }
})