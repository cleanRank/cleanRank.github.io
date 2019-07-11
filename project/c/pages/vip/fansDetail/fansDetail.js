// pages/vip/fansDetail/fansDetail.js
//获取应用实例
const app = getApp()
import { copyText } from '../../../utils/common.js' // 引入复制文本api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    followerUid: '', // 粉丝id
    followerDetail: {},
    followerOrderList: [],
    memberLevelList: ['小象首席体验官', '银牌合伙人', '水象合伙人'],
    pageNo: 1,
    pageSize: 10, // 默认10条
    pageCount: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      followerUid: options.followerUid
    })
  },
  onShow: function () {
    this.setData({
      pageNo: 1,
      pageCount: 1
    })
    this.getFollowerdetail()
  },
  onReachBottom: function () {
    this.getFollowerdetail('1')
  },
  // 获取粉丝详情
  getFollowerdetail: function (n) {
    if (this.data.pageCount < this.data.pageNo) {
      return Promise.resolve()
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this
    var { token, uid } = wx.getStorageSync('miniProgramUserinfo')
    app.ajax.postApi('followerDetailNew', {
      'token': token,
      'uid': uid,
      'followerUid': that.data.followerUid,
      'pageNo': that.data.pageNo,
      'pageSize': that.data.pageSize
    }).then(res => {
      var res = res.data
      if (res.status == 1) {

        if(res.data.memberLevel==1){
          // 如果已经选过银牌合伙人类型就显示类型
          if(res.data.levelOneTitleName){
            let memberLevelList = this.data.memberLevelList
            memberLevelList[res.data.memberLevel]=res.data.levelOneTitleName
            this.setData({
              memberLevelList
            })
          }
        }
        
        this.setData({
          pageNo: this.data.pageNo += 1,
          pageCount: res.pageCount || 1
        })
        if (!n) {
          that.setData({
            'followerDetail.avatarUrl': res.data.avatarUrl,
            'followerDetail.bindTime': res.data.bindTime,
            'followerDetail.memberLevel': res.data.memberLevel,
            'followerDetail.nickName': res.data.nickName,
            'followerDetail.totalContributeIncome': res.data.totalContributeIncome,
            'followerDetail.totalOrderCnt': res.data.totalOrderCnt,
            'followerDetail.uid': res.data.uid,
            followerOrderList: res.data.followerOrderList
          })
        } else {
          var newData = this.data.followerOrderList.concat(res.data.followerOrderList)
          this.setData({
            followerOrderList: newData
          })
        }
        
      } else {
        // 失败提示
        wx.showToast({
          title: res.statusDetail,
          duration: 2000
        })
      }
      wx.hideLoading()
    })
  },
  // 复制文本
  copyText(e) {
    copyText(e)
  }
})