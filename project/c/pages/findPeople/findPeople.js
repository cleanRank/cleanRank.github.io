// pages/help/help.js
const app = getApp()
Page({
  // status [1表示没有二级分类，2表示有，3表示问题列表页，4表示跳转详情页]
  data: {
    peopleList:[],
    pageIndex:1,
    pageCount: 1,
    obj: {
      type: 1,
      confirmBtnTxt: '确定',
    },
    currentFriend:{},
    nodataList: {
      imgSrc: '../../images/noData/noCon.png',
      isShowbtn: 0,
      jumpUrl: '',
      btnTxt: '还没有内容哦~',
      btnTxtTwo:''
    },
    nodata:1,
    showMo:false,
    ifLocation:false
  },
  onLoad: function () {
  },
  onShow: function () {
    // 获取地理位置信息
    this.getLocation()
    this.checkSetting()
  },
  onHide:function(){
    this.setData({
      pageIndex:1,
      peopleList:[]
    })
  },
  onUnload:function(){
    this.setData({
      pageIndex: 1,
      peopleList: []
    })
  },
  // 下拉刷新
  onPullDownRefresh() { 
    wx.stopPullDownRefresh()
    const { latitude, longitude } = wx.getStorageSync('location')
    this.setData({
      peopleList: [],
      nodata: 1,
      pageIndex: 1
    })
    if (this.data.ifLocation){
      this.getPeople(latitude, longitude) // 更新数据
    }else{
      this.setData({
        peopleList: [],
        nodata: 2,
        pageIndex: 1,
        nodataList: {
          imgSrc: '../../images/noData/noCon.png',
          isShowbtn: 0,
          jumpUrl: '',
          btnTxt: '定位服务尚未开启',
          btnTxtTwo: '开启后才能看到附近的买家哦'
        }
      })
    }
  },
  getPeople(lat,lon){
    if (this.data.pageCount && this.data.pageCount < this.data.pageNo) {
      return false
    }
    const {uid,token} = wx.getStorageSync('miniProgramUserinfo')
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.getApi('FindPeople', {
      token: token,
      uid: uid,
      latitude: lat,
      longitude: lon,
      pageIndex:this.data.pageIndex,
      pageSize:10
    }).then(res => {
      if(res.data.status==1){
        let peopleList = this.data.peopleList.concat(res.data.data)
        for (var i = 0; i < peopleList.length; i++) {
          for (var j = i + 1; j < peopleList.length; j++) {
            if (peopleList[i].uid == peopleList[j].uid) {
              peopleList.splice(j, 1);
              j--;
            }
          }
        }
        this.setData({
          peopleList: peopleList,
          pageCount: res.data.pageCount
        })
      }
      this.setData({
        nodata: 2
      })
      wx.hideLoading();
    })
  },
    //上拉加载更多
  onReachBottom() {
    // 可使用红包页面没有上拉加载
    if (this.data.pageIndex>=5) {
      return false  //最多50条
    }
    let pageIndex = this.data.pageIndex
    const { latitude, longitude } = wx.getStorageSync('location')
    pageIndex += 1
    this.setData({
      pageIndex: pageIndex
    })
    this.getPeople(latitude, longitude)
  },
  addPeople(e){
    let type=e.target.dataset.type
    let currentFriend=e.target.dataset.curr
    if(type==-1){
      this.setData({
        currentFriend:currentFriend
      })
      this.selectComponent("#messageWrap").showModal()
      this.setData({
        showMo:true
      })
    }
  },
  sendMessage(e){
    let message=e.detail
    let that=this
    const { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    const { latitude, longitude } = wx.getStorageSync('location')
    wx.showLoading({
      title: '发送中...',
    })
    app.ajax.getApi('AddFriend', {
      token: token,
      uid: uid,
      friendUid: that.data.currentFriend.uid,
      message:message	
    }).then(res => {
      if (res.data.status == 1) {
        this.selectComponent("#messageWrap").hideModal()
        that.setData({
          peopleList: [],
          pageIndex: 1,
          nodata:1,
          showMo:false
        })
        that.getPeople(latitude, longitude)
        setTimeout(function(){
          wx.showToast({
            title: '发送成功',
            icon: 'none',
            duration: 2000
          })
        },50)
      }else{
        wx.showToast({
          title: res.data.statusMessage,
          icon:'none',
          duration:2000
        })
      }
      wx.hideLoading();
    })
  },
  cancelModal(){
    this.setData({
      showMo:false
    })
  },
  // 验证是否地理位置授权
  checkSetting() {
    let that = this
    wx.getSetting({
      success(res) {
        console.log("授权信息：" + res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation']) {
          that.setData({
            ifLocation:true,
            nodataList: {
              imgSrc: '../../images/noData/noCon.png',
              isShowbtn: 0,
              jumpUrl: '',
              btnTxt: '还没有内容哦~',
              btnTxtTwo:''
            }
          })
        } else {
          that.setData({
            ifLocation:false,
            peopleList:[],
            nodata:2,
            nodataList: {
              imgSrc: '../../images/noData/noCon.png',
              isShowbtn: 0,
              jumpUrl: '',
              btnTxt: '定位服务尚未开启',
              btnTxtTwo:'开启后才能看到附近的买家哦'
            }
          })
        }
      }
    })
  },
  getLocation() {
    let that=this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.setStorageSync("location", {
          latitude,
          longitude
        })
        console.log("获取定位")
        wx.showLoading({
          title: '加载中...',
        })
        that.setData({
          nodataList: {
            imgSrc: '../../images/noData/noCon.png',
            isShowbtn: 0,
            jumpUrl: '',
            btnTxt: '还没有内容哦~',
            btnTxtTwo:''
          }
        })
        that.getPeople(latitude, longitude)
      },
      fail(err) {
        that.setData({
          peopleList:[],
          nodata:2,
          nodataList:{
            imgSrc: '../../images/noData/noCon.png',
            isShowbtn: 0,
            jumpUrl: '',
            btnTxt: '定位服务尚未开启',
            btnTxtTwo: '开启后才能看到附近的买家哦'
          }
        })
      }
    })
  }
})