//获取应用实例
const app = getApp()
import { wordCut } from '../../../utils/wordCut.js' // 引入文字限制api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tit:"",
    announceList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tit: wordCut(20, this.data.tit).str
    })
    this.getAnnounceList(1,10)
  },
  onShow: function (options) {
  },
  toAnnounceDetail:function(e){
    let contentId = e.currentTarget.dataset.contentid;
    let number = e.currentTarget.dataset.cnumber;
    wx.navigateTo({
      url: '/pages/vip/announceList/announceDetail/announceDetail?origin=announce&contentNum=null&back=2&contentId=' + contentId +'&number=' + number,
    })
  },
  //获取公告
  getAnnounceList: function (pageNum, pageSize) {
    let that = this;
    app.ajax.postApi('getAnnouncementList', {
      pageNo: pageNum,
      pageSize: pageSize
    }).then(res => {
      if (res.data.status == 1) {
        that.setData({
          announceList: res.data.data
        })
      }
    })
  }
})