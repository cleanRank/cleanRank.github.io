// pages/help/help.js
const app = getApp()
Page({
  // status [1表示没有二级分类，2表示有，3表示问题列表页，4表示跳转详情页]
  data: {
    peopleList:[],
    pageSize:10,
    pageNo:1,
    pageCount:1,
    nodataList: {
      imgSrc: '../../images/noData/noCon.png',
      isShowbtn: 0,
      jumpUrl: '',
      btnTxt: '还没有内容哦~'
    },
    nodata:1
  },
  onLoad: function () {
  },
  onShow: function () {
    this.getPendingList()
  },
  onHide:function(){
   this.setData({
     peopleList:[],
     pageNo:1,
     nodata:1
   })
  },
  onUnload:function(){
    this.setData({
      peopleList: [],
      pageNo: 1
    })
  },
  //上拉加载更多
  onReachBottom() {
    // 可使用红包页面没有上拉加载
    let pageNo = this.data.pageNo
    pageNo += 1
    this.setData({
      pageNo: pageNo
    })
    this.getPendingList()
  },
  getPendingList(){
    const { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    if (this.data.pageCount && this.data.pageCount < this.data.pageNo) {
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.getApi('ApplyFriends', {
      token: token,
      uid: uid,
      pageSize:this.data.pageSize,
      pageNo:this.data.pageNo
    }).then(res => {
      if (res.data.status == 1) {
        // 处理部分安卓手机锁屏再次开屏后触发两次onshow
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
          pageCount: res.data.pageCount,
        })
      }
      this.setData({
        nodata: 2
      })
      wx.hideLoading();
    })
  },
  addPeople(e){
    let status = e.target.dataset.type
    let friendUid = e.target.dataset.id
    const { uid, token } = wx.getStorageSync('miniProgramUserinfo')
    wx.showLoading({
      title: '消息发送中...',
    })
    app.ajax.getApi('AuditApplyFriend', {
      token: token,
      uid: uid,
      status,
      friendUid
    }).then(res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '发送成功',
        })
        this.setData({
          pageNo:1,
          peopleList: []
        })
        this.getPendingList()
      }
      wx.hideLoading();
    })
  }
})