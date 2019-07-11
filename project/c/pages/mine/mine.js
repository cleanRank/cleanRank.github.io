const app = getApp()
Page({
  data: {
    personalServe: [{
        title: '我的订单',
        imgUrl: 'personal-order',
        icon: [{
            name: '待付款',
            url: '/images/mine/order1.png',
            path: '/pages/order/order?selectIndx=1',
            num: 0
          },
          {
            name: '待收货',
            url: '/images/mine/order2.png',
            path: '/pages/order/order?selectIndx=3',
            num: 0
          },
          {
            name: '待评价',
            url: '/images/mine/order3.png',
            path: '/pages/order/order?selectIndx=4',
            num: 0
          }, {
            name: '售后/退换',
            url: '/images/mine/order4.png',
            path: '/pages/order/aftersale/aftersale',
            num: 0
          }, {
            name: '全部订单',
            url: '/images/mine/order5.png',
            path: '/pages/order/order?selectIndx=0',
            num: 0
          }
        ]
      },
      {
        title: '我的服务',
        imgUrl: 'personal-service',
        icon: [{
            name: '优惠券',
            url: '/images/mine/serve-coupons.png',
            path: 'coupon/coupon',
            query: {}
          },
          {
            name: '收货地址',
            url: '/images/mine/address.png',
            path: 'address/address',
            query: {}
          },
          {
            name: '帮助中心',
            url: '/images/mine/personal-service6.png',
            path: '/pages/help/help',
            num: -1,
            query: {}
          },
          {
            name: '在线客服',
            url: '/images/mine/online.png',
            path: '',
          },
          {
            name: '联系客服',
            url: '/images/mine/serve-contact-us.png',
            path: '/subPages/mine/contactCS/contactCS',
            query: {}
          },
          {
            name: '水象通',
            url: '/images/mine/waterElephantCard.png',
            path: '/subPages/mine/waterElephantCard/waterElephantCard',
            query: {}
          }
        ]
      }
    ],
    miniProgramUserinfo: {},
    orderNumObj: {},
    userInfo: {},
    wxUserInfo: {}
  },
  onLoad() {
    wx.setTabBarStyle({
      "selectedColor": "#FD455F"
    })
    this.setData({
      wxUserInfo: app.globalData.userInfo.userInfo
    })
  },
  onShow() {
    wx.setTabBarStyle({
      "selectedColor": "#FD455F"
    })
    this.getOrderCount()
    this.getUserInfo()
    this.onLine()
    for (var key in app.mainSwitch) { 
      if (app.mainSwitch[key] == '0') {
        if (key == 'sxtInstalment') {
          this.data.personalServe[1].icon[5].hide = 1
        } else if(key == 'helpcenterInstalment'){
          this.data.personalServe[1].icon[2].hide = 1
        }
        this.setData({
          personalServe: this.data.personalServe
        })
      }
    }
  },
  onTabItemTap: function (e) {
    app.onTabIndex = e.index
    //用户级别埋点
    app.getMemberLevel()
  },
  onServeTap(event) {
    let path = event.currentTarget.dataset.path
    if (path) {
      wx.navigateTo({
        url: path
      })
    }
  },
  // 查询用户昵称头像
  getUserInfo() {
    var {
      uid,
      token
    } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('userInfo', {
      uid,
      token,
      userInfoFlag: 0
    }).then(({
      data: res
    }) => {
      wx.hideLoading()
      if (res.status == '1') {
        this.setData({
          userInfo: res
        })
      }
    })
  },
  // 查询订单数量
  getOrderCount() {
    app.getUserToken.getToken().then(res => {
      if (res.status == 1) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.setData({
          miniProgramUserinfo: wx.getStorageSync('miniProgramUserinfo')
        })
        var {
          uid,
          token
        } = wx.getStorageSync('miniProgramUserinfo')
        app.ajax.postApi('querycountorder', {
          uid,
          token
        }).then(({
          data: res
        }) => {
          wx.hideLoading()
          var {
            dzf,
            dsh,
            shth,
            ywc
          } = res
          this.data.personalServe[0].icon.forEach((item, index) => {
            if (index == 0) {
              item.num = dzf
            } else if (index == 1) {
              item.num = dsh
            } else if (index == 2) {
              item.num = ywc
            } else if (index == 3) {
              item.num = shth
            }
          })
          this.setData({
            personalServe: this.data.personalServe
          })
        })
      }
    })
  },
  onLine() {
    let userInfo = wx.getStorageSync('miniProgramUserinfo');
    let ysf = {
      title: '在线客服',
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      config: JSON.stringify({
        "level": 1, // vip等级
        "data": JSON.stringify([{
            "key": "avatar",
            "value": userInfo.avatarUrl
          },
          {
            "key": "mobile_phone",
            "value": userInfo.mobile
          },
          {
            "key": "real_name",
            "value": userInfo.nickName
          }
        ])
      })
    }
    this.setData({
      ysf
    })
  }
})